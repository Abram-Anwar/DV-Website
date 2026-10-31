import {
  MdOutlineWorkspacePremium,
  MdOutlineCheckCircleOutline,
} from "react-icons/md";
import "./Pricing.css";
import { Link } from "react-router-dom";

//? Define the service features displayed in the pricing card.
const features = [
  "مراجعة شاملة للبيانات المدخلة",
  "دعم فني خلال عملية التعبئة",
  "تجهيز النموذج النهائي بدقة",
];

//? Store the service price and currency.
const price = {
  amount: 250,
  currency: "ج.م",
};

const Pricing = () => {
  return (
    <section className="pricing" id="pricing">
      <div className="pricing-container">
        {/* .Section Header */}
        <div className="pricing-header">
          <h2>تكلفة الخدمة</h2>
          <p>شفافية تامة في الأسعار، بدون رسوم خفية.</p>
        </div>

        {/* Pricing Card */}
        <div className="pricing-card">
          <MdOutlineWorkspacePremium className="pricing-icon" />
          <h3>رسوم معالجة الطلب</h3>

          {/* Price */}
          <div className="pricing-price">
            <span className="price">{`${price.amount} ${price.currency}`}</span>
            <span className="price-label">/ للطلب الواحد</span>
          </div>

          {/* Features */}
          <ul className="pricing-features">
            {/* Render each feature in the card */}
            {features.map((feature) => {
              return (
                <li key={feature}>
                  <MdOutlineCheckCircleOutline />
                  <span>{feature}</span>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <Link to="/apply" className="pricing-btn">
            ابدأ التقديم الآن
          </Link>

          {/* Disclaimer */}
          <p className="pricing-note">
            * هذه الرسوم لا تشمل أي رسوم حكومية قد تكون مطلوبة.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
