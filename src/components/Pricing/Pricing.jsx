import {
  MdOutlineWorkspacePremium,
  MdOutlineCheckCircleOutline,
} from "react-icons/md";
import "./Pricing.css";
import { Link } from "react-router-dom";

const features = [
  "مراجعة شاملة للبيانات المدخلة",
  "دعم فني خلال عملية التعبئة",
  "تجهيز النموذج النهائي بدقة",
];

const price = {
  sallery: 250,
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
            <span className="price">{`${price.sallery} ${price.currency}`}</span>
            <span className="price-label">/ للطلب الواحد</span>
          </div>

          {/* Features */}
          <ul className="pricing-features">
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
