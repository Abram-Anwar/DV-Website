import { MdCopyright } from "react-icons/md";
import "./Footer.css";

const footerLinks = [
  "سياسة الخصوصية",
  "الشروط والأحكام",
  "إخلاء المسؤولية القانونية",
  "خريطة الموقع",
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Links */}
        <nav className="footer-links">
          {footerLinks.map((link) => (
            <a href="#" key={link}>
              {link}
            </a>
          ))}
        </nav>

        {/* Disclaimer */}
        <div className="footer-info">
          <p className="footer-disclaimer">
            إخلاء مسؤولية: هذا الموقع ("المناهري") هو خدمة استشارية خاصة مستقلة
            ولا ينتمي إلى، أو يمثل، أو يحظى برعاية أي جهة حكومية. الرسوم
            المدفوعة هنا هي مقابل خدماتنا الاستشارية وتسهيل تعبئة النماذج، ولا
            تتضمن أي رسوم حكومية رسمية.
          </p>

          <div className="footer-copyright">
            <MdCopyright />
            <span>2026 جميع الحقوق محفوظة.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
