import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Status.css";

const Status = () => {
  const [status, setStatus] = useState("");
  const [hasChildren, setHasChildren] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (status === "") {
      setError("يرجى تحديد حالتك الاجتماعية.");
      return;
    }

    if (status === "married" && hasChildren === "") {
      setError("يرجى تحديد ما إذا كان لديك أبناء مؤهلون للإضافة.");
      return;
    }

    navigate("/form", {
      state: {
        status,
        hasChildren,
      },
    });
  };

  return (
    <div className="status">
      <div className="status-selection-container">
        <header className="step-header">
          <h1>الحالة الاجتماعية</h1>

          <p className="text-muted">
            يرجى تحديد حالتك الاجتماعية الحالية لمتابعة إجراءات الطلب.
          </p>
        </header>

        <div className="selection-grid">
          {/* Single */}
          <label
            htmlFor="status-single"
            className={`selection-card ${status === "single" ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="marital_status"
              id="status-single"
              value="single"
              onChange={() => {
                setStatus("single");
                setError("");
                setHasChildren("");
              }}
            />

            <div className="card-content">
              <div className="card-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div className="card-text">
                <span className="card-title">أعزب</span>
                <span className="card-desc">غير متزوج حالياً</span>
              </div>
            </div>

            <div className="radio-indicator"></div>
          </label>

          {/* Married */}
          <label
            htmlFor="status-married"
            className={`selection-card ${status === "married" ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="marital_status"
              id="status-married"
              value="married"
              onChange={() => {
                setStatus("married");
                setError("");
              }}
            />

            <div className="card-content">
              <div className="card-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>

              <div className="card-text">
                <span className="card-title">متزوج</span>

                <span className="card-desc">
                  متزوج قانونياً وسيتم تضمين بيانات الزوج/الزوجة.
                </span>
              </div>
            </div>

            <div className="radio-indicator"></div>
          </label>
        </div>

        {/* Children Question */}
        {status === "married" && (
          <div className="children-question">
            <div className="question-box">
              <h3>هل لديك أبناء مؤهلون للإضافة إلى الطلب؟</h3>

              <p className="text-muted">
                الأبناء غير المتزوجين الذين تقل أعمارهم عن 21 عامًا.
              </p>

              <div className="inline-options">
                <label className="chip-option">
                  <input
                    type="radio"
                    name="has_children"
                    value="yes"
                    onChange={() => {
                      setHasChildren("yes");
                      setError("");
                    }}
                  />
                  <span>نعم</span>
                </label>

                <label className="chip-option">
                  <input
                    type="radio"
                    name="has_children"
                    value="no"
                    onChange={() => {
                      setHasChildren("no");
                      setError("");
                    }}
                  />
                  <span>لا</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {error && <p className="status-error">{error}</p>}

        {/* Disclaimer */}
        <div className="disclaimer-card">
          <strong>تنبيه هام:</strong> بصفتنا مكتب استشارات خاص، نلتزم بالدقة
          والسرية. يرجى التأكد من إدخال البيانات المطابقة للوثائق الرسمية لتجنب
          أي تأخير في معالجة طلبك.
        </div>

        <div className="status-actions">
          <Link to="/" className="back-btn">
            رجوع
          </Link>

          <button
            type="button"
            className="continue-btn"
            onClick={handleContinue}
          >
            متابعة
          </button>
        </div>
      </div>
    </div>
  );
};

export default Status;
