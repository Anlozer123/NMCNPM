import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaFilePrescription,
  FaSignOutAlt,
  FaStethoscope,
  FaClock,
  FaFileMedical,
  FaInfoCircle,
  FaCalendarPlus
} from "react-icons/fa";
import "./PatientAppointments.css"; // Import CSS

const PatientAppointment = () => {
  const navigate = useNavigate();
  // Lấy thông tin user
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Nguyễn Văn X" };

  // --- STATE (GIỮ NGUYÊN LOGIC) ---
  const [formData, setFormData] = useState({
    specialty: "",
    date: "",
    time: "",
    reason: ""
  });

  const [showError, setShowError] = useState(false);

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
    if (!formData.specialty || !formData.date || !formData.time) {
      alert("Vui lòng chọn đầy đủ Chuyên khoa, Ngày và Giờ khám!");
      return;
    }

    if (!formData.reason.trim()) {
      setShowError(true);
      return;
    }

    console.log("Booking Data:", formData);
    alert("Đặt lịch khám thành công! Vui lòng đến đúng giờ.");
    navigate("/dashboard");
  };

  return (
    <div className="layout-container">
      {/* --- HEADER (Giống trang Đặt đơn thuốc) --- */}
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
        {/* --- SIDEBAR MỚI (Đơn giản, đúng theo hình) --- */}
        <aside className="sidebar-nav">
          <ul>
            <li onClick={() => navigate("/dashboard")}>
              <FaHome /> Trang chủ
            </li>
            <li className="active">
              <FaCalendarAlt /> Lịch khám
            </li>
            <li onClick={() => navigate("/request-consultation")}>
              <FaComments /> Tư vấn
            </li>
            <li onClick={() => navigate("/prescription")}>
              <FaFilePrescription /> Đơn thuốc
            </li>
            <li onClick={() => navigate("/my-appointments")}>
              <FaCalendarPlus /> Quản lý lịch hẹn
            </li>
          </ul>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="main-content-area">
          <div className="page-header">
            <h1>Đặt lịch khám</h1>
            <p>UC003: Register Appointment - Đăng ký lịch hẹn với bác sĩ</p>
          </div>

          {/* CARD FORM CHÍNH */}
          <div className="appointment-card">
            <div className="card-header-text">
              <h3>Thông tin đặt lịch</h3>
              <p>Vui lòng điền đầy đủ thông tin để đặt lịch khám</p>
            </div>

            <div className="form-container">
              
              {/* 1. Chuyên khoa */}
              <div className="form-group full-width">
                <label>
                  <FaStethoscope className="input-icon icon-teal" /> 
                  Chuyên khoa
                </label>
                <select 
                  name="specialty" 
                  value={formData.specialty} 
                  onChange={handleChange}
                  className="form-control"
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
                  <label>
                    <FaCalendarAlt className="input-icon icon-blue" /> 
                    Ngày khám
                  </label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group half-width">
                  <label>
                    <FaClock className="input-icon icon-blue" /> 
                    Giờ khám
                  </label>
                  <select 
                    name="time" 
                    value={formData.time}
                    onChange={handleChange}
                    className="form-control"
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
                <label>
                  <FaFileMedical className="input-icon icon-blue" /> 
                  Lý do khám
                </label>
                <textarea 
                  name="reason" 
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
                  className={`form-control textarea ${showError ? "input-error" : ""}`}
                ></textarea>
                
                {/* Tooltip lỗi (Giữ nguyên logic) */}
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

        </main>
      </div>
    </div>
  );
};

export default PatientAppointment;