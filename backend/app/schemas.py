from pydantic import BaseModel


class InfluencerSummary(BaseModel):
    influencer_name: str
    influencer_id: str
    total_followers: int
    genuine_count: int
    suspicious_count: int
    bot_count: int
    credibility_score: float
    status: str
