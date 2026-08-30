import { useEffect, useState, useRef } from "react";
import { IoPerson, IoClose } from "react-icons/io5";

import "./PersonalInfo.css";

const PersonalInfo = ({ data, setFormData, errors, setErrors }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        [name]: value,
      },
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        image: file,
      },
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      applicant: {
        ...prev.applicant,
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
            <option value="diploma">دبلوم</option>
            <option value="highschool">ثانوية عامة</option>
            <option value="bachelor">بكالوريوس</option>
            <option value="master">ماجستير</option>
            <option value="phd">دكتوراه</option>
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

          <input
            ref={fileInputRef}
            type="file"
            id="image"
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

              <img src={imagePreview} alt="صورة المتقدم" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PersonalInfo;
