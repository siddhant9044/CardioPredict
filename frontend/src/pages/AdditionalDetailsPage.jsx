import React, { useState } from "react";
import { ArrowLeft, Activity, Info, ShieldCheck } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import HealthMetricCard from "../components/HealthMetricCard";
import "../styles/additional-details.css";

export default function AdditionalDetailsPage({
  initialValues = {},
  onBack,
  onPredict,
  isPredicting = false,
  predictionError = "",
}) {
  const [values, setValues] = useState(() => ({
    thalach: String(initialValues.thalach ?? ""),
    exang: String(initialValues.exang ?? ""),
    oldpeak: String(initialValues.oldpeak ?? ""),
    slope: String(initialValues.slope ?? ""),
  }));

  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (Object.values(values).some((value) => value === "")) {
      setError("Please complete all required fields.");
      return;
    }

    onPredict({
      ...initialValues,
      ...values,
    });
  }

  return (
    <main className="additional-shell">
      <section className="additional-intro health-hero-background">
        <span className="eyebrow">HEART HEALTH</span>

        <h1>
          Complete
          <br />
          Your Health
          <br />
          <span>Information</span>
        </h1>

        <p className="additional-description">
          Provide a few more details to complete your assessment
          and get your heart health prediction.
        </p>

        <div className="additional-metrics">
          <HealthMetricCard
            type="heart"
            title="Heart Rate"
            value="72"
            unit="bpm"
            color="red"
          />

          <HealthMetricCard
            type="blood"
            title="Blood Pressure"
            value="120/80"
            unit="mmHg"
            color="blue"
          />

          <HealthMetricCard
            type="activity"
            title="Cholesterol"
            value="200"
            unit="mg/dL"
            color="orange"
          />
        </div>

        <div className="accuracy-note">
          <ShieldCheck size={25} />
          <p>
            Accurate information helps provide
            <br />
            a better risk assessment.
          </p>
        </div>
      </section>

      <section className="additional-form-panel">
        <ProgressBar step={2} />

        <div className="additional-heading">
          <h2>Additional health details</h2>
          <p>
            Please provide the following information to complete your
            assessment.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="additional-grid">
            <label className="form-field">
              <span>Max heart rate <b>*</b></span>

              <div className="input-with-unit">
                <input
                  type="number"
                  name="thalach"
                  min="1"
                  placeholder="e.g. 150"
                  value={values.thalach}
                  onChange={updateField}
                  required
                />

                <span className="input-unit">bpm</span>
              </div>
            </label>

            <label className="form-field">
              <span>Exercise-induced angina <b>*</b></span>

              <select
                name="exang"
                value={values.exang}
                onChange={updateField}
                required
              >
                <option value="">Select option</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </label>

            <label className="form-field">
              <span>Oldpeak (ST depression) <b>*</b></span>

              <div className="input-with-unit">
                <input
                  type="number"
                  name="oldpeak"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="e.g. 1.00"
                  value={values.oldpeak}
                  onChange={updateField}
                  required
                />

                <span className="input-unit">mm</span>
              </div>
            </label>

            <label className="form-field">
              <span>ST slope <b>*</b></span>

              <select
                name="slope"
                value={values.slope}
                onChange={updateField}
                required
              >
                <option value="">Select option</option>
                <option value="0">Upsloping</option>
                <option value="1">Flat</option>
                <option value="2">Downsloping</option>
              </select>
            </label>
          </div>

          <div className="parameter-note">
            <Info size={23} />

            <div>
              <strong>About these parameters</strong>
              <p>
                These details help evaluate how your heart responds to
                physical activity and provide a more complete assessment.
              </p>
            </div>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {predictionError && (
            <p className="form-error" role="alert">
              {predictionError}
            </p>
          )}

          <div className="additional-actions">
            <button
              type="button"
              className="back-button"
              onClick={onBack}
              disabled={isPredicting}
            >
              <ArrowLeft size={19} />
              Back
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isPredicting}
            >
              <Activity size={20} />
              {isPredicting ? "Predicting..." : "Predict Risk"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}