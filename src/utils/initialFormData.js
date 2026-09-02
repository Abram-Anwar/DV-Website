import getNextApplicationId from "./applicationId";

const getInitialFormData = () => ({
  applicant: {
    applicationId: getNextApplicationId(),
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
      qualification: "",
      image: null,
    },
  ],
});

export default getInitialFormData;