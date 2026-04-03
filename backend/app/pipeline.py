from __future__ import annotations

from io import BytesIO
from typing import Any

import numpy as np
import pandas as pd

REQUIRED_COLUMNS = [
    "influencer_name",
    "type",
    "influencer_id",
    "username",
    "followers_count",
    "following_count",
    "avg_likes",
    "avg_comments",
    "total_posts",
    "account_age_days",
    "profile_complete",
    "label",
]

EPSILON = 1e-9


class DataValidationError(ValueError):
    pass


def _min_max(series: pd.Series) -> pd.Series:
    series = pd.to_numeric(series, errors="coerce").fillna(0.0)
    s_min = series.min()
    s_max = series.max()
    return (series - s_min) / (s_max - s_min + EPSILON)


def _entropy_weights(feature_matrix: pd.DataFrame) -> dict[str, float]:
    n = len(feature_matrix)
    if n == 0:
        return {"w_p": 1 / 3, "w_e": 1 / 3, "w_t": 1 / 3}

    matrix = feature_matrix.clip(lower=0.0).astype(float)
    column_sums = matrix.sum(axis=0) + EPSILON
    p = matrix.div(column_sums, axis=1)

    k = 1.0 / np.log(max(n, 2))
    entropy = -k * (p * np.log(p + EPSILON)).sum(axis=0)
    diversification = 1.0 - entropy
    d_sum = diversification.sum() + EPSILON
    weights = diversification / d_sum
    return {
        "w_p": float(weights["ProfileScore"]),
        "w_e": float(weights["EngagementScore"]),
        "w_t": float(weights["TemporalScore"]),
    }


def _category(risk: float) -> str:
    if risk < 0.4:
        return "Genuine"
    if risk <= 0.7:
        return "Suspicious"
    return "Bot"


def run_analysis(file_bytes: bytes) -> dict[str, Any]:
    df = pd.read_csv(BytesIO(file_bytes))
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise DataValidationError(f"Missing required columns: {missing}")

    numeric_cols = [
        "followers_count",
        "following_count",
        "avg_likes",
        "avg_comments",
        "total_posts",
        "account_age_days",
        "profile_complete",
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

    df["profile_complete"] = df["profile_complete"].clip(lower=0, upper=1)
    df["is_influencer"] = df["type"].astype(str).str.lower().eq("influencer")
    follower_df = df[~df["is_influencer"]].copy()

    if follower_df.empty:
        raise DataValidationError(
            "No follower rows found. Ensure influencer rows are marked with type='influencer'."
        )

    follower_df["ratio"] = follower_df["followers_count"] / (follower_df["following_count"] + 1.0)
    follower_df["engagement_ratio"] = (
        follower_df["avg_likes"] + follower_df["avg_comments"]
    ) / (follower_df["followers_count"] + 1.0)
    follower_df["activity_rate"] = follower_df["total_posts"] / (follower_df["account_age_days"] + 1.0)

    follower_df["ratio_norm"] = _min_max(follower_df["ratio"])
    follower_df["age_norm"] = _min_max(follower_df["account_age_days"])
    follower_df["engagement_norm"] = _min_max(follower_df["engagement_ratio"])
    follower_df["activity_norm"] = _min_max(follower_df["activity_rate"])

    follower_df["ProfileScore"] = (
        (1 - follower_df["ratio_norm"])
        + (1 - follower_df["age_norm"])
        + (1 - follower_df["profile_complete"])
    ) / 3.0
    follower_df["EngagementScore"] = 1 - follower_df["engagement_norm"]
    follower_df["TemporalScore"] = follower_df["activity_norm"]

    weights = _entropy_weights(
        follower_df[["ProfileScore", "EngagementScore", "TemporalScore"]]
    )

    follower_df["risk_score"] = (
        weights["w_p"] * follower_df["ProfileScore"]
        + weights["w_e"] * follower_df["EngagementScore"]
        + weights["w_t"] * follower_df["TemporalScore"]
    )
    follower_df["category"] = follower_df["risk_score"].map(_category)

    grouped = follower_df.groupby(["influencer_name", "influencer_id"], dropna=False)
    summaries = []

    for (name, inf_id), group in grouped:
        total = int(len(group))
        genuine = int((group["category"] == "Genuine").sum())
        suspicious = int((group["category"] == "Suspicious").sum())
        bot = int((group["category"] == "Bot").sum())

        credibility = (genuine + 0.5 * suspicious) / max(total, 1)
        status = "Genuine influencer" if credibility >= 0.65 else "Fake influencer"

        summaries.append(
            {
                "influencer_name": str(name),
                "influencer_id": str(inf_id),
                "total_followers": total,
                "genuine_count": genuine,
                "suspicious_count": suspicious,
                "bot_count": bot,
                "credibility_score": round(float(credibility), 4),
                "status": status,
            }
        )

    detail_preview = (
        follower_df[
            ["username", "influencer_id", "risk_score", "category", "ProfileScore", "EngagementScore", "TemporalScore"]
        ]
        .sort_values(["influencer_id", "risk_score"], ascending=[True, False])
        .head(1000)
    )

    return {
        "summary": sorted(summaries, key=lambda x: x["credibility_score"], reverse=True),
        "preview": df.head(200).fillna("").to_dict(orient="records"),
        "follower_details": detail_preview.to_dict(orient="records"),
        "weights": {k: round(v, 4) for k, v in weights.items()},
    }
