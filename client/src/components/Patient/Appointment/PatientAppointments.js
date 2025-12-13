import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarPlus,
  FaNotesMedical,
  FaUserMd,
  FaSignOutAlt,
  FaStethoscope,
  FaCalendarAlt,
  FaClock,
  FaFileMedical
} from "react-icons/fa";
import "./PatientAppointments.css"; // Import CSS

const PatientAppointment = () => {
  const navigate = useNavigate();
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Nguyễn Văn X" };

  // --- STATE ---
  const [formData, setFormData] = useState({
    specialty: "",
    date: "",
    time: "",
    reason: ""
  });

  const [showError, setShowError] = useState(false); // Để hiển thị tooltip lỗi

  // --- MOCK DATA ---
  const specialties = [
    "Khoa Nội tổng quát",
    "Khoa Ngoại",
    "Khoa Nhi",
    "Khoa Tai Mũi Họng",
    "Khoa Răng Hàm Mặt",
    "Khoa Tim mạch"
  ];

  const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00"
  ];

  // --- HANDLERS ---
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "reason" && value.trim() !== "") {
      setShowError(false);
    }
  };

  const handleSubmit = () => {
    // Validate dữ liệu
    if (!formData.specialty || !formData.date || !formData.time) {
      alert("Vui lòng chọn đầy đủ Chuyên khoa, Ngày và Giờ khám!");
      return;
    }

    if (!formData.reason.trim()) {
      setShowError(true); // Hiển thị tooltip lỗi như trong ảnh
      return;
    }

    // Logic gọi API đặt lịch ở đây
    console.log("Booking Data:", formData);
    alert("Đặt lịch khám thành công! Vui lòng đến đúng giờ.");
    navigate("/dashboard");
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR (Giống các trang khác) --- */}
      <div className="sidebar">
        <div className="profile-section">
          <div className="avatar-circle">
            {user.FullName ? user.FullName.charAt(0) : "P"}
          </div>
          <h3>{user.FullName}</h3>
          <p>Bệnh nhân</p>
        </div>
        <ul className="menu-list">
          <li onClick={() => navigate("/dashboard")}>
            <FaUserMd /> Tổng quan
          </li>
          <li className="active"> {/* Active state */}
            <FaCalendarPlus /> Đặt lịch khám
          </li>
          <li onClick={() => navigate("/request-consultation")}>
            <FaNotesMedical /> Yêu cầu tư vấn
          </li>
          <li onClick={() => navigate("/prescription")}>
            <FaNotesMedical /> Đặt đơn thuốc
          </li>
          <li onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Đăng xuất
          </li>
        </ul>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="main-content appointment-page">
        <header className="page-header">
          <h2>Đặt lịch khám</h2>
          <p>UC003: Register Appointment - Đăng ký lịch hẹn với bác sĩ</p>
        </header>

        <div className="appointment-card">
          <div className="card-header-text">
            <h3>Thông tin đặt lịch</h3>
            <p>Vui lòng điền đầy đủ thông tin để đặt lịch khám</p>
          </div>

          {/* Form Content */}
          <div className="form-container">
            
            {/* 1. Chuyên khoa */}
            <div className="form-group full-width">
              <label><FaStethoscope className="icon-blue" /> Chuyên khoa</label>
              <select 
                name="specialty" 
                value={formData.specialty} 
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Chọn chuyên khoa</option>
                {specialties.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* 2. Ngày & Giờ (2 cột) */}
            <div className="form-row">
              <div className="form-group half-width">
                <label><FaCalendarAlt className="icon-blue" /> Ngày khám</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group half-width">
                <label><FaClock className="icon-blue" /> Giờ khám</label>
                <select 
                  name="time" 
                  value={formData.time}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Chọn giờ</option>
                  {timeSlots.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Lý do khám */}
            <div className="form-group full-width relative-group">
              <label><FaFileMedical className="icon-blue" /> Lý do khám</label>
              <textarea 
                name="reason" 
                value={formData.reason}
                onChange={handleChange}
                placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
                className={`form-input textarea ${showError ? "input-error" : ""}`}
              ></textarea>
              
              {/* Tooltip lỗi giống trong ảnh */}
              {showError && (
                <div className="error-tooltip">
                  Vui lòng điền vào trường này.
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="action-buttons mt-30">
              <button className="btn-primary" onClick={handleSubmit}>
                Xác nhận đặt lịch
              </button>
              <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                Hủy
              </button>
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <div className="note-card">
          <p><strong>Lưu ý:</strong> Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục. Nếu cần hủy hoặc thay đổi lịch hẹn, vui lòng thông báo trước ít nhất 24 giờ.</p>
        </div>

      </div>
    </div>
  );
};

export default PatientAppointment;