import PersonalInfo from "../components/Form/PersonalInfo";
import SpouseInfo from "../components/Form/SpouseInfo";
import ChildrenInfo from "../components/Form/ChildrenInfo";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Form = () => {
  const { state } = useLocation();
  const { status, hasChildren } = state;
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "البيانات الشخصية",
      component: <PersonalInfo />,
    },

    ...(status === "married"
      ? [
          {
            title: "بيانات الزوج/الزوجة",
            component: <SpouseInfo />,
          },
        ]
      : []),

    ...(status === "married" && hasChildren === "yes"
      ? [
          {
            title: "بيانات الأطفال",
            component: <ChildrenInfo />,
          },
        ]
      : []),

    { title: "المراجعة", component: <div>Review</div> },
  ];

  return (
    <>
      {steps[currentStep].component}

      <div>
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
        >
          السابق
        </button>

        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={currentStep === steps.length - 1}
        >
          التالي
        </button>
      </div>
    </>
  );
};

export default Form;
