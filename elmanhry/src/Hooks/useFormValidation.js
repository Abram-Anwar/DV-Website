import {
  validateApplicant,
  validateSpouse,
  validateChildren,
} from "../utils/formValidation";

//? Create a custom hook to validate form steps and update their errors.
const useFormValidation = (formData, setErrors) => {
  //? Validate the requested step and update its errors.
  const validateStep = (stepId) => {
    switch (stepId) {
      case "applicant": {
        const newErrors = validateApplicant(formData.applicant);

        setErrors((prev) => ({
          ...prev,
          applicant: newErrors,
        }));

        return Object.keys(newErrors).length === 0;
      }

      case "spouse": {
        const newErrors = validateSpouse(formData.spouse);

        setErrors((prev) => ({
          ...prev,
          spouse: newErrors,
        }));

        return Object.keys(newErrors).length === 0;
      }

      case "children": {
        //? At least one child is required on this step
        if (formData.children.length === 0) {
          setErrors((prev) => ({
            ...prev,
            childrenCount: "يرجى إدخال عدد الأبناء",
          }));
          return false;
        }

        const newErrors = validateChildren(formData.children);

        setErrors((prev) => ({
          ...prev,
          children: newErrors,
          childrenCount: "",
        }));

        return newErrors.every(
          (childErrors) => Object.keys(childErrors).length === 0,
        );
      }

      default:
        return true;
    }
  };

  return { validateStep };
};

export default useFormValidation;
