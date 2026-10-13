const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

const maps = {
  sex: { "1": "M", "0": "F", M: "M", F: "F" },
  cp: { "0": "TA", "1": "ATA", "2": "NAP", "3": "ASY", TA: "TA", ATA: "ATA", NAP: "NAP", ASY: "ASY" },
  restecg: { "0": "Normal", "1": "ST", "2": "LVH", Normal: "Normal", ST: "ST", LVH: "LVH" },
  exang: { "0": "N", "1": "Y", N: "N", Y: "Y" },
  slope: { "0": "Up", "1": "Flat", "2": "Down", Up: "Up", Flat: "Flat", Down: "Down" },
};

export function mapAssessmentPayload(values) {
  return {
    age: values.age,
    sex: maps.sex[String(values.sex)] ?? values.sex,
    chest_pain: maps.cp[String(values.cp ?? values.chest_pain)] ?? values.chest_pain,
    resting_bp: values.trestbps ?? values.resting_bp,
    cholesterol: values.chol ?? values.cholesterol,
    fasting_bs: values.fbs ?? values.fasting_bs,
    resting_ecg: maps.restecg[String(values.restecg ?? values.resting_ecg)] ?? values.resting_ecg,
    max_hr: values.thalach ?? values.max_hr,
    exercise_angina: maps.exang[String(values.exang ?? values.exercise_angina)] ?? values.exercise_angina,
    oldpeak: values.oldpeak,
    st_slope: maps.slope[String(values.slope ?? values.st_slope)] ?? values.st_slope,
  };
}

export async function predictHeartDisease(healthDetails) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapAssessmentPayload(healthDetails)),
    });
  } catch {
    throw new Error("Cannot connect to the prediction server. Start the Flask backend and try again.");
  }
  let result;
  try { result = await response.json(); }
  catch { throw new Error("The prediction server returned an invalid response."); }
  if (!response.ok || !result.success) throw new Error(result.error || `Prediction failed (HTTP ${response.status}).`);
  if (![0, 1].includes(Number(result.prediction)) || result.condition !== "heart_disease") {
    throw new Error("The server response did not contain a valid heart-disease prediction.");
  }
  return result;
}

export async function checkBackendHealth() {
  const response = await fetch(`${API_URL}/api/health`);
  if (!response.ok) throw new Error("The prediction server is unavailable.");
  return response.json();
}
