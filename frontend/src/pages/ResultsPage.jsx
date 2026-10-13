import React from "react";
import {
  Heart,
  Activity,
  Apple,
  Moon,
  Stethoscope,
  PersonStanding,
  Ban,
  ShieldCheck,
  Info,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import "../styles/results.css";

const riskContent = {
  low: {
    label: "Low Risk",
    color: "low",
    description:
      "The model indicates a lower predicted risk based on the information assessed. Continue preventive care and routine health checkups.",
  },
  moderate: {
    label: "Moderate Risk",
    color: "moderate",
    description:
      "Some factors may warrant additional attention. Consider discussing your cardiovascular health with a qualified healthcare professional.",
  },
  high: {
    label: "High Risk",
    color: "high",
    description:
      "The model indicates an elevated predicted risk. Arrange a prompt medical evaluation to understand your individual health needs.",
  },
};

function InsightCard({ icon: Icon, title, description, color }) {
  return (
    <article className="insight-card">
      <div className={`insight-icon ${color}`}>
        <Icon size={24} strokeWidth={1.9} />
      </div>

      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </article>
  );
}

function Recommendation({ icon: Icon, title, color }) {
  return (
    <div className="recommendation-item">
      <div className={`recommendation-icon ${color}`}>
        <Icon size={23} strokeWidth={1.9} />
      </div>

      <span>{title}</span>
    </div>
  );
}

export default function ResultsPage({ prediction, onRestart }) {
  const rawRisk =
    prediction?.risk_level ??
    prediction?.riskLevel ??
    prediction?.risk_category;

  const normalizedRisk = String(rawRisk ?? "").toLowerCase();

  const riskKey = normalizedRisk.includes("high")
    ? "high"
    : normalizedRisk.includes("moderate") ||
        normalizedRisk.includes("medium")
      ? "moderate"
      : normalizedRisk.includes("low")
        ? "low"
        : null;

  const risk = riskKey ? riskContent[riskKey] : null;

  return (
    <main className="results-shell">
      <section className="results-left health-hero-background">
        <span className="eyebrow">RESULT</span>

        <h1>
          Heart Disease
          <br />
          Risk Assessment
        </h1>

        <p className="results-intro">
          Your trained-model heart-disease classification and health guidance.
        </p>

        <div className="results-heart-art" aria-hidden="true">
          <div className="results-heart-orbit" />
          <Heart size={190} strokeWidth={1.1} />
        </div>

        <section
          className={`risk-summary ${risk ? risk.color : "pending"}`}
          aria-live="polite"
        >
          <div className="risk-summary-top">
            {risk ? (
              <AlertTriangle size={23} />
            ) : (
              <Activity size={23} />
            )}

            <span>Your Risk Level</span>
          </div>

          <h2>{risk ? risk.label : "Awaiting prediction"}</h2>

          <p>
            {risk
              ? risk.description
              : "The results will appear here after the trained machine-learning model has processed your assessment."}
          </p>
        </section>

        <section className="meaning-section">
          <div className="meaning-heading">
            <span className="meaning-icon">
              <Info size={22} />
            </span>

            <h3>What does this mean?</h3>
          </div>

          <p>
            A model prediction is an estimate based on the patterns learned
            during training. It cannot establish whether you will have a
            heart attack or stroke. Your symptoms, medical history, and
            professional evaluation also matter.
          </p>
        </section>

        <div className="results-disclaimer">
          <ShieldCheck size={30} />

          <div>
            <strong>Medical disclaimer</strong>
            <p>
              This tool is for educational purposes and is not a medical
              diagnosis. Please consult a qualified healthcare professional
              for medical advice.
            </p>
          </div>
        </div>

        <button className="restart-button" onClick={onRestart}>
          <RotateCcw size={18} />
          Start a new assessment
        </button>
      </section>

      <section className="results-right">
        <article className="results-panel risk-overview">
          <h2>Risk Overview</h2>

          <div className="risk-overview-content">
            <div className={`risk-gauge ${risk ? risk.color : "pending"}`}>
              <div className="risk-gauge-inner">
                <span>{risk ? risk.label : "No result"}</span>
              </div>
            </div>

            <div className="risk-legend">
              <div className="risk-legend-item high">
                <span className="legend-dot" />

                <div>
                  <strong>High Risk</strong>
                  <p>Further medical assessment may be needed.</p>
                </div>
              </div>

              <div className="risk-legend-item moderate">
                <span className="legend-dot" />

                <div>
                  <strong>Moderate Risk</strong>
                  <p>Review potential risk factors with a clinician.</p>
                </div>
              </div>

              <div className="risk-legend-item low">
                <span className="legend-dot" />

                <div>
                  <strong>Low Risk</strong>
                  <p>Continue routine preventive healthcare.</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="results-panel">
          <h2>Key Insights</h2>

          <div className="insights-grid">
            <InsightCard
              icon={Heart}
              title="Heart Health"
              description="Understand cardiovascular health with appropriate clinical guidance."
              color="red"
            />

            <InsightCard
              icon={PersonStanding}
              title="Lifestyle Impact"
              description="Regular physical activity can support overall cardiovascular health."
              color="blue"
            />

            <InsightCard
              icon={Apple}
              title="Preventive Care"
              description="Balanced nutrition and routine checkups support long-term health."
              color="green"
            />

            <InsightCard
              icon={Moon}
              title="Overall Wellbeing"
              description="Adequate sleep and sustainable habits contribute to wellbeing."
              color="purple"
            />
          </div>
        </article>

        <article className="results-panel next-steps-panel">
          <h2>Recommended Next Steps</h2>

          <div className="recommendations-grid">
            <Recommendation
              icon={Stethoscope}
              title="Consult a Doctor"
              color="blue"
            />

            <Recommendation
              icon={PersonStanding}
              title="Regular Exercise"
              color="green"
            />

            <Recommendation
              icon={Apple}
              title="Balanced Diet"
              color="orange"
            />

            <Recommendation
              icon={Ban}
              title="Avoid Smoking"
              color="red"
            />
          </div>
        </article>
      </section>
    </main>
  );
}