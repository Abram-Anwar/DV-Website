import { FaChild } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";

import "./FormSection.css";

const ChildrenInfo = ({ data, setFormData }) => {
    
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
  };

  const removeChild = (index) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
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
  };

  return (
    <section className="personal-info">
      <div className="section-header">
        <div className="header-icon">
          <FaChild size={"30px"} />
          <h2>بيانات الأطفال</h2>
        </div>

        <p>يرجى إدخال بيانات الأطفال بدقة.</p>
      </div>

      {data.map((child, index) => (
        <div className="child-card" key={index}>
          <h3>الطفل {index + 1}</h3>

          <div className="form-grid">
            <div className="form-field">
              <label>اسم الطفل</label>

              <input
                type="text"
                name="fullName"
                value={child.fullName}
                onChange={(e) => handleChange(e, index)}
                placeholder="اسم الطفل"
              />
            </div>

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
            </div>

            <div className="form-field">
              <label>تاريخ الميلاد</label>

              <input
                type="date"
                name="dateOfBirth"
                value={child.dateOfBirth}
                onChange={(e) => handleChange(e, index)}
              />
            </div>

            <div className="form-field">
              <label>مدينة الميلاد</label>

              <input
                type="text"
                name="placeOfBirth"
                value={child.placeOfBirth}
                onChange={(e) => handleChange(e, index)}
                placeholder="مدينة الميلاد"
              />
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
      ))}

      <button type="button" onClick={addChild}>
        + إضافة طفل
      </button>
    </section>
  );
};

export default ChildrenInfo;
