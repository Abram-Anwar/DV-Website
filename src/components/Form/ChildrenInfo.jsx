import { useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaChild } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import "./FormSection.css";

const ChildrenInfo = ({ data, setFormData, errors, setErrors }) => {
  const [imagePreviews, setImagePreviews] = useState({});
  const fileInputRefs = useRef({});

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index
          ? {
              ...child,
              [name]: value,
            }
          : child,
      ),
    }));

    setErrors((prev) => {
      const newChildrenErrors = [...(prev.children || [])];

      if (newChildrenErrors[index]) {
        newChildrenErrors[index] = {
          ...newChildrenErrors[index],
        };

        delete newChildrenErrors[index][name];
      }

      return {
        ...prev,
        children: newChildrenErrors,
      };
    });
  };

  const removeChild = (index) => {
    if (data.length === 1) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));

    setErrors((prev) => ({
      ...prev,
      children: (prev.children || []).filter((_, i) => i !== index),
    }));

    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];

      return newPreviews;
    });
  };

  const addChild = () => {
    setFormData((prev) => ({
      ...prev,
      children: [
        ...prev.children,
        {
          fullName: "",
          gender: "",
          dateOfBirth: "",
          placeOfBirth: "",
          image: null,
        },
      ],
    }));

    setErrors((prev) => ({
      ...prev,
      children: [...(prev.children || []), {}],
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index
          ? {
              ...child,
              image: file,
            }
          : child,
      ),
    }));

    // إزالة خطأ الصورة
    setErrors((prev) => {
      const newChildrenErrors = [...(prev.children || [])];

      newChildrenErrors[index] = {
        ...(newChildrenErrors[index] || {}),
      };

      delete newChildrenErrors[index].image;

      return {
        ...prev,
        children: newChildrenErrors,
      };
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index
          ? {
              ...child,
              image: null,
            }
          : child,
      ),
    }));

    setErrors((prev) => {
      const newChildrenErrors = [...(prev.children || [])];

      newChildrenErrors[index] = {
        ...(newChildrenErrors[index] || {}),
      };

      newChildrenErrors[index].image = "يرجى اختيار صورة الأبن";

      return {
        ...prev,
        children: newChildrenErrors,
      };
    });

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }
  };

  useEffect(() => {
    const previews = {};

    data.forEach((child, index) => {
      if (child.image) {
        previews[index] = URL.createObjectURL(child.image);
      }
    });

    setImagePreviews(previews);

    return () => {
      Object.values(previews).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [data]);

  return (
    <section className="personal-info">
      <div className="section-header">
        <div className="header-icon">
          <FaChild size="30px" />
          <h2>بيانات الأطفال</h2>
        </div>

        <p>يرجى إدخال بيانات الأطفال بدقة.</p>
      </div>

      {data.map((child, index) => {
        const childErrors = errors?.[index] || {};

        return (
          <div className="child-card" key={index}>
            <h3>الأبن {index + 1}</h3>

            <div className="form-grid">
              {/* الاسم */}
              <div className="form-field">
                <label>اسم الأبن</label>

                <input
                  type="text"
                  name="fullName"
                  value={child.fullName}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="الاسم الرباعي"
                />

                {childErrors.fullName && (
                  <span className="error-message">{childErrors.fullName}</span>
                )}
              </div>

              {/* النوع */}
              <div className="form-field">
                <label>النوع</label>

                <select
                  name="gender"
                  value={child.gender}
                  onChange={(e) => handleChange(e, index)}
                >
                  <option value="">اختر النوع</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>

                {childErrors.gender && (
                  <span className="error-message">{childErrors.gender}</span>
                )}
              </div>

              {/* تاريخ الميلاد */}
              <div className="form-field">
                <label>تاريخ الميلاد</label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={child.dateOfBirth}
                  onChange={(e) => handleChange(e, index)}
                />

                {childErrors.dateOfBirth && (
                  <span className="error-message">
                    {childErrors.dateOfBirth}
                  </span>
                )}
              </div>

              {/* مدينة الميلاد */}
              <div className="form-field">
                <label>مدينة الميلاد</label>

                <input
                  type="text"
                  name="placeOfBirth"
                  value={child.placeOfBirth}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="مدينة الميلاد"
                />

                {childErrors.placeOfBirth && (
                  <span className="error-message">
                    {childErrors.placeOfBirth}
                  </span>
                )}
              </div>

              {/* الصورة */}
              <div className="form-field full-width">
                <label htmlFor={`childImage-${index}`}>صورة الأبن</label>

                <input
                  ref={(element) => {
                    fileInputRefs.current[index] = element;
                  }}
                  type="file"
                  id={`childImage-${index}`}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                />

                {childErrors.image && (
                  <span className="error-message">{childErrors.image}</span>
                )}

                {imagePreviews[index] && (
                  <div className="image-preview">
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(index)}
                      aria-label="حذف الصورة"
                    >
                      <IoClose />
                    </button>

                    <img
                      src={imagePreviews[index]}
                      alt={`صورة الأبن ${index + 1}`}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="remove-child-btn"
              onClick={() => removeChild(index)}
            >
              <FaRegTrashAlt />
            </button>
          </div>
        );
      })}

      <button type="button" onClick={addChild}>
        + إضافة أبن
      </button>
    </section>
  );
};

export default ChildrenInfo;
