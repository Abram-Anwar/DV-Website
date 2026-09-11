import { Navigate, useLocation } from "react-router-dom";
import {
  MdOutlineCreditCard,
  MdAccountBalance,
  MdInfoOutline,
} from "react-icons/md";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useState } from "react";
import "./Payment.css";

const Payment = () => {
  const { state } = useLocation();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state) {
    return <Navigate to="/apply" replace />;
  }

  const { formData } = state;

  const serviceFee = 150;

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formattedValue);

    if (errors.cardNumber) {
      setErrors((prev) => ({
        ...prev,
        cardNumber: "",
      }));
    }
  };

  const handleExpiryMonthChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);

    setExpiryMonth(value);

    if (errors.expiry) {
      setErrors((prev) => ({
        ...prev,
        expiry: "",
      }));
    }
  };

  const handleExpiryYearChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);

    setExpiryYear(value);

    if (errors.expiry) {
      setErrors((prev) => ({
        ...prev,
        expiry: "",
      }));
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);

    setCvv(value);

    if (errors.cvv) {
      setErrors((prev) => ({
        ...prev,
        cvv: "",
      }));
    }
  };

  const handleCardNameChange = (e) => {
    setCardName(e.target.value);

    if (errors.cardName) {
      setErrors((prev) => ({
        ...prev,
        cardName: "",
      }));
    }
  };

  const validatePayment = () => {
    const newErrors = {};
    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    if (!cardName.trim()) {
      newErrors.cardName = "يرجى إدخال الاسم على البطاقة.";
    }

    if (cleanCardNumber.length !== 16) {
      newErrors.cardNumber = "يرجى إدخال رقم بطاقة صحيح.";
    }

    const month = Number(expiryMonth);
    const year = Number(expiryYear);

    if (
      expiryMonth.length !== 2 ||
      expiryYear.length !== 2 ||
      month < 1 ||
      month > 12
    ) {
      newErrors.expiry = "يرجى إدخال تاريخ انتهاء صحيح.";
    } else {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiry = "البطاقة منتهية الصلاحية.";
      }
    }

    if (cvv.length !== 3) {
      newErrors.cvv = "يرجى إدخال رمز أمان صحيح.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (isProcessing) return;

    const isValid = validatePayment();

    if (!isValid) return;

    setIsProcessing(true);

    try {
      /*
        Temporary simulation.

        Later this function will call the backend:

        POST /api/payments

        The backend will create a real payment
        through the payment gateway.

        DO NOT send/store raw card data here
        in the production implementation.
      */

      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      setErrors({
        payment: "حدث خطأ أثناء معالجة الدفع. حاول مرة أخرى.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="payment-page">
        <div className="payment-header">
          <h1>الدفع</h1>

          <p>الرجاء مراجعة تفاصيل الطلب وإتمام عملية الدفع بأمان.</p>
        </div>

        <div className="payment-content">
          {/*
              Payment Form
          */}

          <div className="payment-form-section">
            {/* Payment Methods */}

            <section className="payment-card">
              <h2>طريقة الدفع</h2>

              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment-method"
                    value="card"
                    defaultChecked
                  />

                  <span className="payment-method-icon">
                    <MdOutlineCreditCard />
                  </span>

                  <span>بطاقة ائتمان / خصم مباشر</span>
                </label>

                <label className="payment-method disabled">
                  <input
                    type="radio"
                    name="payment-method"
                    value="bank"
                    disabled
                  />

                  <span className="payment-method-icon">
                    <MdAccountBalance />
                  </span>

                  <span>تحويل بنكي (قريباً)</span>
                </label>
              </div>
            </section>

            {/* Card Details */}
            <section className="payment-card">
              <h2>بيانات البطاقة</h2>

              <div className="card-form">
                {/* Card Name */}
                <div className="form-field">
                  <label htmlFor="card-name">الاسم على البطاقة</label>

                  <input
                    id="card-name"
                    type="text"
                    value={cardName}
                    onChange={handleCardNameChange}
                    placeholder="الاسم الكامل كما يظهر على البطاقة"
                    autoComplete="cc-name"
                  />

                  {errors.cardName && (
                    <span className="form-error">{errors.cardName}</span>
                  )}
                </div>

                {/* Card Number */}
                <div className="form-field">
                  <label htmlFor="card-number">رقم البطاقة</label>

                  <div className="input-with-icon">
                    <input
                      id="card-number"
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      autoComplete="cc-number"
                    />
                  </div>

                  {errors.cardNumber && (
                    <span className="form-error">{errors.cardNumber}</span>
                  )}
                </div>

                {/* Expiry + CVV */}
                <div className="form-row">
                  {/* Expiry */}

                  <div className="form-field">
                    <label>تاريخ الانتهاء</label>

                    <div className="expiry-inputs">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={expiryMonth}
                        onChange={handleExpiryMonthChange}
                        placeholder="MM"
                        maxLength={2}
                        dir="ltr"
                        autoComplete="cc-exp-month"
                      />

                      <span>/</span>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={expiryYear}
                        onChange={handleExpiryYearChange}
                        placeholder="YY"
                        maxLength={2}
                        dir="ltr"
                        autoComplete="cc-exp-year"
                      />
                    </div>

                    {errors.expiry && (
                      <span className="form-error">{errors.expiry}</span>
                    )}
                  </div>

                  {/* CVV */}
                  <div className="form-field">
                    <label htmlFor="cvv">رمز الأمان (CVV)</label>

                    <div className="input-with-icon">
                      <input
                        id="cvv"
                        type="password"
                        inputMode="numeric"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        maxLength={3}
                        dir="ltr"
                        autoComplete="cc-csc"
                      />

                      <span title="3 أرقام خلف البطاقة" className="info-icon">
                        <MdInfoOutline />
                      </span>
                    </div>

                    {errors.cvv && (
                      <span className="form-error">{errors.cvv}</span>
                    )}
                  </div>
                </div>

                {errors.payment && (
                  <div className="payment-error">
                    <MdInfoOutline />

                    <span>{errors.payment}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/*Order Summary */}

          <aside className="order-summary">
            <div className="summary-card">
              <h2>ملخص الطلب</h2>

              <div className="summary-details">
                <div className="summary-row">
                  <span>اسم المتقدم</span>

                  <strong>{formData?.applicant?.fullName || "—"}</strong>
                </div>

                <div className="summary-row">
                  <span>رسوم الخدمة</span>

                  <strong>{serviceFee.toFixed(2)} جنيه</strong>
                </div>
              </div>

              <div className="summary-total">
                <span>الإجمالي</span>

                <strong>{serviceFee.toFixed(2)} جنيه</strong>
              </div>

              <div className="payment-disclaimer">
                <MdInfoOutline />

                <p>
                  هذه الرسوم هي مقابل خدمة المراجعة والتجهيز الخاصة، ولا تشمل أي
                  رسوم حكومية.
                </p>
              </div>

              <button
                type="button"
                className="pay-button"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span>جاري معالجة الدفع...</span>
                ) : (
                  <>
                    <span>ادفع الآن</span>
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Payment;
