from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__)
CORS(app)

# Load the existing trained model and preprocessing artifacts.
model = joblib.load(BASE_DIR / "KNN_heart.pkl")
scaler = joblib.load(BASE_DIR / "scaler.pkl")
expected_columns = joblib.load(BASE_DIR / "columns.pkl")

CATEGORIES = {
    "sex": {"M", "F"},
    "chest_pain": {"ATA", "NAP", "TA", "ASY"},
    "resting_ecg": {"Normal", "ST", "LVH"},
    "exercise_angina": {"Y", "N"},
    "st_slope": {"Up", "Flat", "Down"},
}

NUMERIC_RANGES = {
    "age": (1, 120),
    "resting_bp": (1, 300),
    "cholesterol": (0, 1000),
    "fasting_bs": (0, 1),
    "max_hr": (1, 300),
    "oldpeak": (-10, 15),
}


def validate_input(data):
    required = [
        "age",
        "sex",
        "chest_pain",
        "resting_bp",
        "cholesterol",
        "fasting_bs",
        "resting_ecg",
        "max_hr",
        "exercise_angina",
        "oldpeak",
        "st_slope",
    ]

    if not isinstance(data, dict):
        raise ValueError("Request body must be a JSON object.")

    missing = [
        field
        for field in required
        if field not in data or data[field] in ("", None)
    ]

    if missing:
        raise ValueError(
            "Missing required fields: " + ", ".join(missing)
        )

    result = {}

    for field, (minimum, maximum) in NUMERIC_RANGES.items():
        try:
            value = float(data[field])
        except (TypeError, ValueError):
            raise ValueError(f"{field} must be numeric.")

        if not minimum <= value <= maximum:
            raise ValueError(
                f"{field} must be between {minimum} and {maximum}."
            )

        if field != "oldpeak" and not value.is_integer():
            raise ValueError(f"{field} must be a whole number.")

        result[field] = int(value) if value.is_integer() else value

    if result["fasting_bs"] not in (0, 1):
        raise ValueError("fasting_bs must be 0 or 1.")

    for field, allowed in CATEGORIES.items():
        if data[field] not in allowed:
            raise ValueError(
                f"Invalid {field}. Allowed values: {sorted(allowed)}"
            )

        result[field] = data[field]

    return result


def build_model_input(data):
    raw_input = {
        "Age": data["age"],
        "RestingBP": data["resting_bp"],
        "Cholesterol": data["cholesterol"],
        "FastingBS": data["fasting_bs"],
        "MaxHR": data["max_hr"],
        "Oldpeak": data["oldpeak"],
        "Sex_" + data["sex"]: 1,
        "ChestPainType_" + data["chest_pain"]: 1,
        "RestingECG_" + data["resting_ecg"]: 1,
        "ExerciseAngina_" + data["exercise_angina"]: 1,
        "ST_Slope_" + data["st_slope"]: 1,
    }

    input_df = pd.DataFrame([raw_input])

    for column in expected_columns:
        if column not in input_df.columns:
            input_df[column] = 0

    # Preserve the exact feature order expected by the trained model.
    input_df = input_df[expected_columns]

    return input_df


@app.get("/api/health")
def health_check():
    return jsonify({
        "status": "ok",
        "message": "CardioPredict API is running.",
        "condition": "heart_disease",
        "model": type(model).__name__,
        "expected_feature_count": len(expected_columns),
    })


@app.post("/api/predict")
def predict():
    try:
        data = validate_input(request.get_json(silent=True))
        input_df = build_model_input(data)

        scaled_input = scaler.transform(input_df)
        prediction = int(model.predict(scaled_input)[0])

        risk_level = "high" if prediction == 1 else "low"
        prediction_label = "Heart disease predicted" if prediction == 1 else "Heart disease not predicted"

        return jsonify({
            "success": True,
            "prediction": prediction,
            "prediction_label": prediction_label,
            "risk_level": risk_level,
            "condition": "heart_disease",
            "message": (
                "The model predicts a higher risk of heart disease."
                if prediction == 1
                else "The model predicts a lower risk of heart disease."
            ),
        })

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error)
        }), 400

    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify({
            "success": False,
            "error": "Prediction failed. Check the backend logs."
        }), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
