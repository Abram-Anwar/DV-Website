import { FiUser } from "react-icons/fi";
import "./header.css";
import { useAuth } from "../../context/auth-context";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Header = () => {
  const { admin } = useAuth();

  //? The search box moved to the Applications page
  return (
    <header className="header">
      {/* Admin info */}
      <div className="admin-info">
        <div className="admin-avatar">
          <FiUser className="admin-icon" />
        </div>
        <div className="admin-text">
          <span className="admin-role">مسؤول النظام</span>
          <span className="admin-name">{admin.username.toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;