import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaTint,
  FaNotesMedical,
  FaCamera
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar";
import UserDropdown from "../UserDropdown/UserDropdown";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(storedUser);
        const patientId = user.PatientID;

        const response = await fetch(`http://localhost:5000/api/patient/${patientId}/dashboard`);
        if (!response.ok) throw new Error("Không thể tải dữ liệu bệnh nhân.");

        const data = await response.json();
        setUserInfo(data);

        if (data.AvatarURL) {
            setAvatarPreview(data.AvatarURL);
        }

        setLoading(false);
      } catch (err) {
        console.error("Lỗi Dashboard:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const getInitials = (name) => {
    if (!name) return "BN";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const calculateBMIPosition = (bmi) => {
    if (!bmi) return '0%';
    const val = parseFloat(bmi);
    if (val <= 15) return '0%';   
    if (val >= 40) return '100%'; 

    if (val < 18.5) return `${((val - 15) / 3.5) * 25}%`;
    else if (val < 25) return `${25 + ((val - 18.5) / 6.5) * 25}%`;
    else if (val < 30) return `${50 + ((val - 25) / 5) * 25}%`;
    else return `${75 + ((val - 30) / 10) * 25}%`;
  };

  const handleTriggerFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };

  if (loading) return <div className="pd-loading-container"><div className="loader"></div></div>;
  if (error) return <div className="pd-error-container"><h3>Lỗi</h3><p>{error}</p><button onClick={() => window.location.reload()}>Thử lại</button></div>;

  return (
    <div className="pd-layout">
      <div className="pd-sidebar-container">
        <PatientSidebar />
      </div>

      <div className="pd-main-content">
        <header className="pd-header">
          <h2 className="header-title">TỔNG QUAN SỨC KHỎE</h2>
          <UserDropdown />
        </header>

        <div className="pd-body-scroll">
            
            {/* GREETING & AVATAR */}
            <div className="section-greeting">
                <div className="greeting-left">
                    <h1>Xin chào, {userInfo.FullName}</h1>
                    <p>Chào mừng bạn trở lại. Chúc bạn một ngày tràn đầy năng lượng!</p>
                </div>
                
                <div className="greeting-center-avatar">
                    <div className="avatar-wrapper">
                        {avatarPreview ? (
                            <img 
                                src={avatarPreview} 
                                alt="User Avatar" 
                                className="avatar-img-main"
                            />
                        ) : (
                            <div className="avatar-placeholder-main">
                                {getInitials(userInfo.FullName)}
                            </div>
                        )}
                        
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: "none" }} 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    
                    <button className="btn-change-avatar" onClick={handleTriggerFile}>
                        <FaCamera /> Cập nhật ảnh
                    </button>
                </div>

                <div className="greeting-right-spacer"></div>
            </div>

            {/* INFO */}
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

            {/* STATS */}
            <div className="section-stats-grid">
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

                <div className="stat-box box-dark bmi-box">
                    <div className="bmi-top">
                        <span>Chỉ số BMI</span>
                        {userInfo.BMI && (
                            <span className="bmi-badge" style={{
                                backgroundColor: userInfo.BMI < 18.5 ? '#fef08a' : (userInfo.BMI < 25 ? '#bbf7d0' : '#fecaca'),
                                color: userInfo.BMI < 18.5 ? '#854d0e' : (userInfo.BMI < 25 ? '#166534' : '#991b1b')
                            }}>
                                {userInfo.BMI < 18.5 ? "Thiếu cân" : userInfo.BMI < 25 ? "Bình thường" : "Thừa cân"}
                            </span>
                        )}
                    </div>
                    <div className="bmi-number">
                        {userInfo.BMI ? parseFloat(userInfo.BMI).toFixed(1) : "--"}
                    </div>
                    <div className="bmi-slider">
                        <div className="slider-bar"></div>
                        <div className="slider-dot" style={{ left: calculateBMIPosition(userInfo.BMI) }}></div>
                    </div>
                    <div className="bmi-scale">
                        <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
                    </div>
                </div>

                <div className="stat-box box-heart">
                     <div className="icon-wrap"><FaHeartbeat /></div>
                     <span className="stat-title">Nhịp tim</span>
                     <div className="stat-big-val">
                        {userInfo.HeartRate || "--"} <small>bpm</small>
                     </div>
                     <span className="stat-status">{userInfo.HeartRate ? "Ổn định" : "Chưa có dữ liệu"}</span>
                </div>

                <div className="stat-box box-sugar">
                     <div className="icon-wrap"><FaTint /></div>
                     <span className="stat-title">Đường huyết</span>
                     <div className="stat-big-val">
                        {userInfo.BloodSugar || "--"} <small>mg/dL</small>
                     </div>
                     <span className="stat-status">Bình thường</span>
                </div>

                 <div className="stat-box box-pressure">
                     <div className="icon-wrap"><FaNotesMedical /></div>
                     <span className="stat-title">Huyết áp</span>
                     <div className="stat-big-val">
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