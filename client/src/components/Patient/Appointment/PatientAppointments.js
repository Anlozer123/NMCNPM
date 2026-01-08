import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaMapMarkerAlt,
  FaUserMd,
  FaRegCalendarAlt,
  FaRegClock,
  FaCheckCircle, // <--- Thêm icon tích xanh
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; 
import CustomCalendar from "../../Common/CustomCalendar/CustomCalendar"; 
import "./PatientAppointments.css";

const PatientAppointments = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Phùng Thanh Độ" };

  // --- STATE QUẢN LÝ GIAO DIỆN ---
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null });
  
  // State Modal Thành Công (MỚI)
  const [successModal, setSuccessModal] = useState(false);

  // --- MOCK DATA ---
  const [appointments, setAppointments] = useState([
    {
      id: 1, doctorName: "BÁC SĨ NGUYỄN VĂN A", specialty: "TIM MẠCH",
      date: "02/12/2025", time: "09:00 - 12:00", location: "Phòng 101, tầng 1",
      desc: "Khó thở khi gắng sức", status: "pending"
    },
    {
      id: 2, doctorName: "BÁC SĨ NGUYỄN VĂN B", specialty: "DA LIỄU",
      date: "30/11/2025", time: "15:00 - 18:00", location: "Phòng 205, tầng 5",
      desc: "Da mẩn đỏ", status: "confirmed"
    }
  ]);

  const [formData, setFormData] = useState({ date: "", specialty: "", doctor: "", timeSlot: "", desc: "" });
  const specialties = ["Da liễu", "Tim mạch", "Nội khoa", "Ngoại khoa"];
  const timeSlots = ["09:00 - 12:00", "12:00 - 15:00", "15:00 - 18:00", "18:00 - 19:00"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
    setShowCalendar(false);
  };

  // --- HÀM XỬ LÝ ĐẶT LỊCH (ĐÃ SỬA) ---
  const handleBooking = () => {
    // 1. Validate
    if (!formData.date || !formData.specialty || !formData.doctor || !formData.timeSlot) {
      setErrorModal({ show: true, message: "Những nội dung có dấu (*) không được bỏ trống" });
      return;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setErrorModal({ show: true, message: "Ngày chọn phải sau ngày hiện hành" });
      return;
    }

    if (formData.date === "2025-12-25") {
        setErrorModal({ show: true, message: "Ngày chọn đã kín lịch" });
        return;
    }

    // 2. Thêm lịch mới
    const newAppt = {
      id: Date.now(),
      doctorName: formData.doctor.toUpperCase(),
      specialty: formData.specialty.toUpperCase(),
      date: formData.date.split("-").reverse().join("/"),
      time: formData.timeSlot,
      location: "Phòng chờ số 1",
      desc: formData.desc || "Không có mô tả",
      status: "pending"
    };
    setAppointments([newAppt, ...appointments]);

    // 3. Hiển thị Modal Thành Công thay cho Alert
    setSuccessModal(true); 
    
    // 4. Reset Form
    setFormData({ date: "", specialty: "", doctor: "", timeSlot: "", desc: "" });
  };

  // Các hàm xử lý Hủy (Confirm Modal)
  const openConfirmModal = (id) => setConfirmModal({ show: true, id: id });
  const closeConfirmModal = () => setConfirmModal({ show: false, id: null });
  const confirmCancel = () => {
    if (confirmModal.id) {
      setAppointments(appointments.filter(a => a.id !== confirmModal.id));
      closeConfirmModal();
    }
  };

  const renderStatus = (status, id) => {
    switch(status) {
        case "pending": return (
            <div className="status-group">
                <button className="btn-cancel" onClick={() => openConfirmModal(id)}>Huỷ lịch hẹn</button>
                <span className="badge-pending">Đang chờ duyệt</span>
            </div>
        );
        case "confirmed": return <span className="badge-confirmed">Đã xác nhận</span>;
        case "completed": return <span className="badge-completed">Đã hoàn thành</span>;
        default: return null;
    }
  };

  return (
    <div className="pd-layout">
      
      {/* 1. ERROR MODAL */}
      {errorModal.show && (
        <div className="modal-overlay">
          <div className="error-modal">
            <h3 className="error-title">THÔNG BÁO LỖI</h3>
            <p className="error-message">{errorModal.message}</p>
            <button className="btn-retry" onClick={() => setErrorModal({ show: false, message: "" })}>
                THỬ LẠI
            </button>
          </div>
        </div>
      )}

      {/* 2. CONFIRM MODAL (HỦY) */}
      {confirmModal.show && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3 className="confirm-title">XÁC NHẬN HỦY</h3>
            <p className="confirm-message">Bạn có chắc chắn muốn hủy lịch hẹn này không?</p>
            <div className="confirm-actions">
                <button className="btn-secondary-modal" onClick={closeConfirmModal}>Không</button>
                <button className="btn-danger-modal" onClick={confirmCancel}>Có</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUCCESS MODAL (MỚI) */}
      {successModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <FaCheckCircle className="success-icon-large" />
            <h3 className="success-title">ĐẶT LỊCH THÀNH CÔNG!</h3>
            <p className="success-message">
                Yêu cầu đặt lịch của bạn đã được gửi. <br/> 
                Vui lòng theo dõi trạng thái ở danh sách bên dưới.
            </p>
            <button className="btn-success-modal" onClick={() => setSuccessModal(false)}>
                HOÀN TẤT
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="pd-sidebar-container">
        <PatientSidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="pd-main-content">
        <header className="pd-header">
           <h2 className="header-title">LỊCH KHÁM</h2> 
           <UserDropdown />
        </header>

        <div className="pd-body-scroll">
          <h3 className="section-heading">ĐẶT LỊCH KHÁM MỚI</h3>

          <div className="booking-container">
            <div className="booking-form">
                <div className="form-stack">
                    <div className="form-group" ref={calendarRef}>
                        <label>Ngày <span className="req">(*)</span></label>
                        <div className="input-box" onClick={() => setShowCalendar(!showCalendar)} style={{cursor: 'pointer'}}>
                             <input 
                                type="text" 
                                placeholder="dd/mm/yyyy"
                                value={formData.date ? formData.date.split("-").reverse().join("/") : ""}
                                className="inp-dark" 
                                readOnly 
                             />
                             <FaRegCalendarAlt className="icon-arrow" />
                             {showCalendar && (
                                <CustomCalendar 
                                    selectedDate={formData.date}
                                    onChange={handleDateChange}
                                    onClose={() => setShowCalendar(false)}
                                />
                             )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Khoa <span className="req">(*)</span></label>
                        <div className="input-box">
                             <select name="specialty" value={formData.specialty} className="inp-dark" onChange={handleInputChange}>
                                <option value="">Chọn khoa</option>
                                {specialties.map((s, i) => <option key={i} value={s}>{s}</option>)}
                             </select>
                             <FaChevronDown className="icon-arrow"/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Bác sĩ <span className="req">(*)</span></label>
                        <div className="input-box">
                             <select name="doctor" value={formData.doctor} className="inp-dark" onChange={handleInputChange}>
                                <option value="">Chọn bác sĩ</option>
                                <option value="Bác sĩ Nguyễn Văn A">Bác sĩ Nguyễn Văn A</option>
                                <option value="Bác sĩ Nguyễn Văn B">Bác sĩ Nguyễn Văn B</option>
                             </select>
                             <FaChevronDown className="icon-arrow"/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Khung giờ <span className="req">(*)</span></label>
                        <div className="input-box">
                             <select name="timeSlot" value={formData.timeSlot} className="inp-dark" onChange={handleInputChange}>
                                <option value="">Chọn khung giờ</option>
                                {timeSlots.map((t, i) => <option key={i} value={t}>{t}</option>)}
                             </select>
                             <FaChevronDown className="icon-arrow"/>
                        </div>
                    </div>

                    <div className="form-group desc-group">
                        <label>Mô tả:</label>
                        <textarea name="desc" value={formData.desc} className="txt-dark" onChange={handleInputChange}></textarea>
                    </div>
                </div>
                <button className="btn-book" onClick={handleBooking}>ĐẶT LỊCH</button>
            </div>

            <div className="working-hours">
                <h3 className="wh-head">Giờ hoạt động</h3>
                <div className="wh-table">
                   <div className="wh-row"><span>Thứ 2</span><span className="dash">—</span><span>09:00 AM - 07:00 PM</span></div>
                   <div className="wh-row"><span>Thứ 3</span><span className="dash">—</span><span>09:00 AM - 07:00 PM</span></div>
                   <div className="wh-row"><span>Thứ 4</span><span className="dash">—</span><span>09:00 AM - 07:00 PM</span></div>
                   <div className="wh-row"><span>Thứ 5</span><span className="dash">—</span><span>09:00 AM - 07:00 PM</span></div>
                   <div className="wh-row"><span>Thứ 6</span><span className="dash">—</span><span>09:00 AM - 07:00 PM</span></div>
                   <div className="wh-row"><span>Thứ 7</span><span className="dash">—</span><span>09:00 AM - 07:00 PM</span></div>
                   <div className="wh-row"><span>Chủ Nhật</span><span className="dash">—</span><span>Không làm việc</span></div>
                </div>
            </div>
          </div>

          <div className="history-list">
             {appointments.map((appt) => (
                 <div key={appt.id} className="card-item">
                     <div className="card-header-row">
                         <div className="doc-info">
                             <h4 className="name">{appt.doctorName}</h4>
                             <span className="spec">{appt.specialty}</span>
                         </div>
                         <div className="actions">
                             {renderStatus(appt.status, appt.id)}
                         </div>
                     </div>
                     <div className="card-body-grid">
                         <div className="c-item"><FaRegCalendarAlt className="c-icon" /><span>{appt.date}</span></div>
                         <div className="c-item"><FaMapMarkerAlt className="c-icon" /><span>{appt.location}</span></div>
                         <div className="c-item"><FaRegClock className="c-icon" /><span>{appt.time}</span></div>
                         <div className="c-item"><FaUserMd className="c-icon" /><span>Mô tả: {appt.desc}</span></div>
                     </div>
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;