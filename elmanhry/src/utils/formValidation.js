//? True if the date is after today
const isFutureDate = (value) => new Date(value) > new Date();

export const validateApplicant = (data) => {
  const errors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "الاسم مطلوب";
  } else if (data.fullName.trim().split(/\s+/).length < 4) {
    errors.fullName = "يرجى إدخال الاسم الرباعي";
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = "تاريخ الميلاد مطلوب";
  } else if (isFutureDate(data.dateOfBirth)) {
    errors.dateOfBirth = "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
  }

  if (!data.placeOfBirth.trim()) {
    errors.placeOfBirth = "مدينة / محافظة الميلاد مطلوبة";
  }

  if (!/^01[0125]\d{8}$/.test(data.phone)) {
    errors.phone = "يرجى إدخال رقم هاتف مصري صحيح";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح";
  }

  if (!data.address.trim()) {
    errors.address = "العنوان مطلوب";
  }

  if (!data.image) {
    errors.image = "يرجى اختيار صورة";
  }

  if (!data.qualification) {
    errors.qualification = "يرجى اختيار المؤهل";
  }

  return errors;
};

export const validateSpouse = (data) => {
  const errors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "الاسم مطلوب";
  } else if (data.fullName.trim().split(/\s+/).length < 4) {
    errors.fullName = "يرجى إدخال الاسم الرباعي";
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = "تاريخ الميلاد مطلوب";
  } else if (isFutureDate(data.dateOfBirth)) {
    errors.dateOfBirth = "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
  }

  if (!data.placeOfBirth.trim()) {
    errors.placeOfBirth = "مدينة / محافظة الميلاد مطلوبة";
  }

  if (!/^01[0125]\d{8}$/.test(data.phone)) {
    errors.phone = "يرجى إدخال رقم هاتف مصري صحيح";
  }

  if (!data.image) {
    errors.image = "يرجى اختيار صورة";
  }

  if (!data.qualification) {
    errors.qualification = "يرجى اختيار المؤهل";
  }

  return errors;
};

export const validateChildren = (children) => {
  return children.map((child) => {
    const errors = {};

    if (!child.fullName.trim()) {
      errors.fullName = "اسم الابن مطلوب";
    } else if (child.fullName.trim().split(/\s+/).length < 4) {
      errors.fullName = "يرجى إدخال الاسم الرباعي";
    }

    if (!child.gender) {
      errors.gender = "يرجى اختيار النوع";
    }

    if (!child.dateOfBirth) {
      errors.dateOfBirth = "تاريخ الميلاد مطلوب";
    } else if (isFutureDate(child.dateOfBirth)) {
      errors.dateOfBirth = "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
    } else {
      const birthDate = new Date(child.dateOfBirth);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();

      const birthdayThisYear = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate(),
      );

      if (today < birthdayThisYear) {
        age--;
      }

      if (age >= 21) {
        errors.dateOfBirth = "لا يمكن إضافة ابن عمره 21 عامًا أو أكثر";
      }
    }

    if (!child.placeOfBirth.trim()) {
      errors.placeOfBirth = "مدينة الميلاد مطلوبة";
    }

    if (!child.image) {
      errors.image = "يرجى اختيار صورة الابن";
    }

    return errors;
  });
};
