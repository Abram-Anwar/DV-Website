//? Turns the form state into the shape the server expects.
//? formData: { applicant, spouse, children }
//? maritalStatus: "single" | "married" | "divorced" | "widowed"
//? hasChildren: "yes" | "no" | "" (this is how Status.jsx stores it)

export function buildPayload(formData, maritalStatus, hasChildren) {
  const { applicant, spouse, children } = formData;

  //? The form stores "yes" / "no" / "", the server expects true / false
  const hasKids = hasChildren === "yes";

  const payload = {
    maritalStatus,
    hasChildren: hasKids,

    //? Pick only the fields the server needs (no image, no applicationId)
    applicant: {
      fullName: applicant.fullName,
      email: applicant.email,
      phone: applicant.phone,
      dateOfBirth: applicant.dateOfBirth,
      placeOfBirth: applicant.placeOfBirth,
      qualification: applicant.qualification,
      address: applicant.address,
    },

    //? Send children only when the applicant said they have some
    children: hasKids
      ? children.map((c) => ({
          fullName: c.fullName,
          gender: c.gender,
          dateOfBirth: c.dateOfBirth,
          placeOfBirth: c.placeOfBirth,
        }))
      : [],
  };

  //? Spouse is sent only when married
  if (maritalStatus === "married") {
    payload.spouse = {
      fullName: spouse.fullName,
      dateOfBirth: spouse.dateOfBirth,
      placeOfBirth: spouse.placeOfBirth,
      qualification: spouse.qualification,
      phone: spouse.phone,
    };
  }

  return payload;
}

  //? Collects the image files, in the same order as the data sent to the server
  export function buildFiles(formData, maritalStatus, hasChildren) {
    const { applicant, spouse, children } = formData;

    return {
      applicantImage: applicant.image,
      spouseImage: maritalStatus === "married" ? spouse.image : null,
      childImages: hasChildren === "yes" ? children.map((c) => c.image) : [],
    };
  }