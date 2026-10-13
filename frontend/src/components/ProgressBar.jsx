
import React from "react";

export default function ProgressBar({ step = 1 }) {
  const progress = step === 1 ? 50 : 100;

  return (
    <div className="progress-section">
      <div className="progress-label">
        <span>Step {step} of 2</span>
        <span className="progress-dot">•</span>
        <span>{step === 1 ? "Health details" : "Additional details"}</span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
