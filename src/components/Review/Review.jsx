import { FaUser, FaHeart, FaChild } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";

import "./Review.css";

const Review = ({ formData, status, hasChildren, setCurrentStep }) => {
  return (
    <section className="review">
      {/* Applicant */}
      <div className="review-card">
        <div className="review-card-header">
          <h2>
            <FaUser />
            بيانات المتقدم
          </h2>

          <button type="button" onClick={() => setCurrentStep(0)}>
            <FaPen />
            تعديل
          </button>
        </div>

        <div className="review-grid">
          <div className="review-field">
            <span>الاسم الكامل</span>
            <strong>{formData.applicant.fullName}</strong>
          </div>

          <div className="review-field">
            <span>تاريخ الميلاد</span>
            <strong>{formData.applicant.dateOfBirth}</strong>
          </div>

          <div className="review-field">
            <span>مدينة / محافظة الميلاد</span>
            <strong>{formData.applicant.placeOfBirth}</strong>
          </div>

          <div className="review-field">
            <span>رقم الهاتف</span>
            <strong>{formData.applicant.phone}</strong>
          </div>

          <div className="review-field">
            <span>البريد الإلكتروني</span>
            <strong>{formData.applicant.email}</strong>
          </div>

          <div className="review-field">
            <span>المؤهل</span>
            <strong>{formData.applicant.qualification}</strong>
          </div>

          <div className="review-field full-width">
            <span>العنوان</span>
            <strong>{formData.applicant.address}</strong>
          </div>
        </div>

        {formData.applicant.image && (
          <div className="review-image">
            <img
              src={URL.createObjectURL(formData.applicant.image)}
              alt="صورة المتقدم"
            />
          </div>
        )}
      </div>

      {/* Spouse */}
      {status === "married" && (
        <div className="review-card">
          <div className="review-card-header">
            <h2>
              <FaHeart />
              بيانات الزوج / الزوجة
            </h2>

            <button type="button" onClick={() => setCurrentStep(1)}>
              <FaPen />
              تعديل
            </button>
          </div>

          <div className="review-grid">
            <div className="review-field">
              <span>الاسم الكامل</span>
              <strong>{formData.spouse.fullName}</strong>
            </div>

            <div className="review-field">
              <span>تاريخ الميلاد</span>
              <strong>{formData.spouse.dateOfBirth}</strong>
            </div>

            <div className="review-field">
              <span>مدينة / محافظة الميلاد</span>
              <strong>{formData.spouse.placeOfBirth}</strong>
            </div>

            <div className="review-field">
              <span>رقم الهاتف</span>
              <strong>{formData.spouse.phone}</strong>
            </div>

            <div className="review-field">
              <span>المؤهل</span>
              <strong>{formData.spouse.qualification}</strong>
            </div>
          </div>

          {formData.spouse.image && (
            <div className="review-image">
              <img
                src={URL.createObjectURL(formData.spouse.image)}
                alt="صورة الزوج أو الزوجة"
              />
            </div>
          )}
        </div>
      )}

      {/* Children */}
      {status === "married" &&
        hasChildren === "yes" &&
        formData.children.length > 0 && (
          <div className="review-card">
            <div className="review-card-header">
              <h2>
                <FaChild />
                بيانات الأبناء
              </h2>

              <button type="button" onClick={() => setCurrentStep(2)}>
                <FaPen />
                تعديل
              </button>
            </div>

            <div className="children-review-list">
              {formData.children.map((child, index) => (
                <div className="child-review-card" key={index}>
                  <h3>الطفل {index + 1}</h3>

                  <div className="review-grid">
                    <div className="review-field">
                      <span>الاسم الكامل</span>
                      <strong>{child.fullName}</strong>
                    </div>

                    <div className="review-field">
                      <span>النوع</span>
                      <strong>{child.gender}</strong>
                    </div>

                    <div className="review-field">
                      <span>تاريخ الميلاد</span>
                      <strong>{child.dateOfBirth}</strong>
                    </div>

                    <div className="review-field">
                      <span>مدينة الميلاد</span>
                      <strong>{child.placeOfBirth}</strong>
                    </div>
                  </div>

                  {child.image && (
                    <div className="review-image">
                      <img
                        src={URL.createObjectURL(child.image)}
                        alt={`صورة الطفل ${index + 1}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
    </section>
  );
};

export default Review;
