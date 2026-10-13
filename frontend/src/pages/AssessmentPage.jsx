import React, { useState } from "react";
import { HeartPulse, ArrowRight } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import HealthMetricCard from "../components/HealthMetricCard";
import "../styles/assessment.css";

export default function AssessmentPage({
  onNext,
  initialValues: savedValues = {},
}) {
  const [values, setValues] = useState(() => ({
    age: String(savedValues.age ?? ""),
    sex: String(savedValues.sex ?? ""),
    cp: String(savedValues.cp ?? ""),
    trestbps: String(savedValues.trestbps ?? ""),
    chol: String(savedValues.chol ?? ""),
    fbs: String(savedValues.fbs ?? ""),
    restecg: String(savedValues.restecg ?? ""),
  }));

  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (Object.values(values).some((value) => value === "")) {
      setError("Please complete all required fields.");
      return;
    }

    onNext(values);
  }

  return (
    <main className="assessment-shell">
      <section className="assessment-intro health-hero-background">
        <span className="eyebrow">HEART HEALTH • PERSONAL CHECK</span>

        <h1>
          Heart Disease
          <br />
          Risk Assessment
        </h1>

        <p className="intro-description">
          Enter your health details to receive a risk estimate
          and understand the factors that may matter.
        </p>

 <div className="heart-visual">
  <div className="floating-metric metric-blood">
    <HealthMetricCard
      type="blood"
      title="Blood pressure"
      value="120/80"
      unit="mmHg"
      color="red"
    />
  </div>

  <div className="floating-metric metric-heart">
    <HealthMetricCard
      type="heart"
      title="Heart rate"
      value="72"
      unit="bpm"
      color="blue"
    />
  </div>
</div>
        <p className="intro-caption">
          Your heart health, made easier to understand.
        </p>
      </section>

      <section className="assessment-form-panel">
        <div className="form-heading">
          <h2>Your health details</h2>
          <p>
            Fields marked with <span className="required">*</span> are required
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="assessment-grid">
            <label className="form-field">
              <span>Age <b>*</b></span>
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                placeholder="Enter age"
                value={values.age}
                onChange={updateField}
                required
              />
            </label>

            <label className="form-field">
              <span>Sex <b>*</b></span>
              <select
                name="sex"
                value={values.sex}
                onChange={updateField}
                required
              >
                <option value="">Select sex</option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </label>

            <label className="form-field field-full">
              <span>Chest pain type <b>*</b></span>
              <select
                name="cp"
                value={values.cp}
                onChange={updateField}
                required
              >
                <option value="">Select chest pain type</option>
                <option value="0">Typical angina</option>
                <option value="1">Atypical angina</option>
                <option value="2">Non-anginal pain</option>
                <option value="3">Asymptomatic</option>
              </select>
            </label>

            <label className="form-field">
              <span>Resting blood pressure (mm Hg) <b>*</b></span>
              <input
                type="number"
                name="trestbps"
                min="1"
                placeholder="e.g. 120"
                value={values.trestbps}
                onChange={updateField}
                required
              />
            </label>

            <label className="form-field">
              <span>Cholesterol (mg/dL) <b>*</b></span>
              <input
                type="number"
                name="chol"
                min="1"
                placeholder="e.g. 200"
                value={values.chol}
                onChange={updateField}
                required
              />
            </label>

            <label className="form-field">
              <span>Fasting blood sugar above 120 mg/dL <b>*</b></span>
              <select
                name="fbs"
                value={values.fbs}
                onChange={updateField}
                required
              >
                <option value="">Select yes or no</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </label>

            <label className="form-field">
              <span>Resting ECG <b>*</b></span>
              <select
                name="restecg"
                value={values.restecg}
                onChange={updateField}
                required
              >
                <option value="">Select ECG result</option>
                <option value="0">Normal</option>
                <option value="1">ST-T wave abnormality</option>
                <option value="2">Left ventricular hypertrophy</option>
              </select>
            </label>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-footer">
            <ProgressBar step={1} />

            <button type="submit" className="primary-button">
              Continue
              <ArrowRight size={19} />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}