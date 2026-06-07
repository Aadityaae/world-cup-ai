# ⚽ Cup'26 — AI-Powered FIFA World Cup 2026 Predictor

> **Live Demo:** [https://world-cup-ai-pied.vercel.app](https://world-cup-ai-pied.vercel.app)
> **API:** [https://world-cup-ai-production.up.railway.app](https://world-cup-ai-production.up.railway.app)

A full-stack, end-to-end machine learning web application that predicts FIFA World Cup 2026 match outcomes, simulates group stage standings for all 12 groups, and runs a complete 48-team knockout bracket simulation — all powered by real historical World Cup data.

---

## 📸 Features

| Feature | Description |
|---|---|
| 🔮 **Match Predictor** | Select any two of the 48 qualified teams and get AI-predicted win/draw probabilities with head-to-head history |
| 📊 **Group Stage** | All 12 real World Cup 2026 groups with predicted standings, match scores and qualification spots |
| 🏆 **Tournament Simulator** | Full 48-team bracket simulation using official FIFA Round of 32 matchups |
| 🏴 **Country Flags** | All 48 qualified nations with real flag icons |
| ✨ **Smooth Animations** | 60fps Framer Motion animations throughout |

---

## 🧠 Machine Learning Pipeline

### Data Collection & Engineering
- **Dataset:** 964 FIFA World Cup matches (1930–2022) from Kaggle + FIFA rankings
- **Feature Engineering:**
  - Rolling win rate per team (historical)
  - Recent form — last 5 match win rate
  - Average goals scored/conceded per game
  - Win rate differential between teams
  - Stage encoding (group vs knockout)
  - Goal difference average

### Model 1 — Match Outcome Predictor (XGBoost)
```
Input:  Team encodings, win rates, goals per game, recent form, stage
Output: P(Home Win), P(Away Win), P(Draw)
Model:  XGBClassifier
Accuracy: 54.4% (3-class: Home Win / Away Win / Draw)
Baseline: 33.3% (random), Industry benchmark: ~60-65%
```

**Why 54.4% is good:** Football is inherently stochastic. Professional bookmakers achieve ~62-65% — our model uses only historical stats without live player data, injuries, or odds, making 54.4% a strong result.

**Model iterations:**
- V1 (Logistic Regression baseline): 53.37%
- V2 (XGBoost + feature engineering): 54.40% ↑

### Model 2 — Team Play Style Clustering (KMeans)
```
Input:  7 team profile features (win rate, goals/game, conceded/game, 
        goal difference, attack score, defense score, draw rate)
Output: 4 clusters — Elite / Attacking / Defensive / Developing
Model:  KMeans (k=4, StandardScaler normalized)
Metric: Silhouette Score = 0.388
```

**Cluster labels assigned programmatically** based on centroid statistics:
- 🏆 **Elite** — highest win rate cluster
- ⚔️ **Attacking** — highest goals per game
- 🛡️ **Defensive** — lowest goals conceded
- 📈 **Developing** — remaining cluster

### Tournament Simulation Logic
- Simulates full 48-team bracket using **official FIFA Annex C matchup rules**
- Top 2 from each group qualify automatically (24 teams)
- Best 8 third-place teams qualify based on points → GD → GF
- Round of 32 matchups follow FIFA's pre-defined bracket structure
- Knockout predictions use `predict_proba` — higher probability team advances

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│         (Vite + Tailwind + Framer Motion)               │
│   Home │ Match Predictor │ Group Stage │ Simulator      │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (Axios)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   Flask REST API                         │
│              (Gunicorn + Flask-CORS)                    │
│                                                         │
│  GET  /teams              → 48 qualified teams          │
│  POST /predict            → match outcome prediction    │
│  GET  /team-stats/<name>  → team profile + play style   │
│  POST /head-to-head       → H2H historical record       │
│  GET  /group-stage        → all 12 group simulations    │
│  GET  /group-stage/<X>    → single group simulation     │
│  GET  /simulate           → full 48-team bracket        │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   XGBoost          KMeans        Pandas
   Predictor       Clusterer     DataFrames
   (.joblib)       (.joblib)     (.csv)
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python 3.12 | Core language |
| Flask + Flask-CORS | REST API framework |
| XGBoost | Match outcome prediction |
| Scikit-learn | KMeans clustering, preprocessing, evaluation |
| Pandas + NumPy | Data manipulation and feature engineering |
| Joblib | Model serialization and loading |
| Gunicorn | Production WSGI server |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS v3 | Utility-first styling |
| Framer Motion | GPU-accelerated animations |
| Axios | HTTP client for API calls |
| React Router v6 | Client-side routing |
| Flag Icons | Country flag CSS library |

### DevOps & Deployment
| Technology | Purpose |
|---|---|
| Railway | Flask API + ML models hosting |
| Vercel | React frontend CDN deployment |
| GitHub | Version control + CI/CD triggers |
| Nixpacks | Automated build on Railway |

---

## 📁 Project Structure

```
world-cup-ai/
│
├── backend/                    # Flask API
│   ├── app.py                  # Main API with all endpoints
│   ├── models/                 # Serialized ML models
│   │   ├── match_predictor.joblib
│   │   ├── label_encoder.joblib
│   │   ├── kmeans_model.joblib
│   │   ├── scaler.joblib
│   │   └── cluster_features.joblib
│   ├── data/                   # Processed data (copied for deployment)
│   │   ├── team_profiles.csv
│   │   └── matches_clean.csv
│   ├── requirements.txt
│   ├── Procfile
│   └── nixpacks.toml
│
├── frontend/                   # React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Predict.jsx
│   │   │   ├── Groups.jsx
│   │   │   └── Simulate.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── GroupTable.jsx
│   │   │   ├── PredictionCard.jsx
│   │   │   └── TeamStatsCard.jsx
│   │   └── utils/
│   │       ├── api.js          # Axios API calls
│   │       └── flags.jsx       # Team → ISO country code mapping
│   └── package.json
│
├── notebooks/                  # Jupyter notebooks
│   ├── 01_EDA.ipynb            # Exploratory data analysis
│   ├── 02_ML_Model.ipynb       # XGBoost model training
│   └── 03_xG_Clustering.ipynb  # KMeans clustering + simulator
│
└── data/
    ├── raw/                    # Original Kaggle datasets
    └── processed/              # Cleaned and feature-engineered data
```

---

## 🚀 Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### Backend Setup
```bash
# Clone the repo
git clone https://github.com/Aadityaae/world-cup-ai.git
cd world-cup-ai

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install flask flask-cors pandas numpy scikit-learn xgboost joblib gunicorn

# Run the API
cd backend
python app.py
# API running at http://127.0.0.1:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

### Data & Model Generation
To regenerate models from scratch, run the Jupyter notebooks in order:
```bash
cd notebooks
jupyter notebook

# Run in order:
# 1. 01_EDA.ipynb       → generates data/processed/matches_clean.csv
# 2. 02_ML_Model.ipynb  → generates backend/models/match_predictor.joblib
# 3. 03_xG_Clustering.ipynb → generates backend/models/kmeans_model.joblib
```

---

## 📡 API Reference

### `POST /predict`
Predict match outcome between two teams.

**Request:**
```json
{
  "home_team": "Brazil",
  "away_team": "Argentina"
}
```

**Response:**
```json
{
  "home_team": "Brazil",
  "away_team": "Argentina",
  "home_win_prob": 61.2,
  "away_win_prob": 28.4,
  "draw_prob": 10.4,
  "predicted_winner": "Brazil",
  "confidence": 61.2
}
```

### `GET /group-stage`
Returns predicted standings for all 12 groups.

### `GET /group-stage/<letter>`
Returns standings for a single group (e.g. `/group-stage/I` for Group I).

### `GET /simulate`
Runs full 48-team bracket simulation using official FIFA Round of 32 rules.

### `GET /team-stats/<team_name>`
Returns team profile including win rate, goals per game, and play style cluster.

### `POST /head-to-head`
Returns historical head-to-head record between two teams.

---

## 📊 Model Performance

| Metric | Value |
|---|---|
| Training samples | 771 matches (80%) |
| Test samples | 193 matches (20%) |
| Model accuracy | 54.4% |
| Baseline (majority class) | 56.5% (Home Win) |
| Classes | Home Win / Away Win / Draw |
| Best features | Win Rate Diff, Home Win Rate, Away Win Rate |

**Confusion matrix insights:**
- Home wins predicted most accurately (largest class)
- Draws hardest to predict (smallest class, most stochastic)
- Away wins improved significantly with feature engineering

---

## 🔮 Future Improvements

- [ ] Integrate live FIFA API for real-time 2026 match data
- [ ] Add LSTM model for sequential team form prediction
- [ ] Expected Goals (xG) model using shot data
- [ ] Player-level features (top scorer form, key player availability)
- [ ] Live score updates during the tournament
- [ ] User bracket prediction with leaderboard

---

## 👨‍💻 Author

**Aaditya**  
Built during the 2026 FIFA World Cup  
GitHub: [@Aadityaae](https://github.com/Aadityaae)

---

## 📄 License

MIT License — feel free to fork and build on this!

---
