import ApplicantInfo from "../components/Form/ApplicantInfo";
import SpouseInfo from "../components/Form/SpouseInfo";
import ChildrenInfo from "../components/Form/ChildrenInfo";
import Review from "../components/Review/Review";

//? Build the form steps dynamically based on the applicant's status and children information.
const getFormSteps = ({
  status,
  hasChildren,
  formData,
  errors,
  setFormData,
  setErrors,
  setCurrentStep,
}) => {
  return [
    {
      id: "applicant",
      title: "البيانات الشخصية",
      component: (
        <ApplicantInfo
          data={formData.applicant}
          setFormData={setFormData}
          errors={errors.applicant}
          setErrors={setErrors}
        />
      ),
    },

    ...(status === "married" //? (...) => Spread conditional arrays into the main steps array.
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

    ...(["married", "divorced", "widowed"].includes(status) &&
    hasChildren === "yes"
      ? [
          {
            id: "children",
            title: "بيانات الأبناء",
            component: (
              <ChildrenInfo
                data={formData.children}
                setFormData={setFormData}
                errors={errors.children}
                countError={errors.childrenCount}
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
};

export default getFormSteps;
