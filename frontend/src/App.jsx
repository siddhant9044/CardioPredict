import React, { useState } from "react";
import AssessmentPage from "./pages/AssessmentPage";
import AdditionalDetailsPage from "./pages/AdditionalDetailsPage";
import ResultsPage from "./pages/ResultsPage";
import { predictHeartDisease } from "./services/predictionService";

export default function App() {
  const [step, setStep] = useState(1);
  const [healthDetails, setHealthDetails] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  function handleFirstStep(values) {
    setHealthDetails((previous) => ({ ...previous, ...values }));
    setPredictionError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    if (isPredicting) return;
    setPredictionError("");
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePredict(values) {
    const completeDetails = { ...healthDetails, ...values };
    setHealthDetails(completeDetails);
    setPrediction(null);
    setPredictionError("");
    setIsPredicting(true);
    try {
      const result = await predictHeartDisease(completeDetails);
      setPrediction(result);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setPredictionError(error instanceof Error ? error.message : "Prediction failed. Please try again.");
    } finally {
      setIsPredicting(false);
    }
  }

  function handleRestart() {
    setHealthDetails({});
    setPrediction(null);
    setPredictionError("");
    setIsPredicting(false);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (step === 1) return <AssessmentPage initialValues={healthDetails} onNext={handleFirstStep} />;
  if (step === 2) {
    return <AdditionalDetailsPage initialValues={healthDetails} onBack={handleBack} onPredict={handlePredict} isPredicting={isPredicting} predictionError={predictionError} />;
  }
  return <ResultsPage prediction={prediction} onRestart={handleRestart} />;
}
