import React from "react";
import "../layout.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { studentNavigation, teacherNavigation } from "../data/navigationData";

function AppLayout({ children }) {
  const { currentUser } = useSelector((state) => state.auth);

  const navigationItems =
    currentUser?.role === "teacher" ? teacherNavigation : studentNavigation;

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <div className="app-container vh-100 p-3 bg-light">
      <div className="d-flex h-100">
        <aside
          className="navigation-sidebar bg-dark text-white rounded-4 me-4 p-4 d-flex flex-column"
          style={{ width: "280px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          <div className="sidebar-header border-bottom border-secondary pb-3 mb-4">
            <h4 className="text-white fw-bold m-0">Scholarly Connect</h4>
          </div>
          <nav className="nav-menu flex-grow-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="d-flex align-items-center text-white text-decoration-none py-2 px-3 rounded-2 mb-2 transition-all hover-bg-secondary"
                style={{ transition: "background-color 0.2s" }}
              >
                <i className={`${item.icon} fs-5`}></i>
                <span className="ms-3 fw-light">{item.name}</span>
              </Link>
            ))}
          </nav>
          <div
            className="d-flex align-items-center cursor-pointer text-white py-2 px-3 rounded-2 transition-all mt-auto"
            onClick={handleLogout}
            style={{ borderTop: "1px solid #343a40" }}
          >
            <i className="ri-logout-box-r-line fs-5"></i>
            <Link to="/login" className="ms-3 text-white text-decoration-none fw-light">
              Sign Out
            </Link>
          </div>
        </aside>
        <main className="content-area w-100 rounded-4 d-flex flex-column" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <header
            className="app-header bg-white text-dark d-flex justify-content-center align-items-center border-bottom rounded-top-4"
            style={{ height: "60px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
          >
            <h5 className="m-0 fw-bold text-primary">Schedule Your 1:1 Session</h5>
          </header>
          <section className="page-content w-100 p-4 flex-grow-1 bg-white rounded-bottom-4">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;