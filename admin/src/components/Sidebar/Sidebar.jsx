import { NavLink } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { FaWpforms } from "react-icons/fa";
import { MdOutlinePayments, MdLogout  } from "react-icons/md";
import { useAuth } from "../../context/auth-context";
import "./sidebar.css";

const navigationLinks = [
  {
    to: "/",
    label: "الرئيسية",
    icon: <GoHome />,
  },
  {
    to: "/applications",
    label: "الطلبات",
    icon: <FaWpforms />,
  },
  {
    to: "/payments",
    label: "المدفوعات",
    icon: <MdOutlinePayments />,
  },
];

const Sidebar = () => {
  const { logout } = useAuth();
  
  return (
    <aside className="sidebar">
      <div>
        <div className="logo">
          <div>
            <img src="/logo.png" alt="ELMNAHRY" />
            <h2>ELMNAHRY</h2>
          </div>
          <p>نظام إدارة طلبات الهجرة</p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <div className="label">
                <span className="icon">{link.icon}</span>
                <span>{link.label}</span>
              </div>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout (pushed to the bottom by justify-content: space-between) */}
      <div className="sidebar-footer">
        <button type="button" className="sidebar-link logout" onClick={logout}>
          <div className="label">
            <span className="icon">
              <MdLogout />
            </span>
            <span>تسجيل الخروج</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
