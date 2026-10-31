import { RiMenu3Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    //? Track the visible section to update the active navigation link.
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
          <Link to="/" className={activeLink === "hero" ? "active" : ""}>
            الرئيسية
          </Link>
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
        </nav>

        {/* Apply */}
        <div className="apply-btn">
          <Link to="/apply"> ابدأ التقديم </Link>
        </div>

        {/* Toggle the mobile navigation menu */}
        <button
          className="menu-btn"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <RiMenu3Fill />
        </button>

        {/* Mobile Menu  */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={activeLink === "hero" ? "active" : ""}
            >
              الرئيسية
            </Link>
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
