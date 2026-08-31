import PersonalInfo from "../components/Form/PersonalInfo";
import SpouseInfo from "../components/Form/SpouseInfo";
import ChildrenInfo from "../components/Form/ChildrenInfo";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Review from "../components/Review/Review";
import "./Form.css";

const Form = () => {
  const { state } = useLocation();
  const { status, hasChildren } = state;

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({
    applicant: {},
    spouse: {},
    children: {},
  });

  const [formData, setFormData] = useState({
    applicant: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      placeOfBirth: "",
      qualification: "",
      address: "",
      image: null,
    },

    spouse: {
      fullName: "",
      dateOfBirth: "",
      placeOfBirth: "",
      qualification: "",
      phone: "",
      image: null,
    },

    children: [
      {
        fullName: "",
        gender: "",
        dateOfBirth: "",
        placeOfBirth: "",
        image: null,
      },
    ],
  });

  const validate = (data, section) => {
    const newErrors = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = "الاسم مطلوب";
    } else if (data.fullName.trim().split(/\s+/).length < 4) {
      newErrors.fullName = "يرجى إدخال الاسم الرباعي";
    }

    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = "تاريخ الميلاد مطلوب";
    }

    if (!data.placeOfBirth.trim()) {
      newErrors.placeOfBirth = "مدينة / محافظة الميلاد مطلوبة";
    }

    if (!/^01\d{9}$/.test(data.phone)) {
      newErrors.phone = "يرجى إدخال رقم هاتف مصري صحيح";
    }

    if (section === "applicant") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
      }

      if (!data.address.trim()) {
        newErrors.address = "العنوان مطلوب";
      }
    }

    if (!data.image) {
      newErrors.image = "يرجى اختيار صورة";
    }

    if (!data.qualification) {
      newErrors.qualification = "يرجى اختيار المؤهل";
    }

    setErrors((prev) => ({
      ...prev,
      [section]: newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const steps = [
    {
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
            title: "بيانات الأطفال",
            component: (
              <ChildrenInfo
                data={formData.children}
                setFormData={setFormData}
              />
            ),
          },
        ]
      : []),

    {
      title: "المراجعة",
      component: <Review />,
    },
  ];

  const handleNext = () => {
    // if (currentStep === 0) {
    //   const isValid = validate(formData.applicant, "applicant");

    //   if (!isValid) return;
    // }

    // if (currentStep === 1 && status === "married") {
    //   const isValid = validate(formData.spouse, "spouse");

    //   if (!isValid) return;
    // }

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
