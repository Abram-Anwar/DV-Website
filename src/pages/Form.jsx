import ProgressBar from "../components/ProgressBar/ProgressBar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useFormValidation from "../Hooks/useFormValidation";
import getInitialFormData from "../utils/initialFormData";
import getFormSteps from "../utils/formSteps";
import { Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Form.css";

const Form = () => {
  const { state } = useLocation();

  const [currentStep, setCurrentStep] = useState(0);

  const [errors, setErrors] = useState({
    applicant: {},
    spouse: {},
    children: [],
  });

  const [formData, setFormData] = useState(() => getInitialFormData());

  const { validateStep } = useFormValidation(formData, setErrors);

  if (!state) {
    return <Navigate to={"/apply"} replace />;
  }

  const { status, hasChildren } = state;

  const steps = getFormSteps({
    status,
    hasChildren,
    formData,
    errors,
    setFormData,
    setErrors,
    setCurrentStep,
  });

  const handleNext = () => {
    const currentStepId = steps[currentStep].id;

    if (!validateStep(currentStepId)) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <>
      <Navbar />

      <main className="form-page">
        <div className="form-header">
          <h1>نموذج التقديم</h1>
          <p>يرجى تعبئة البيانات بدقة لضمان معالجة طلبك بأسرع وقت ممكن.</p>
        </div>

        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="form-content">{steps[currentStep].component}</div>

        <div className="form-actions">
          <button
            type="button"
            className="form-btn previous-btn"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            السابق
          </button>

          <button
            type="button"
            className="form-btn next-btn"
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            متابعة
            <span>←</span>
          </button>
        </div>

        <div className="form-disclaimer">
          <p>
            <span>ⓘ</span>
            جميع البيانات المدخلة تعامل بسرية تامة وتستخدم فقط لأغراض التقديم
            والاستشارة القانونية.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Form;
