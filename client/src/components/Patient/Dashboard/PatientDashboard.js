import React from "react";
import {
  FaHeartbeat,
  FaTint,
  FaNotesMedical
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar";
import UserDropdown from "../UserDropdown/UserDropdown"; // Import Component Dropdown
import "./PatientDashboard.css";

const PatientDashboard = () => {
  // DỮ LIỆU GIẢ LẬP (MOCK DATA)
  // Trong thực tế, bạn có thể lấy data này từ API hoặc Context
  const userInfo = {
    fullName: "Phùng Thanh Độ",
    role: "Bệnh nhân",
    avatar: "https://i.pravatar.cc/300?img=11",
    gender: "Nam",
    email: "soibeti@gmail.com",
    dob: "12/09/1989",
    phone: "0123456879",
    height: 170,
    weight: 72,
    bmi: 24.9,
    heartRate: 98,
    bloodSugar: 80,
    bloodPressure: "102 / 72"
  };

  return (
    <div className="pd-layout">
      {/* 1. Sidebar */}
      <div className="pd-sidebar-container">
        <PatientSidebar />
      </div>

      {/* 2. Main Content */}
      <div className="pd-main-content">
        
        {/* --- HEADER --- */}
        <header className="pd-header">
          <h2 className="header-title">TỔNG QUAN</h2>
          
          <UserDropdown />
          
        </header>

        {/* --- BODY CONTENT --- */}
        <div className="pd-body-scroll">
            
            {/* Greeting Section */}
            <div className="section-greeting">
                <div className="greeting-left">
                    <h1>Xin chào,</h1>
                    <p>Chúc bạn một ngày mới tốt lành nhé !</p>
                </div>
                <div className="greeting-center-avatar">
                    <div className="avatar-circle">
                        <img src={userInfo.avatar} alt="Big Avatar" />
                    </div>
                    <button className="btn-change-avatar">Thay đổi</button>
                </div>
                <div className="greeting-right-spacer"></div>
            </div>

            {/* Personal Info Grid */}
            <div className="section-info-text">
                <div className="info-row">
                    <div className="info-col">
                        <span className="label">Họ và tên:</span>
                        <span className="value">{userInfo.fullName}</span>
                    </div>
                    <div className="info-col">
                        <span className="label">Giới tính:</span>
                        <span className="value">{userInfo.gender}</span>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-col">
                        <span className="label">Email:</span>
                        <span className="value">{userInfo.email}</span>
                    </div>
                    <div className="info-col">
                        <span className="label">Ngày sinh:</span>
                        <span className="value">{userInfo.dob}</span>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-col">
                         <span className="label">Số điện thoại:</span>
                         <span className="value">{userInfo.phone}</span>
                    </div>
                </div>
            </div>

            {/* Health Stats Grid */}
            <div className="section-stats-grid">
                <div className="stats-column-stacked">
                    <div className="stat-box box-beige">
                        <div className="ruler-lines">|||||||</div>
                        <span className="stat-label-small">Chiều cao</span>
                        <span className="stat-number">{userInfo.height} cm</span>
                    </div>
                    <div className="stat-box box-cyan">
                        <div className="ruler-lines">|||||||</div>
                        <span className="stat-label-small">Cân nặng</span>
                        <span className="stat-number">{userInfo.weight} kg</span>
                    </div>
                </div>

                <div className="stat-box box-dark bmi-box">
                    <div className="bmi-top">
                        <span>Chỉ số BMI</span>
                        <span className="bmi-badge">Khoẻ mạnh</span>
                    </div>
                    <div className="bmi-number">{userInfo.bmi}</div>
                    <div className="bmi-slider">
                        <div className="slider-bar"></div>
                        <div className="slider-dot" style={{left: '50%'}}></div>
                    </div>
                    <div className="bmi-scale">
                        <span>15</span>
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                        <span>40</span>
                    </div>
                </div>

                <div className="stat-box box-white">
                     <div className="icon-wrap icon-red"><FaHeartbeat /></div>
                     <span className="stat-title">Nhịp tim</span>
                     <div className="stat-big-val">
                        {userInfo.heartRate} <small>bpm</small>
                     </div>
                     <span className="stat-status">Bình thường</span>
                </div>

                <div className="stat-box box-white">
                     <div className="icon-wrap icon-orange"><FaTint /></div>
                     <span className="stat-title">Đường huyết</span>
                     <div className="stat-big-val">
                        {userInfo.bloodSugar} <small>mg / dL</small>
                     </div>
                     <span className="stat-status">Bình thường</span>
                </div>

                 <div className="stat-box box-white">
                     <div className="icon-wrap icon-blue"><FaNotesMedical /></div>
                     <span className="stat-title">Huyết áp</span>
                     <div className="stat-big-val">
                        {userInfo.bloodPressure} <small>mmhg</small>
                     </div>
                     <span className="stat-status">Bình thường</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;