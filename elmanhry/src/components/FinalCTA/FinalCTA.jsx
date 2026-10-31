import { RiArrowLeftLine } from "react-icons/ri";

import "./FinalCTA.css";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="final-cta">
      <div className="final-cta-container">
        <h2>هل أنت مستعد للبدء؟</h2>

        <p>انضم إلى مئات العملاء الذين وثقوا بخدماتنا لتسهيل إجراءاتهم.</p>

        <Link to="/apply" className="final-cta-btn">
          <span>ابدأ طلبك الآن</span>
          <RiArrowLeftLine />
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;
