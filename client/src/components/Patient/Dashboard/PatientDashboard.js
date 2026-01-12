import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaUserCircle
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar";
import UserDropdown from "../UserDropdown/UserDropdown";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Lấy thông tin user từ localStorage (lưu từ trang Login)
        const storedUser = localStorage.getItem("user");
        
        if (!storedUser) {
          // Nếu chưa đăng nhập, chuyển hướng về trang login
          navigate("/login");
          return;
        }

        const user = JSON.parse(storedUser);
        const patientId = user.PatientID;

        if (!patientId) {
          throw new Error("Không tìm thấy mã bệnh nhân trong hệ thống.");
        }

        // 2. Gọi API lấy dữ liệu chi tiết từ Backend
        // Đảm bảo URL này khớp với cấu hình server của bạn (ví dụ port 5000)
        const response = await fetch(`http://localhost:5000/api/patient/${patientId}/dashboard`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không thể tải dữ liệu bệnh nhân.");
        }

        const data = await response.json();
        
        // 3. Cập nhật state với dữ liệu thật từ DB
        setUserInfo(data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi Dashboard:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Hàm hỗ trợ định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Màn hình chờ khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="pd-loading-container">
        <div className="loader"></div>
        <p>Đang tải thông tin sức khỏe của bạn...</p>
      </div>
    );
  }

  // Màn hình hiển thị lỗi
  if (error) {
    return (
      <div className="pd-error-container">
        <h3>Đã có lỗi xảy ra</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="pd-layout">
      {/* 1. Sidebar bên trái */}
      <div className="pd-sidebar-container">
        <PatientSidebar />
      </div>

      {/* 2. Nội dung chính bên phải */}
      <div className="pd-main-content">
        
        {/* --- HEADER --- */}
        <header className="pd-header">
          <h2 className="header-title">TỔNG QUAN SỨC KHỎE</h2>
          <UserDropdown />
        </header>

        {/* --- BODY CONTENT --- */}
        <div className="pd-body-scroll">
            
            {/* Greeting Section */}
            <div className="section-greeting">
                <div className="greeting-left">
                    <h1>Xin chào, {userInfo.FullName}</h1>
                    <p>Chào mừng bạn trở lại. Chúc bạn một ngày tràn đầy năng lượng!</p>
                    <span className="patient-id-badge">Mã bệnh nhân: #{userInfo.PatientID}</span>
                </div>
                <div className="greeting-center-avatar">
                    <div className="avatar-circle">
                        {/* Hiển thị avatar mặc định vì database chưa có trường ảnh */}
                        <img src="https://i.pravatar.cc/300?img=11" alt="Patient Avatar" />
                    </div>
                    <button className="btn-change-avatar">Cập nhật ảnh</button>
                </div>
                <div className="greeting-right-spacer"></div>
            </div>

            {/* Personal Info Grid */}
            <div className="section-info-text">
                <h3 className="section-title">Thông tin cá nhân</h3>
                <div className="info-row">
                    <div className="info-col">
                        <span className="label">Họ và tên:</span>
                        <span className="value">{userInfo.FullName}</span>
                    </div>
                    <div className="info-col">
                        <span className="label">Giới tính:</span>
                        <span className="value">{userInfo.Gender || "Chưa cập nhật"}</span>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-col">
                        <span className="label">Email:</span>
                        <span className="value">{userInfo.Email || "Chưa cập nhật"}</span>
                    </div>
                    <div className="info-col">
                        <span className="label">Ngày sinh:</span>
                        <span className="value">{formatDate(userInfo.DoB)}</span>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-col">
                         <span className="label">Số điện thoại:</span>
                         <span className="value">{userInfo.Phone || "N/A"}</span>
                    </div>
                    <div className="info-col">
                         <span className="label">Địa chỉ:</span>
                         <span className="value">{userInfo.Address || "Chưa cập nhật"}</span>
                    </div>
                </div>
            </div>

            {/* Health Stats Grid */}
            <div className="section-stats-grid">
                {/* Cột Chiều cao & Cân nặng */}
                <div className="stats-column-stacked">
                    <div className="stat-box box-beige">
                        <div className="ruler-lines">|||||||</div>
                        <span className="stat-label-small">Chiều cao</span>
                        <span className="stat-number">{userInfo.Height || "--"} <small>cm</small></span>
                    </div>
                    <div className="stat-box box-cyan">
                        <div className="ruler-lines">|||||||</div>
                        <span className="stat-label-small">Cân nặng</span>
                        <span className="stat-number">{userInfo.Weight || "--"} <small>kg</small></span>
                    </div>
                </div>

                {/* Chỉ số BMI */}
                <div className="stat-box box-dark bmi-box">
                    <div className="bmi-top">
                        <span>Chỉ số BMI</span>
                        {userInfo.BMI && (
                            <span className="bmi-badge">
                                {userInfo.BMI < 18.5 ? "Thiếu cân" : 
                                 userInfo.BMI < 25 ? "Bình thường" : "Thừa cân"}
                            </span>
                        )}
                    </div>
                    <div className="bmi-number">{userInfo.BMI || "--"}</div>
                    <div className="bmi-slider">
                        <div className="slider-bar"></div>
                        <div 
                            className="slider-dot" 
                            style={{left: userInfo.BMI ? `${Math.min((userInfo.BMI / 40) * 100, 100)}%` : '50%'}}
                        ></div>
                    </div>
                    <div className="bmi-scale">
                        <span>15</span>
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                        <span>40</span>
                    </div>
                </div>

                {/* Nhịp tim */}
                <div className="stat-box box-white">
                     <div className="icon-wrap icon-red"><FaHeartbeat /></div>
                     <span className="stat-title">Nhịp tim</span>
                     <div className="stat-big-val">
                        {userInfo.HeartRate || "--"} <small>bpm</small>
                     </div>
                     <span className="stat-status">{userInfo.HeartRate ? "Ổn định" : "Chưa có dữ liệu"}</span>
                </div>

                {/* Đường huyết */}
                <div className="stat-box box-white">
                     <div className="icon-wrap icon-orange"><FaTint /></div>
                     <span className="stat-title">Đường huyết</span>
                     <div className="stat-big-val">
                        {userInfo.BloodSugar || "--"} <small>mg/dL</small>
                     </div>
                     <span className="stat-status">Bình thường</span>
                </div>

                {/* Huyết áp */}
                 <div className="stat-box box-white">
                     <div className="icon-wrap icon-blue"><FaNotesMedical /></div>
                     <span className="stat-title">Huyết áp</span>
                     <div className="stat-big-val">
                        {/* Sử dụng trường BloodPressure đã gộp từ Backend */}
                        {userInfo.BloodPressure || "-- / --"} <small>mmHg</small>
                     </div>
                     <span className="stat-status">Chỉ số mới nhất</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;