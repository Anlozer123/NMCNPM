import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaStethoscope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUserMd,
  FaPlus
} from "react-icons/fa";
import PatientSidebar from "../../Sidebar/PatientSidebar"; 
import "./AppointmentManagement.css";

const AppointmentManagement = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Nguyễn Văn X" };

  // ... (Phần Mock Data và hàm renderStatusBadge giữ nguyên như cũ) ...
  const [appointments, setAppointments] = useState([
      {
        id: 1,
        doctorName: "Bác sĩ Nguyễn Văn A",
        specialty: "Tim mạch",
        date: "2025-01-25",
        time: "09:00",
        location: "Phòng 101, Tầng 1",
        reason: "Đau ngực trái, khó thở khi gắng sức",
        status: "confirmed"
      },
      // ...
  ]);

  const renderStatusBadge = (status) => {
      // ... (Giữ nguyên logic cũ)
      if (status === "confirmed") return <span className="status-badge badge-success">Đã xác nhận</span>;
      if (status === "pending") return <span className="status-badge badge-pending">Chờ duyệt</span>;
      return <span className="status-badge badge-danger">Đã hủy</span>;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="layout-container">
      {/* Header */}
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
        {/* --- THAY THẾ TOÀN BỘ CODE SIDEBAR CŨ BẰNG DÒNG NÀY --- */}
        <PatientSidebar /> 
        {/* ------------------------------------------------------- */}

        {/* Main Content */}
        <main className="main-content-area">
          <div className="page-header-flex">
            <div>
              <h1>Lịch hẹn của tôi</h1>
              <p>Quản lý các cuộc hẹn khám bệnh sắp tới và lịch sử khám</p>
            </div>
            <button className="btn-new-appointment" onClick={() => navigate("/appointment")}>
              <FaPlus /> Đặt lịch mới
            </button>
          </div>

          <div className="appointment-list">
             {/* ... (Phần map danh sách appointments giữ nguyên như cũ) ... */}
             {appointments.map((appt) => (
              <div key={appt.id} className="appt-card">
                <div className="appt-card-header">
                  <div className="doctor-info">
                    <h3>{appt.doctorName}</h3>
                    <span className="specialty">{appt.specialty}</span>
                  </div>
                  {renderStatusBadge(appt.status)}
                </div>
                <div className="appt-card-body">
                  <div className="info-grid">
                    <div className="info-item"><FaCalendarAlt className="icon-blue" /> <span>{appt.date}</span></div>
                    <div className="info-item"><FaMapMarkerAlt className="icon-blue" /> <span>{appt.location}</span></div>
                    <div className="info-item"><FaClock className="icon-blue" /> <span>{appt.time}</span></div>
                    <div className="info-item"><FaUserMd className="icon-blue" /> <span>Lý do: {appt.reason}</span></div>
                  </div>
                </div>
                {appt.status === "confirmed" && (
                  <div className="appt-card-footer">
                    <div className="divider"></div>
                    <div className="card-actions">
                      <button className="btn-outline">Dời lịch</button>
                      <button className="btn-danger-outline">Hủy hẹn</button>
                      <button className="btn-light">Chi tiết</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentManagement;