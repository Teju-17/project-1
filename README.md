# Influencer Credibility Auditor

Production-style end-to-end web application that detects fake followers and audits influencer credibility using an entropy-weighted heuristic pipeline.

## Folder Structure

```
project-1/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── pipeline.py
│   │   └── schemas.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
└── data/
    └── sample_influencer_followers.csv
```

## Backend (FastAPI + pandas + numpy)

### Features
- CSV upload endpoint: `POST /analyze`
- Validates required columns
- Processes influencer/follower grouped schema
- Skips influencer rows (`type=influencer`) and analyzes follower rows only
- Implements required feature engineering, min-max normalization, entropy weighting, risk scoring, and credibility formula
- Returns only summary + bounded preview (first 200 rows) + bounded follower detail sample

### Run Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Frontend (React + Vite + Tailwind + Recharts)

### Implemented Pages
1. Dashboard Overview
2. Data Upload
3. Detection Results
4. Explanation & Justification
5. Audit & Reports
6. Algorithm Overview

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Set API base URL if needed:

```bash
export VITE_API_URL=http://localhost:8000
```

## API Response Shape

```json
{
  "summary": [
    {
      "influencer_name": "AvaStyle",
      "influencer_id": "inf_1001",
      "total_followers": 120,
      "genuine_count": 75,
      "suspicious_count": 30,
      "bot_count": 15,
      "credibility_score": 0.75,
      "status": "Genuine influencer"
    }
  ],
  "preview": [],
  "follower_details": [],
  "weights": {"w_p": 0.33, "w_e": 0.34, "w_t": 0.33}
}
```

## Performance Notes
- Designed for 200k+ rows with vectorized pandas operations.
- Frontend renders only summary and capped previews for smooth UI.
- Backend avoids returning full raw dataset.
