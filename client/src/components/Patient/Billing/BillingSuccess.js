import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaSignOutAlt, FaStethoscope } from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import "./Billing.css";

const BillingSuccess = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Nguyễn Văn X" };

  return (
    <div className="layout-container">
      <header className="top-header">
        <div className="logo-section">
          <FaStethoscope className="logo-icon" />
          <span>MediCare Hospital</span>
        </div>
        <div className="user-section">
          <span className="user-name">{user.FullName}</span>
          <button className="header-logout-btn"><FaSignOutAlt /> Đăng xuất</button>
        </div>
      </header>

      <div className="body-container">
        <PatientSidebar /> {/* Sidebar giữ nguyên */}

        <main className="main-content-area">
            <div className="success-wrapper">
                <div className="success-card">
                    <div className="success-icon-circle">
                        <FaCheck />
                    </div>
                    <h2 className="success-title">Thanh toán thành công!</h2>
                    <p className="success-desc">
                        Đơn hàng của bạn đã được xác nhận và sẽ được giao trong 1-2 ngày làm việc.
                    </p>
                    <button className="btn-home" onClick={() => navigate("/dashboard")}>
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default BillingSuccess;