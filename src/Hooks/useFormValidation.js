import {
  validateApplicant,
  validateSpouse,
  validateChildren,
} from "../utils/formValidation";

const useFormValidation = (formData, setErrors) => {
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
        const newErrors = validateChildren(formData.children);

        setErrors((prev) => ({
          ...prev,
          children: newErrors,
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
