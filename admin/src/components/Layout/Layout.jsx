import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./layout.css";

const Layout = () => {
  return (
    <>
      <Sidebar />
      <div className="layout-content">
        <Header />
        <main>
          {/* The current page renders here */}
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;