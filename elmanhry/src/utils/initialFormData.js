const getInitialFormData = () => ({
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

  children: [],
});

export default getInitialFormData;
