import PersonalInfo from "../components/Form/PersonalInfo";
import SpouseInfo from "../components/Form/SpouseInfo";
import ChildrenInfo from "../components/Form/ChildrenInfo";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Review from "../components/Review/Review";
import {
  validateApplicant,
  validateSpouse,
  validateChildren,
} from "../Hooks/useFormValidation";
import "./Form.css";

const Form = () => {
  const { state } = useLocation();

  if (!state) {
    return <Navigate to={"/apply"} replace />;
  }

  const { status, hasChildren } = state;

  const [currentStep, setCurrentStep] = useState(0);

  const [errors, setErrors] = useState({
    applicant: {},
    spouse: {},
    children: [],
  });

  // const [formData, setFormData] = useState({
  //   applicant: {
  //     fullName: "",
  //     email: "",
  //     phone: "",
  //     dateOfBirth: "",
  //     placeOfBirth: "",
  //     qualification: "",
  //     address: "",
  //     image: null,
  //   },

  //   spouse: {
  //     fullName: "",
  //     dateOfBirth: "",
  //     placeOfBirth: "",
  //     qualification: "",
  //     phone: "",
  //     image: null,
  //   },

  //   children: [
  //     {
  //       fullName: "",
  //       gender: "",
  //       dateOfBirth: "",
  //       placeOfBirth: "",
  //       image: null,
  //     },
  //   ],
  // });

  const [formData, setFormData] = useState({
  applicant: {
    fullName: "أبرام أنور حسن إبراهيم",
    email: "abram@example.com",
    phone: "01012345678",
    dateOfBirth: "2004-05-15",
    placeOfBirth: "بني سويف",
    qualification: "بكالوريوس",
    address: "بني سويف، مصر",
    image: "",
  },

  spouse: {
    fullName: "سارة محمد علي محمود",
    dateOfBirth: "2005-08-20",
    placeOfBirth: "القاهرة",
    qualification: "بكالوريوس",
    phone: "01198765432",
    image: "",
  },

  children: [
    {
      fullName: "عمر أبرام أنور حسن",
      gender: "ذكر",
      dateOfBirth: "2010-03-12",
      placeOfBirth: "بني سويف",
      image: "",
    },
    {
      fullName: "مريم أبرام أنور حسن",
      gender: "أنثى",
      dateOfBirth: "2014-11-25",
      placeOfBirth: "بني سويف",
      image: "",
    },
  ],
});
  
  const steps = [
    {
      id: "applicant",
      title: "البيانات الشخصية",
      component: (
        <PersonalInfo
          data={formData.applicant}
          setFormData={setFormData}
          errors={errors.applicant}
          setErrors={setErrors}
        />
      ),
    },

    ...(status === "married"
      ? [
          {
            id: "spouse",
            title: "بيانات الزوج/الزوجة",
            component: (
              <SpouseInfo
                data={formData.spouse}
                setFormData={setFormData}
                errors={errors.spouse}
                setErrors={setErrors}
              />
            ),
          },
        ]
      : []),

    ...(status === "married" && hasChildren === "yes"
      ? [
          {
            id: "children",
            title: "بيانات الأبناء",
            component: (
              <ChildrenInfo
                data={formData.children}
                setFormData={setFormData}
                errors={errors.children}
                setErrors={setErrors}
              />
            ),
          },
        ]
      : []),

    {
      id: "review",
      title: "المراجعة",
      component: (
        <Review
          formData={formData}
          status={status}
          hasChildren={hasChildren}
          setCurrentStep={setCurrentStep}
        />
      ),
    },
  ];

  const stepValidators = {
    applicant: () => {
      const newErrors = validateApplicant(formData.applicant);

      setErrors((prev) => ({
        ...prev,
        applicant: newErrors,
      }));

      return Object.keys(newErrors).length === 0;
    },

    spouse: () => {
      const newErrors = validateSpouse(formData.spouse);

      setErrors((prev) => ({
        ...prev,
        spouse: newErrors,
      }));

      return Object.keys(newErrors).length === 0;
    },

    children: () => {
      const newErrors = validateChildren(formData.children);

      setErrors((prev) => ({
        ...prev,
        children: newErrors,
      }));

      return newErrors.every(
        (childErrors) => Object.keys(childErrors).length === 0,
      );
    },
  };

  const handleNext = () => {
    const currentStepId = steps[currentStep].id;

    const validator = stepValidators[currentStepId];

    if (validator && !validator()) {
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

  // console.log("FORM DATA:", formData);

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
