import { RiInformationLine, RiArrowLeftLine } from "react-icons/ri";
import "./Hero.css";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-container">
        {/* Disclaimer Badge */}
        <div className="hero-badge">
          <RiInformationLine />
          <span>
            هذا الموقع خدمة خاصة مستقلة ولا يمثل حكومة الولايات المتحدة
            الأمريكية أو أي جهة حكومية.
          </span>
        </div>

        {/* Hero Heading */}
        <h1 className="hero-title">قدّم طلبك بسهولة، خطوة بخطوة</h1>

        {/* Hero Description */}
        <p className="hero-description">
          نساعدك على تجهيز بيانات طلبك إلكترونيًا من خلال نموذج واضح وسهل
          الاستخدام. استشر خبرائنا واضمن اكتمال ملفك بدقة.
        </p>

        {/* Hero Actions */}
        <div className="hero-actions">
          <Link to="/apply" className="hero-primary-btn">
            <span>ابدأ التقديم</span>
            <RiArrowLeftLine />
          </Link>

          <a href="#how-it-works" className="hero-secondary-btn">
            تعرّف على خطوات التقديم
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
