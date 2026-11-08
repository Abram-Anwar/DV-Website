import { FiSearch, FiUser } from "react-icons/fi";
import "./header.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Header = () => {
  const {admin} = useAuth();

  return (
    <header className="header">
      {/* Search */}
      <div className="search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="بحث برقم الطلب، اسم المتقدم..." />
      </div>

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
