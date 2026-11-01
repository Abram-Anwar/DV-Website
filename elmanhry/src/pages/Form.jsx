import ProgressBar from "../components/ProgressBar/ProgressBar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useFormValidation from "../Hooks/useFormValidation";
import getInitialFormData from "../utils/initialFormData";
import getFormSteps from "../config/formSteps";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { submitApplication } from "../utils/api";
import { buildPayload, buildFiles } from "../utils/buildPayload";
import "./Form.css";

const Form = () => {
  //? Get the data passed from the previousn page.
  const { state } = useLocation();
  const navigate = useNavigate();

  //? Track the current form step.
  const [currentStep, setCurrentStep] = useState(0);

  //? Store validation errors for the applicant, spouse, and children.
  const [errors, setErrors] = useState({
    applicant: {},
    spouse: {},
    children: [],
  });

  //? Initialize the form data with default values.
  const [formData, setFormData] = useState(() => getInitialFormData());

  //? Track the save request to the server.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { validateStep } = useFormValidation(formData, setErrors);

  //? Scroll to the top whenever the user moves to another step.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  //? Redirect to the application page if navigation state is moissing.
  if (!state) {
    return <Navigate to={"/apply"} replace />;
  }

  //? Get marital status and having children or not frrom state.
  const { status, hasChildren } = state;

  //? Build the form steps based on the applicant's status and form data.
  const steps = getFormSteps({
    status,
    hasChildren,
    formData,
    errors,
    setFormData,
    setErrors,
    setCurrentStep,
  });

  //? Validate the current step and move forward or navigate to payment.
  const handleNext = async () => {
    //? Ignore extra clicks while the request is running.
    if (isSubmitting) return;

    const currentStepId = steps[currentStep].id;

    //? Stop if the current step contains validation errors.
    if (!validateStep(currentStepId)) {
      return;
    }

    //? Move to the next step if the current step is not the last one.
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    //? Last step: save the application on the server, then go to payment.
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = buildPayload(formData, status, hasChildren);
      const files = buildFiles(formData, status, hasChildren);
      const { applicationId, applicationNumber } = await submitApplication(
        payload,
        files,
      );

      navigate("/payment", {
        state: {
          formData,
          status,
          hasChildren,
          applicationId,
          applicationNumber,
        },
      });
    } catch (error) {
      //? error.issues holds the server validation details (for debugging)
      console.error(error, error.issues);
      setSubmitError("تعذر حفظ الطلب. راجع البيانات وحاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //? Move back one step without going before the first step.
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

        {/* Display progress through the form steps */}
        <ProgressBar steps={steps} currentStep={currentStep} />

        {/* Render the component for the current step */}
        <div className="form-content">{steps[currentStep].component}</div>

        {/* Provide navigation controls for the form */}
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
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "جاري الحفظ..."
              : currentStep === steps.length - 1
                ? "متابعة للدفع"
                : "متابعة"}
          </button>
        </div>

        {submitError && <p className="form-error">{submitError}</p>}

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
