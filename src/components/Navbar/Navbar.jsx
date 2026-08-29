import { RiMenu3Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <img src="/logo.png" alt="ELMNAHRY" />
          <span>ELMNAHRY</span>
        </div>

        {/* Navigation */}
        <nav className="navbar-nav">
          <a href="#" className={activeLink === "hero" ? "active" : ""}>
            الرئيسية
          </a>
          <a
            href="#how-it-works"
            className={activeLink === "how-it-works" ? "active" : ""}
          >
            خطوات التقديم
          </a>
          <a
            href="#pricing"
            className={activeLink === "pricing" ? "active" : ""}
          >
            الأسعار
          </a>
          <a href="#faq" className={activeLink === "faq" ? "active" : ""}>
            الأسئلة الشائعة
          </a>
          <a href="#">تواصل معنا</a>
        </nav>

        {/* Apply */}
        <div className="apply-btn">
          <Link to="/apply"> ابدأ التقديم </Link>
        </div>

        {/* Mobile Menu Button*/}
        <button
          className="menu-btn"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <RiMenu3Fill />
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <a onClick={() => setIsMenuOpen(false)} href="#">
              الرئيسية
            </a>
            <a onClick={() => setIsMenuOpen(false)} href="#how-it-works">
              خطوات التقديم
            </a>
            <a onClick={() => setIsMenuOpen(false)} href="#pricing">
              الأسعار
            </a>
            <a onClick={() => setIsMenuOpen(false)} href="#faq">
              الأسئلة الشائعة
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
