import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaComments, 
  FaExclamationCircle, 
  FaStethoscope, 
  FaCheckCircle,
  FaPlus,
  FaUserMd
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; 
import "./RequestConsultation.css";

const RequestConsultation = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [viewMode, setViewMode] = useState("loading"); // 'loading', 'form', 'chat'
  
  // State Form
  const [formData, setFormData] = useState({
    department: "",
    urgency: "Thấp",
    symptoms: ""
  });

  // State dữ liệu tin nhắn (Chat)
  const [consultationData, setConsultationData] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // Để lấy tên hiển thị

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, title: "", message: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 1. Lấy thông tin User & Load dữ liệu tư vấn cũ
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          navigate("/login");
          return;
        }
        const user = JSON.parse(storedUser);
        setUserInfo(user);

        // Gọi API lấy tư vấn gần nhất
        const response = await fetch(`http://localhost:5000/api/patient/${user.PatientID}/latest-consultation`);
        const data = await response.json();

        if (data) {
          setConsultationData(data);
          setViewMode("chat"); // Nếu có dữ liệu cũ -> Hiện Chat
        } else {
          setViewMode("form"); // Chưa có -> Hiện Form
        }

        // Load draft nếu đang ở mode form
        const savedDraft = localStorage.getItem("consultation_draft");
        if (savedDraft && !data) {
           setFormData(JSON.parse(savedDraft));
        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setViewMode("form"); // Fallback về form nếu lỗi
      }
    };

    fetchInitialData();
  }, [navigate]);

  // --- LOGIC FORM ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    // Sau khi thành công, reload lại để vào chế độ Chat
    window.location.reload(); 
  };

  const handleSubmit = async () => {
    if (!formData.department || !formData.urgency || !formData.symptoms) {
      setErrorModal({
        show: true,
        title: "THÔNG BÁO LỖI",
        message: "Vui lòng điền đầy đủ các thông tin bắt buộc (*)"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/patient/${userInfo.PatientID}/request-consultation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Lỗi server");

      localStorage.removeItem("consultation_draft");
      setShowSuccessModal(true); 

    } catch (error) {
      localStorage.setItem("consultation_draft", JSON.stringify(formData));
      setErrorModal({
        show: true,
        title: "LỖI HỆ THỐNG",
        message: "Không thể gửi yêu cầu lúc này. Dữ liệu đã lưu nháp."
      });
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC CHUYỂN ĐỔI ---
  const handleCreateNewRequest = () => {
    // Reset form và chuyển sang mode nhập liệu
    setFormData({ department: "", urgency: "Thấp", symptoms: "" });
    setViewMode("form");
  };

  const formatDate = (dateString) => {
      if(!dateString) return "";
      return new Date(dateString).toLocaleString('vi-VN');
  }

  // --- RENDER ---
  return (
    <div className="pd-layout">
      {/* Error Modal */}
      {errorModal.show && (
        <div className="modal-overlay">
          <div className="error-modal">
            <h3 className="error-title">{errorModal.title}</h3>
            <p className="error-message">{errorModal.message}</p>
            <button className="btn-retry" onClick={() => setErrorModal({ show: false, title: "", message: "" })}>ĐÓNG</button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <FaCheckCircle className="success-icon-large" />
            <h3 className="success-title">GỬI YÊU CẦU THÀNH CÔNG!</h3>
            <p className="success-message">Hệ thống đã ghi nhận yêu cầu tư vấn của bạn.</p>
            <button className="btn-success-modal" onClick={handleCloseSuccess}>XEM CHI TIẾT</button>
          </div>
        </div>
      )}

      <div className="pd-sidebar-container"><PatientSidebar /></div>

      <div className="pd-main-content">
        <header className="pd-header">
          <h2 className="header-title">TƯ VẤN TRỰC TUYẾN</h2>
          <UserDropdown />
        </header>

        <div className="pd-body-scroll">
          
          {/* --- VIEW MODE: LOADING --- */}
          {viewMode === "loading" && <div className="pd-loading">Đang tải dữ liệu...</div>}

          {/* --- VIEW MODE: CHAT BOX (Giống hình ảnh) --- */}
          {viewMode === "chat" && consultationData && (
            <div className="chat-container">
                {/* Header Chat */}
                <div className="chat-header">
                    <div>
                        <h3>{userInfo?.FullName} - {consultationData.Specialty}</h3>
                        <div className="request-id">ID Bệnh nhân: {userInfo?.PatientID} | Trạng thái: {consultationData.Status}</div>
                    </div>
                    {/* Nút tạo yêu cầu mới nằm góc phải */}
                    <button className="btn-new-request" onClick={handleCreateNewRequest}>
                        <FaPlus /> Yêu cầu mới
                    </button>
                </div>

                {/* Body Chat */}
                <div className="chat-body">
                    {/* Tin nhắn của Bệnh nhân (Symptoms) */}
                    <div className="message-box">
                        <span className="msg-role"><FaUserMd /> Bệnh nhân</span>
                        <span className="msg-title">TRIỆU CHỨNG:</span>
                        <span className="msg-content">{consultationData.Symptoms}</span>
                        <span className="msg-time">{formatDate(consultationData.CreatedDate)}</span>
                    </div>

                    {/* Tin nhắn phản hồi của Bác sĩ (Nếu có) */}
                    {consultationData.ResponseContent ? (
                        <div className="message-box doctor-reply">
                            <span className="msg-role" style={{color: '#0056b3'}}><FaStethoscope /> Bác sĩ tư vấn</span>
                            <span className="msg-content">{consultationData.ResponseContent}</span>
                            <span className="msg-time">{formatDate(consultationData.ResponseDate)}</span>
                        </div>
                    ) : (
                         <div style={{textAlign: 'center', color: '#999', marginTop: 20}}>
                            <i>Đang chờ bác sĩ phản hồi...</i>
                         </div>
                    )}
                </div>

                {/* Footer Input (Để hiển thị giống hình - chưa có chức năng chat realtime) */}
                <div className="chat-footer">
                    <textarea 
                        className="chat-input" 
                        placeholder="Nhập nội dung tư vấn bổ sung..." 
                        disabled={!consultationData.ResponseContent} // Chỉ cho chat tiếp khi bác sĩ đã rep (logic tùy chọn)
                    ></textarea>
                </div>
            </div>
          )}

          {/* --- VIEW MODE: FORM --- */}
          {viewMode === "form" && (
             <div className="form-card">
             <div className="form-section-header">
               <FaComments className="section-icon" />
               <h3>Gửi yêu cầu tư vấn mới</h3>
               {/* Nút quay lại chat nếu có dữ liệu cũ */}
               {consultationData && (
                   <button className="btn-secondary" style={{marginLeft: 'auto'}} onClick={() => setViewMode("chat")}>
                       Quay lại Chat
                   </button>
               )}
             </div>
             
             {/* ... (Các input form giữ nguyên như cũ) ... */}
             <div className="form-group">
               <label><FaStethoscope className="input-icon"/> <span>Chuyên khoa cần tư vấn (*)</span></label>
               <select name="department" value={formData.department} onChange={handleChange} className="form-control">
                 <option value="">Chọn chuyên khoa</option>
                 <option value="General">Đa khoa</option>
                 <option value="Cardiology">Tim mạch</option>
                 <option value="Dermatology">Da liễu</option>
                 <option value="Pediatrics">Nhi khoa</option>
               </select>
             </div>

             <div className="form-group">
               <label><FaExclamationCircle className="input-icon"/> <span>Mức độ khẩn cấp (*)</span></label>
               <select name="urgency" value={formData.urgency} onChange={handleChange} className="form-control">
                 <option value="Thấp">Thấp</option>
                 <option value="Trung bình">Trung bình</option>
                 <option value="Khẩn cấp">Khẩn cấp</option>
               </select>
             </div>

             <div className="form-group">
               <label>Mô tả triệu chứng (*)</label>
               <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} className="form-control textarea-field" placeholder="Mô tả chi tiết..."/>
             </div>

             <div className="form-actions">
               <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                 {loading ? "Đang gửi..." : "Gửi yêu cầu"}
               </button>
             </div>
           </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RequestConsultation;