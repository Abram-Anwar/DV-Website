import { useEffect, useState, useRef } from "react";
import { IoPerson, IoClose } from "react-icons/io5";

import "./FormSection.css";

const ApplicantInfo = ({ data, setFormData, errors, setErrors }) => {
  //? Manage the applicant's image preview and file input reference.
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  //? Update the applicant's data.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        [name]: value,
      },
    }));

    //? Clear the error for the field being edited
    setErrors((prev) => {
      const newApplicantErrors = { ...prev.applicant };
      delete newApplicantErrors[name];

      return {
        ...prev,
        applicant: newApplicantErrors,
      };
    });
  };

  //? Update the applicant's image.
  const handleImageChange = (e) => {
    //? Get the selected image file.
    const file = e.target.files?.[0];

    //? Stop if no file selected
    if (!file) return;

    //? Store the image file in applicant's data.
    setFormData((prev) => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        image: file,
      },
    }));

    //? Clear the image validation error.
    setErrors((prev) => {
      const newApplicantErrors = { ...prev.applicant };
      delete newApplicantErrors.image;

      return {
        ...prev,
        applicant: newApplicantErrors,
      };
    });
  };

  //? Remove the applicant's image from the form data.
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        image: null,
      },
    }));

    //? Clear the image validation error.
    setErrors((prev) => {
      const newApplicantErrors = { ...prev.applicant };
      delete newApplicantErrors.image;

      return {
        ...prev,
        applicant: newApplicantErrors,
      };
    });

    //? Clear the file input so the user can select the same image again.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  //? Create an image preview URL and clean it up when the image changes.
  useEffect(() => {
    if (!data.image) {
      setImagePreview(null);
      return;
    }

    const imageUrl = URL.createObjectURL(data.image);

    setImagePreview(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [data.image]);

  return (
    <section className="personal-info">
      <div className="section-header">
        <div className="header-icon">
          <IoPerson />
          <h2>بيانات المتقدم</h2>
        </div>

        <p>يرجى إدخال بيانات المتقدم بدقة.</p>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="fullName">الاسم الرباعي</label>

          <input
            type="text"
            id="fullName"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            placeholder="الاسم الكامل"
          />

          {errors.fullName && (
            <span className="error-message">{errors.fullName}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="dateOfBirth">تاريخ الميلاد</label>

          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={data.dateOfBirth}
            onChange={handleChange}
          />

          {errors.dateOfBirth && (
            <span className="error-message">{errors.dateOfBirth}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="placeOfBirth">مدينة / محافظة الميلاد</label>

          <input
            type="text"
            id="placeOfBirth"
            name="placeOfBirth"
            value={data.placeOfBirth}
            onChange={handleChange}
            placeholder="المدينة"
          />

          {errors.placeOfBirth && (
            <span className="error-message">{errors.placeOfBirth}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="phone">رقم الهاتف</label>

          <input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="رقم التليفون"
          />

          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">البريد الإلكتروني</label>

          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="example@email.com"
            dir="ltr"
          />

          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="qualification">المؤهل</label>

          <select
            name="qualification"
            id="qualification"
            value={data.qualification}
            onChange={handleChange}
          >
            <option value="">اختر المؤهل</option>
            <option value="دبلوم">دبلوم</option>
            <option value="ثانوية عامة">ثانوية عامة</option>
            <option value="بكالوريوس">بكالوريوس</option>
            <option value="ماجستير">ماجستير</option>
            <option value="دكتوراه">دكتوراه</option>
          </select>

          {errors.qualification && (
            <span className="error-message">{errors.qualification}</span>
          )}
        </div>

        <div className="form-field full-width">
          <label htmlFor="address">العنوان</label>

          <input
            type="text"
            id="address"
            name="address"
            value={data.address}
            onChange={handleChange}
            placeholder="المدينة، الحي، الشارع"
          />

          {errors.address && (
            <span className="error-message">{errors.address}</span>
          )}
        </div>

        <div className="form-field full-width">
          <label htmlFor="image">صورة المتقدم</label>

          <div className="image-upload">
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload-input"
            />

            <label htmlFor="image" className="image-upload-label">
              <span className="image-upload-title">
                {data.image ? "تغيير الصورة" : "اختر صورة"}
              </span>

              <span className="image-upload-description">
                PNG أو JPG أو JPEG
              </span>
            </label>
          </div>

          {errors.image && (
            <span className="error-message">{errors.image}</span>
          )}

          {imagePreview && (
            <div className="image-preview">
              <button
                type="button"
                className="remove-image"
                onClick={handleRemoveImage}
                aria-label="حذف الصورة"
              >
                <IoClose />
              </button>

              <img src={imagePreview} alt="صورة المتقدم" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApplicantInfo;
