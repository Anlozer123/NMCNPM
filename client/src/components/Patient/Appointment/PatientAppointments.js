import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaMapMarkerAlt,
  FaUserMd,
  FaRegCalendarAlt,
  FaRegClock,
  FaCheckCircle,
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; 
import CustomCalendar from "../../Common/CustomCalendar/CustomCalendar"; 
import "./PatientAppointments.css";

const PatientAppointments = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Guest", PatientID: 1 };

  // --- STATE ---
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null });
  const [successModal, setSuccessModal] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ 
      date: "", 
      specialty: "", 
      doctorID: "", 
      timeSlot: "", 
      desc: "" 
  });

  const specialties = ["Nội khoa", "Tim mạch", "Thần kinh", "Chấn thương chỉnh hình", "Da liễu"]; 
  const timeSlots = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"]; 
  const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]; // Danh sách thứ để hiển thị

  // --- FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        const docRes = await fetch('http://localhost:5000/api/patient/doctors-list');
        const docData = await docRes.json();
        setDoctors(docData);

        if (user.PatientID) {
            const apptRes = await fetch(`http://localhost:5000/api/patient/${user.PatientID}/appointments`);
            const apptData = await apptRes.json();
            
            const mappedAppts = apptData.map(item => ({
                id: item.AppointmentID,
                doctorName: item.DoctorName,
                specialty: item.Specialization || "Tổng quát",
                date: new Date(item.AppointmentDate).toLocaleDateString('vi-VN'), 
                time: new Date(item.AppointmentDate).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
                location: "Phòng khám đa khoa",
                desc: item.Reason,
                status: item.Status ? item.Status.toLowerCase() : 'pending'
            }));
            setAppointments(mappedAppts);
        }
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    } finally {
        setLoading(false);
    }
  };

  // --- HANDLERS ---
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

  const handleBooking = async () => {
    if (!formData.date || !formData.doctorID || !formData.timeSlot) {
      setErrorModal({ show: true, message: "Vui lòng điền đầy đủ: Ngày, Bác sĩ, Giờ khám (*)" });
      return;
    }
    const appointmentDateTime = `${formData.date} ${formData.timeSlot}:00`;
    const payload = {
        DoctorID: formData.doctorID,
        AppointmentDate: appointmentDateTime,
        Reason: formData.desc
    };

    try {
        const response = await fetch(`http://localhost:5000/api/patient/${user.PatientID}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setSuccessModal(true);
            setFormData({ date: "", specialty: "", doctorID: "", timeSlot: "", desc: "" });
            fetchData(); 
        } else {
            const err = await response.json();
            setErrorModal({ show: true, message: err.message || "Đặt lịch thất bại" });
        }
    } catch (error) {
        setErrorModal({ show: true, message: "Lỗi kết nối server" });
    }
  };

// --- 3. XỬ LÝ HỦY LỊCH (Đã sửa để xóa ngay khỏi giao diện) ---
  const confirmCancel = async () => {
    if (confirmModal.id) {
      try {
          const response = await fetch(`http://localhost:5000/api/patient/appointments/${confirmModal.id}/cancel`, {
              method: 'PUT'
          });
          
          if (response.ok) {
              // [QUAN TRỌNG] Thay đổi từ .map sang .filter
              // .filter sẽ giữ lại những lịch CÓ ID KHÁC với lịch vừa hủy
              // => Lịch vừa hủy sẽ biến mất ngay lập tức khỏi state
              setAppointments(prev => prev.filter(a => a.id !== confirmModal.id));
              
              closeConfirmModal();
          } else {
              setErrorModal({ show: true, message: "Không thể hủy lịch lúc này" });
          }
      } catch (error) {
          setErrorModal({ show: true, message: "Lỗi kết nối khi hủy lịch" });
      }
    }
  };

  const openConfirmModal = (id) => setConfirmModal({ show: true, id: id });
  const closeConfirmModal = () => setConfirmModal({ show: false, id: null });

  const renderStatus = (status, id) => {
    const s = status ? status.toLowerCase() : "";
    switch(s) {
        case "pending": return (
            <div className="status-group">
                <button className="btn-cancel" onClick={() => openConfirmModal(id)}>Huỷ lịch hẹn</button>
                <span className="badge-pending">Đang chờ duyệt</span>
            </div>
        );
        case "confirmed": return <span className="badge-confirmed">Đã xác nhận</span>;
        case "completed": return <span className="badge-completed">Đã hoàn thành</span>;
        case "cancelled": return <span className="badge-cancelled" style={{color:'red'}}>Đã hủy</span>;
        default: return <span className="badge-pending">Pending</span>;
    }
  };

  return (
    <div className="pd-layout">
      {/* Modals */}
      {errorModal.show && (
        <div className="modal-overlay">
          <div className="error-modal">
            <h3 className="error-title">THÔNG BÁO LỖI</h3>
            <p className="error-message">{errorModal.message}</p>
            <button className="btn-retry" onClick={() => setErrorModal({ show: false, message: "" })}>THỬ LẠI</button>
          </div>
        </div>
      )}
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
      {successModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <FaCheckCircle className="success-icon-large" />
            <h3 className="success-title">ĐẶT LỊCH THÀNH CÔNG!</h3>
            <p className="success-message">Vui lòng theo dõi trạng thái bên dưới.</p>
            <button className="btn-success-modal" onClick={() => setSuccessModal(false)}>HOÀN TẤT</button>
          </div>
        </div>
      )}

      <div className="pd-sidebar-container"><PatientSidebar /></div>

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
                    {/* INPUTS */}
                    <div className="form-group" ref={calendarRef}>
                        <label>Ngày <span className="req">(*)</span></label>
                        <div className="input-box" onClick={() => setShowCalendar(!showCalendar)} style={{cursor: 'pointer'}}>
                             <input type="text" value={formData.date ? formData.date.split("-").reverse().join("/") : ""} className="inp-dark" readOnly placeholder="dd/mm/yyyy" />
                             <FaRegCalendarAlt className="icon-arrow" />
                             {showCalendar && <CustomCalendar selectedDate={formData.date} onChange={handleDateChange} onClose={() => setShowCalendar(false)} />}
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
                             <select name="doctorID" value={formData.doctorID} className="inp-dark" onChange={handleInputChange}>
                                <option value="">Chọn bác sĩ</option>
                                {doctors.filter(d => !formData.specialty || d.Specialization === formData.specialty).map((doc) => (
                                    <option key={doc.StaffID} value={doc.StaffID}>{doc.FullName}</option>
                                ))}
                             </select>
                             <FaChevronDown className="icon-arrow"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Khung giờ <span className="req">(*)</span></label>
                        <div className="input-box">
                             <select name="timeSlot" value={formData.timeSlot} className="inp-dark" onChange={handleInputChange}>
                                <option value="">Chọn giờ</option>
                                {timeSlots.map((t, i) => <option key={i} value={t}>{t}</option>)}
                             </select>
                             <FaChevronDown className="icon-arrow"/>
                        </div>
                    </div>
                    <div className="form-group desc-group">
                        <label>Mô tả / Lý do khám:</label>
                        <textarea name="desc" value={formData.desc} className="txt-dark" onChange={handleInputChange} placeholder="Nhập triệu chứng..."></textarea>
                    </div>
                </div>
                <button className="btn-book" onClick={handleBooking}>ĐẶT LỊCH</button>
            </div>

            {/* --- CẬP NHẬT PHẦN GIỜ HOẠT ĐỘNG --- */}
            <div className="working-hours">
                <h3 className="wh-head">Giờ hoạt động</h3>
                <div className="wh-table">
                   {/* Map qua danh sách thứ để hiển thị từng dòng */}
                   {weekDays.map((day) => (
                       <div className="wh-row" key={day}>
                           <span className="wh-day">{day}</span>
                           <span className="dash">—</span>
                           <span className="wh-time">07:00 AM - 05:00 PM</span>
                       </div>
                   ))}
                   {/* Chủ nhật */}
                   <div className="wh-row">
                       <span className="wh-day">Chủ Nhật</span>
                       <span className="dash">—</span>
                       <span className="wh-time">Nghỉ</span>
                   </div>
                </div>
            </div>
          </div>

          <h3 className="section-heading" style={{marginTop: '30px'}}>LỊCH SỬ KHÁM BỆNH</h3>
          <div className="history-list">
             {loading ? <p style={{color: '#fff', textAlign: 'center'}}>Đang tải...</p> : 
                appointments.map((appt) => (
                 <div key={appt.id} className="card-item">
                     <div className="card-header-row">
                         <div className="doc-info">
                             <h4 className="name">{appt.doctorName}</h4>
                             <span className="spec">{appt.specialty}</span>
                         </div>
                         <div className="actions">{renderStatus(appt.status, appt.id)}</div>
                     </div>
                     <div className="card-body-grid">
                         <div className="c-item"><FaRegCalendarAlt className="c-icon" /><span>{appt.date}</span></div>
                         <div className="c-item"><FaMapMarkerAlt className="c-icon" /><span>{appt.location}</span></div>
                         <div className="c-item"><FaRegClock className="c-icon" /><span>{appt.time}</span></div>
                         <div className="c-item"><FaUserMd className="c-icon" /><span>Lý do: {appt.desc}</span></div>
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