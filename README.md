# CardioPredict

CardioPredict is a React/Vite frontend with a Flask API that uses the included trained K-nearest-neighbors classifier to classify the likelihood of **heart disease** from the Heart Disease dataset. This is an educational screening aid, not a medical diagnosis.

## Requirements
- Python 3.10–3.12 recommended (use a version supported by the installed scikit-learn release)
- Node.js 20.19+ or 22.12+

## Run on Windows

### Terminal 1 — backend
```powershell
cd CardioPredict
py -3.11 -m venv backend\venv
.\backend\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
python backend\app.py
```

Verify in a browser: `http://127.0.0.1:5000/api/health`.

### Terminal 2 — frontend
```powershell
cd CardioPredict\frontend
npm install
npm run dev
```

Open the local URL printed by Vite. By default the frontend calls `http://127.0.0.1:5000`. To use another backend URL, create `frontend/.env.local` with `VITE_API_URL=http://127.0.0.1:5000` and restart Vite.

## Model artifacts
The API loads `backend/KNN_heart.pkl`, `backend/scaler.pkl`, and `backend/columns.pkl`. The training notebook uses `HeartDisease` as the target and one-hot encodes the input features with `pandas.get_dummies(drop_first=True)`, then standardizes them before fitting KNN. The original dataset and artifacts are retained.

## Important
The output is a binary heart-disease classification (`0` = heart disease not predicted, `1` = heart disease predicted). It is not a stroke prediction, and the UI does not present an invented percentage. Seek professional medical advice for symptoms or health concerns.
