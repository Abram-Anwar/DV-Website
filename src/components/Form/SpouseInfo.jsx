import { useEffect, useRef, useState } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

import "./FormSection.css";

const SpouseInfo = ({ data, setFormData, errors, setErrors }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      spouse: {
        ...prev.spouse,
        [name]: value,
      },
    }));

    setErrors((prev) => {
      const newSpouseErrors = { ...prev.spouse };
      delete newSpouseErrors[name];

      return {
        ...prev,
        spouse: newSpouseErrors,
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      spouse: {
        ...prev.spouse,
        image: file,
      },
    }));

    setErrors((prev) => {
      const newApplicantErrors = { ...prev.spouse };
      delete newApplicantErrors.image;

      return {
        ...prev,
        spouse: newApplicantErrors,
      };
    });
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      spouse: {
        ...prev.spouse,
        image: null,
      },
    }));

    fileInputRef.current.value = "";
  };

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
          <IoPeopleSharp />
          <h2>بيانات الزوج / الزوجة</h2>
        </div>

        <p>يرجى إدخال بيانات الزوج / الزوجة بدقة.</p>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="spouseFullName">الاسم الرباعي</label>

          <input
            type="text"
            id="spouseFullName"
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
          <label htmlFor="spouseDateOfBirth">تاريخ الميلاد</label>

          <input
            type="date"
            id="spouseDateOfBirth"
            name="dateOfBirth"
            value={data.dateOfBirth}
            onChange={handleChange}
          />

          {errors.dateOfBirth && (
            <span className="error-message">{errors.dateOfBirth}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="spousePlaceOfBirth">مدينة / محافظة الميلاد</label>

          <input
            type="text"
            id="spousePlaceOfBirth"
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
          <label htmlFor="spousePhone">رقم الهاتف</label>

          <input
            type="tel"
            id="spousePhone"
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
          <label htmlFor="spouseQualification">المؤهل</label>

          <select
            id="spouseQualification"
            name="qualification"
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
          <label htmlFor="spouseImage">صورة الزوج / الزوجة</label>

          <input
            ref={fileInputRef}
            type="file"
            id="spouseImage"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />

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

              <img src={imagePreview} alt="صورة الزوج / الزوجة" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SpouseInfo;
