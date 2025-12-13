import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaFilePrescription,
  FaSignOutAlt,
  FaStethoscope,
  FaArrowRight,
  FaNotesMedical,
  FaCalendarPlus
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; // <--- Import Component Sidebar dùng chung
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const navigate = useNavigate();
  // Lấy thông tin user
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Nguyễn Văn X" };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="layout-container">
      {/* --- HEADER (Đồng bộ) --- */}
      <header className="top-header">
        <div className="logo-section" onClick={() => navigate("/dashboard")}>
          <FaStethoscope className="logo-icon" />
          <span className="brand-name">MediCare Hospital</span>
        </div>
        <div className="user-section">
          <span className="user-name">{user.FullName}</span>
          <button className="header-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </header>

      <div className="body-container">
        {/* --- SỬ DỤNG SIDEBAR DÙNG CHUNG --- */}
        <PatientSidebar />
        {/* ---------------------------------- */}

        {/* --- MAIN CONTENT --- */}
        <main className="main-content-area">
          <div className="welcome-banner">
            <h1>Chào mừng quay trở lại, {user.FullName}! 👋</h1>
            <p>Hôm nay bạn cảm thấy thế nào? Hãy chọn một dịch vụ bên dưới để bắt đầu.</p>
          </div>

          <div className="dashboard-grid">
            
            {/* Card 1: Đặt lịch khám */}
            <div className="dashboard-card" onClick={() => navigate("/appointment")}>
              <div className="icon-wrapper bg-blue">
                <FaCalendarPlus />
              </div>
              <div className="card-content">
                <h3>Đặt Lịch Khám</h3>
                <p>Đăng ký lịch hẹn khám bệnh với các bác sĩ chuyên khoa.</p>
                <span className="link-text">Đặt ngay <FaArrowRight /></span>
              </div>
            </div>

            {/* Card 2: Tư vấn trực tuyến */}
            <div className="dashboard-card" onClick={() => navigate("/request-consultation")}>
              <div className="icon-wrapper bg-teal">
                <FaComments />
              </div>
              <div className="card-content">
                <h3>Tư Vấn Trực Tuyến</h3>
                <p>Gửi câu hỏi và triệu chứng để nhận tư vấn từ bác sĩ.</p>
                <span className="link-text">Gửi yêu cầu <FaArrowRight /></span>
              </div>
            </div>

            {/* Card 3: Đặt đơn thuốc */}
            <div className="dashboard-card" onClick={() => navigate("/prescription")}>
              <div className="icon-wrapper bg-purple">
                <FaFilePrescription />
              </div>
              <div className="card-content">
                <h3>Đặt Đơn Thuốc</h3>
                <p>Mua thuốc theo đơn của bác sĩ và giao hàng tận nơi.</p>
                <span className="link-text">Đặt thuốc <FaArrowRight /></span>
              </div>
            </div>

            {/* Card 4: Hồ sơ bệnh án (Ví dụ thêm cho cân đối layout) */}
            <div className="dashboard-card" onClick={() => alert("Tính năng đang phát triển")}>
              <div className="icon-wrapper bg-orange">
                <FaNotesMedical />
              </div>
              <div className="card-content">
                <h3>Hồ Sơ Sức Khỏe</h3>
                <p>Xem lại lịch sử khám bệnh và các kết quả xét nghiệm.</p>
                <span className="link-text">Xem chi tiết <FaArrowRight /></span>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;