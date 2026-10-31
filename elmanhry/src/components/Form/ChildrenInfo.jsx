import { useEffect, useRef, useState } from "react";
import { FaChild } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import "./FormSection.css";

//? Same limit as the server (max 10 children)
const MAX_CHILDREN = 10;

const ChildrenInfo = ({ data, setFormData, errors, setErrors, countError }) => {
  //? Store image preview URLs for each child.
  const [imagePreviews, setImagePreviews] = useState({});

  //? Track the number of children displayed in the form.
  const [childrenCount, setChildrenCount] = useState(data.length);

  //? Keep a reference to each child's file input.
  const fileInputRefs = useRef({});

  //? Update the selected child's data and clear the edited field's error.
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

      //? Validate the child's age when the birth date changes.
      if (name === "dateOfBirth") {
        const birthDate = new Date(value);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const birthdayThisYear = new Date(
          today.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate(),
        );

        //? Subtract one year from the age if the child's birthday hasn't arrived yet this year.
        if (today < birthdayThisYear) {
          age--;
        }

        if (age >= 21) {
          newChildrenErrors[index] = {
            ...(newChildrenErrors[index] || {}),
            dateOfBirth: "يجب أن يكون عمر الابن أقل من 21 عامًا",
          };
        }
      }

      return {
        ...prev,
        children: newChildrenErrors,
      };
    });
  };

  //? Runs when the user changes the "number of children" input.
  //? It adds or removes child objects so the array length matches the number.
  const handleChildrenCountChange = (e) => {
    //? Input values are always strings, so convert to a number
    const raw = e.target.value;

    //? Empty box: only clear the box, keep the children already typed
    if (raw === "") {
      setChildrenCount("");
      return;
    }

    //? Whole number between 1 and MAX_CHILDREN (no negatives or decimals)
    const count = Math.min(Math.max(Math.trunc(Number(raw)), 1), MAX_CHILDREN);

    setChildrenCount(count);

    setFormData((prev) => {
      const currentChildren = prev.children;

      //? Case 1: more children are needed, so append new empty children.
      if (count > currentChildren.length) {
        const newChildren = Array.from(
          { length: count - currentChildren.length },
          () => ({
            fullName: "",
            gender: "",
            dateOfBirth: "",
            placeOfBirth: "",
            qualification: "",
            image: null,
          }),
        );

        //? Existing children keep their data; new ones are added at the end.
        return {
          ...prev,
          children: [...currentChildren, ...newChildren],
        };
      }

      //? Case 2: fewer children are needed, so keep only the first "count" children.
      return {
        ...prev,
        children: currentChildren.slice(0, count),
      };
    });

    //? Keep the errors array the same length as the children array.
    setErrors((prev) => ({
      ...prev,
      childrenCount: "",
      children: Array.from({ length: count }, (_, index) => {
        return prev.children?.[index] || {};
      }),
    }));
  };

  //? Runs when the user selects an image for a child.
  const handleImageChange = (e, index) => {
    //? Get the selected file (optional chaninig in case no file exits).
    const file = e.target.files?.[0];

    //? Do nothing if the user cancelled the file dialog.
    if (!file) return;

    //? Store the file object inside this child's data.
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

    //? Remove the image error because the user selected an image.
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

  //? Runs when the user clicks the X button on an image preview.
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

    //? Show the "image required" error again right away.
    setErrors((prev) => {
      const newChildrenErrors = [...(prev.children || [])];

      newChildrenErrors[index] = {
        ...(newChildrenErrors[index] || {}),
        image: "يرجى اختيار صورة الابن",
      };

      return {
        ...prev,
        children: newChildrenErrors,
      };
    });

    //? Reset the file input itself, so choosing the same file again still triggers onChange.
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }
  };

  //? Build preview URLs whenever the children data changes.
  useEffect(() => {
    const previews = {};

    data.forEach((child, index) => {
      if (child.image) {
        //? Create a temporary browser URL that points to the selected file.
        previews[index] = URL.createObjectURL(child.image);
      }
    });

    setImagePreviews(previews);

    //? Cleanup: release the old URLs from memory before the next run or on unmount.
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

      <div className="form-field">
        <label htmlFor="childrenCount">عدد الأبناء</label>

        <input
          type="number"
          id="childrenCount"
          min="1"
          max={MAX_CHILDREN}
          value={childrenCount || ""}
          onChange={handleChildrenCountChange}
          onBlur={() => setChildrenCount(data.length)}
          placeholder="أدخل عدد الأبناء"
        />
      </div>

      {countError && <span className="error-message">{countError}</span>}

      {data.map((child, index) => {
        const childErrors = errors?.[index] || {};

        return (
          <div className="child-card" key={index}>
            <h3>الابن {index + 1}</h3>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor={`childFullName-${index}`}>اسم الابن</label>

                <input
                  type="text"
                  id={`childFullName-${index}`}
                  name="fullName"
                  value={child.fullName}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="الاسم الرباعي"
                />

                {childErrors.fullName && (
                  <span className="error-message">{childErrors.fullName}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor={`childGender-${index}`}>النوع</label>

                <select
                  id={`childGender-${index}`}
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

              <div className="form-field">
                <label htmlFor={`childDateOfBirth-${index}`}>
                  تاريخ الميلاد
                </label>

                <input
                  type="date"
                  id={`childDateOfBirth-${index}`}
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

              <div className="form-field">
                <label htmlFor={`childPlaceOfBirth-${index}`}>
                  مدينة الميلاد
                </label>

                <input
                  type="text"
                  id={`childPlaceOfBirth-${index}`}
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

              <div className="form-field full-width">
                <label htmlFor={`childImage-${index}`}>صورة الابن</label>

                <div className="image-upload">
                  <input
                    ref={(element) => {
                      fileInputRefs.current[index] = element;
                    }}
                    type="file"
                    id={`childImage-${index}`}
                    name="image"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="image-upload-input"
                  />

                  <label
                    htmlFor={`childImage-${index}`}
                    className="image-upload-label"
                  >
                    <span className="image-upload-title">
                      {child.image ? "تغيير الصورة" : "اختر صورة"}
                    </span>

                    <span className="image-upload-description">
                      PNG أو JPG أو JPEG
                    </span>
                  </label>
                </div>

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
                      alt={`صورة الابن ${index + 1}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ChildrenInfo;
