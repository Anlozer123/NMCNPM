import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaComments, FaExclamationCircle, FaStethoscope, FaCheckCircle,
  FaUserMd, FaPaperPlane, FaPencilAlt, FaTimes, FaTrash,
  FaListUl
} from "react-icons/fa";

// Import các component con
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; 
import NurseRequest from "./NurseRequest"; 

import "./RequestConsultation.css";

const RequestConsultation = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // --- STATE QUẢN LÝ TAB ---
  const [activeTab, setActiveTab] = useState('CONSULTATION'); // 'CONSULTATION' hoặc 'NURSE_REQUEST'

  // --- STATE QUẢN LÝ USER & LOGIC CHAT ---
  const [userInfo, setUserInfo] = useState(null);
  const [historyList, setHistoryList] = useState([]); 
  const [selectedRequestId, setSelectedRequestId] = useState(null); // null = Mode tạo mới
  
  const [viewMode, setViewMode] = useState("loading"); // 'loading', 'form', 'chat'
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    department: "",
    urgency: "Thấp",
    symptoms: ""
  });

  const [requestInfo, setRequestInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);

  // Modals
  const [errorModal, setErrorModal] = useState({ show: false, title: "", message: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, messageId: null });

  // --- 1. INITIAL LOAD ---
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

        // Lấy danh sách lịch sử
        const response = await fetch(`http://localhost:5000/api/patient/${user.PatientID}/consultation-history`);
        const historyData = await response.json();
        setHistoryList(historyData || []);

        if (historyData && historyData.length > 0) {
            handleSelectRequest(historyData[0].RequestID);
        } else {
            setViewMode("form");
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setViewMode("form");
      }
    };
    fetchInitialData();
  }, [navigate]);

  // --- 2. LOGIC CHỌN REQUEST ---
  const handleSelectRequest = async (requestId) => {
      setSelectedRequestId(requestId);
      setViewMode("loading");
      try {
          const response = await fetch(`http://localhost:5000/api/patient/consultation/${requestId}/detail`);
          const data = await response.json();

          if (data && data.requestInfo) {
              setRequestInfo(data.requestInfo);
              setMessages(data.messages || []);
              setViewMode("chat");
              setFormData({ department: "", urgency: "Thấp", symptoms: "" });
              setNewMessage("");
              setEditingMessageId(null);
          }
      } catch (error) {
          console.error("Lỗi tải chi tiết:", error);
          setViewMode("chat");
      }
  };

  const handleCreateNewRequest = () => {
    setSelectedRequestId(null);
    setRequestInfo(null);
    setMessages([]);
    setFormData({ department: "", urgency: "Thấp", symptoms: "" });
    setViewMode("form");
    const savedDraft = localStorage.getItem("consultation_draft");
    if (savedDraft) setFormData(JSON.parse(savedDraft));
  };

  // Auto scroll
  useEffect(() => {
    if (viewMode === 'chat') {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, viewMode]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !requestInfo) return;
    try {
        if (editingMessageId) {
            const response = await fetch(`http://localhost:5000/api/patient/consultation/message/${editingMessageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderID: userInfo.PatientID, content: newMessage })
            });
            if (response.ok) {
                setMessages(prev => prev.map(msg => msg.MessageID === editingMessageId ? { ...msg, Content: newMessage, UpdatedAt: new Date().toISOString() } : msg));
                setEditingMessageId(null); setNewMessage("");
            }
        } else {
            const response = await fetch(`http://localhost:5000/api/patient/consultation/${requestInfo.RequestID}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderID: userInfo.PatientID, senderType: 'Patient', content: newMessage })
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, { MessageID: data.messageId, SenderType: 'Patient', Content: newMessage, SentAt: new Date().toISOString() }]);
                setNewMessage("");
            }
        }
    } catch (error) { console.error(error); }
  };

  // --- DELETE LOGIC ---
  const promptDeleteMessage = (msgId) => setDeleteModal({ show: true, messageId: msgId });
  const confirmDeleteMessage = async () => {
    const msgId = deleteModal.messageId;
    if (!msgId) return;
    try {
        const response = await fetch(`http://localhost:5000/api/patient/consultation/message/${msgId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senderID: userInfo.PatientID })
        });
        if (response.ok) {
            setMessages(prev => prev.filter(msg => msg.MessageID !== msgId));
            if (editingMessageId === msgId) { setEditingMessageId(null); setNewMessage(""); }
            setDeleteModal({ show: false, messageId: null });
        }
    } catch (e) { console.error(e); }
  };

  const handleSubmitNewRequest = async () => {
    if (!formData.department || !formData.urgency || !formData.symptoms) {
      setErrorModal({ show: true, title: "THIẾU THÔNG TIN", message: "Vui lòng điền đủ thông tin." });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/patient/${userInfo.PatientID}/request-consultation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Lỗi server");
      
      localStorage.removeItem("consultation_draft");
      
      // Refresh list và chuyển chat
      const historyRes = await fetch(`http://localhost:5000/api/patient/${userInfo.PatientID}/consultation-history`);
      const historyData = await historyRes.json();
      setHistoryList(historyData);
      handleSelectRequest(data.requestId);

    } catch (error) {
      localStorage.setItem("consultation_draft", JSON.stringify(formData));
      setErrorModal({ show: true, title: "LỖI", message: "Gửi thất bại. Đã lưu nháp." });
    } finally { setLoading(false); }
  };

  const startEdit = (msg) => { setEditingMessageId(msg.MessageID); setNewMessage(msg.Content); };
  const formatDate = (date) => date ? new Date(date).toLocaleString('vi-VN') : "";

  // --- RENDER CHÍNH ---
  return (
    <div className="pd-layout consultation-page-container">
      
      {/* --- MODAL LỖI (STYLE APPOINTMENT) --- */}
      {errorModal.show && (
        <div className="modal-overlay">
          <div className="error-modal">
            {/* Đã bỏ icon FaTimesCircle */}
            <h3 className="error-title">{errorModal.title || "THÔNG BÁO LỖI"}</h3>
            <p className="error-message">{errorModal.message}</p>
            <button 
              className="btn-retry" 
              onClick={() => setErrorModal({ ...errorModal, show: false })}
            >
              THỬ LẠI
            </button>
          </div>
        </div>
      )}
      
      {/* --- MODAL SUCCESS --- */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <FaCheckCircle className="success-icon-large" />
            <h3>THÀNH CÔNG!</h3>
            <p className="success-message">Yêu cầu đã gửi thành công.</p>
            <button className="btn-success-modal" onClick={() => setShowSuccessModal(false)}>ĐỒNG Ý</button>
          </div>
        </div>
      )}

      {/* --- MODAL DELETE CONFIRM --- */}
      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <FaExclamationCircle className="warning-icon-large" />
            <h3>XÁC NHẬN XÓA</h3>
            <p className="confirm-message">Bạn có chắc chắn muốn xóa tin nhắn này không?<br/>Hành động này không thể hoàn tác.</p>
            <div className="modal-actions">
                <button className="btn-cancel-modal" onClick={() => setDeleteModal({ show: false, messageId: null })}>HỦY BỎ</button>
                <button className="btn-confirm-delete-modal" onClick={confirmDeleteMessage}>XÓA</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN LAYOUT --- */}
      <div className="pd-sidebar-container"><PatientSidebar /></div>

      <div className="pd-main-content">
        <header className="pd-header">
          <h2 className="header-title">TƯ VẤN VÀ YÊU CẦU</h2>
          <UserDropdown />
        </header>

        <div className="pd-body-scroll">
            
            {/* *** NAVIGATION TABS *** */}
            <div className="rc-tab-navigation">
                <button 
                    className={`rc-tab-btn ${activeTab === 'CONSULTATION' ? 'active' : ''}`}
                    onClick={() => setActiveTab('CONSULTATION')}
                >
                    TƯ VẤN
                </button>
                <button 
                    className={`rc-tab-btn ${activeTab === 'NURSE_REQUEST' ? 'active' : ''}`}
                    onClick={() => setActiveTab('NURSE_REQUEST')}
                >
                    YÊU CẦU
                </button>
            </div>

            {/* *** CONTENT AREA *** */}
            <div className="rc-tab-content-area">
                
                {/* === TAB 1: TƯ VẤN BÁC SĨ === */}
                {activeTab === 'CONSULTATION' && (
                    <div className="consultation-wrapper">
                        {/* LEFT: HISTORY */}
                        <div className="history-sidebar">
                            <div className="history-header">
                                <span><FaListUl /> Lịch sử tư vấn</span>
                            </div>
                            <div className="history-list">
                                <div className={`history-item ${selectedRequestId === null ? 'active' : ''}`} onClick={handleCreateNewRequest} style={{borderStyle: 'dashed', textAlign:'center', color: '#0089d0', justifyContent:'center'}}>
                                    <b>+ Tạo yêu cầu mới</b>
                                </div>
                                {historyList.map(item => (
                                    <div key={item.RequestID} className={`history-item ${selectedRequestId === item.RequestID ? 'active' : ''}`} onClick={() => handleSelectRequest(item.RequestID)}>
                                        <h4>{item.Specialty} <span className={`status-badge status-${item.Status}`}>{item.Status}</span></h4>
                                        <p><FaUserMd /> {item.DoctorName || "Đang chờ..."}</p>
                                        <div className="history-date">{formatDate(item.CreatedDate)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: MAIN */}
                        <div className="main-chat-area">
                            {viewMode === "loading" && <div className="pd-loading">Đang tải...</div>}

                            {viewMode === "chat" && requestInfo && (
                                <div className="chat-container">
                                    <div className="chat-header">
                                        <div>
                                            <h3>{requestInfo.DoctorName ? `BS. ${requestInfo.DoctorName}` : "Đang chờ bác sĩ..."} - {requestInfo.Specialty}</h3>
                                            <div className="request-id">Mã: #{requestInfo.RequestID} | Mức độ: {requestInfo.Priority}</div>
                                        </div>
                                    </div>

                                    <div className="chat-body">
                                        {messages.length === 0 && <div style={{textAlign: 'center', color: '#999', marginTop: 50}}><FaStethoscope size={40}/><p>Chưa có tin nhắn nào.</p></div>}
                                        {messages.map((msg, index) => {
                                            const isPatient = msg.SenderType === 'Patient';
                                            return (
                                                <div key={index} className={`message-box ${!isPatient ? 'doctor-reply' : 'patient-msg'}`}>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 5}}>
                                                        <span className="msg-role">{isPatient ? "Bạn" : "Bác sĩ"}</span>
                                                        {isPatient && (
                                                            <div className="msg-actions">
                                                                <FaPencilAlt onClick={() => startEdit(msg)} title="Sửa"/>
                                                                <FaTrash onClick={() => promptDeleteMessage(msg.MessageID)} title="Xóa"/>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="msg-content">{msg.Content}</div>
                                                    <span className="msg-time">{formatDate(msg.SentAt)}</span>
                                                </div>
                                            );
                                        })}
                                        <div ref={chatEndRef} />
                                    </div>

                                    <div className="chat-footer">
                                        {editingMessageId && <div className="editing-indicator"><span>Đang sửa...</span><span onClick={()=>{setEditingMessageId(null); setNewMessage("")}}><FaTimes/> Hủy</span></div>}
                                        <div className="input-group">
                                            <textarea className="chat-input" placeholder="Nhập tin nhắn..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                                            <button className="btn-send" onClick={handleSendMessage}>{editingMessageId ? "Cập nhật" : <><FaPaperPlane /> Gửi</>}</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {viewMode === "form" && (
                                <div className="form-card">
                                    <div className="form-section-header">
                                        <FaComments className="section-icon" />
                                        <h3>Gửi yêu cầu tư vấn mới</h3>
                                    </div>
                                    <div className="form-group">
                                        <label>Chuyên khoa (*)</label>
                                        <select name="department" value={formData.department} onChange={handleChange} className="form-control">
                                            <option value="">Chọn chuyên khoa</option>
                                            <option value="Nội khoa">Nội khoa</option>
                                            <option value="Nhi khoa">Nhi khoa</option>
                                            <option value="Tim mạch">Tim mạch</option>
                                            <option value="Da liễu">Da liễu</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Mức độ (*)</label>
                                        <select name="urgency" value={formData.urgency} onChange={handleChange} className="form-control">
                                            <option value="Thấp">Thấp</option>
                                            <option value="Trung bình">Trung bình</option>
                                            <option value="Khẩn cấp">Khẩn cấp</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Triệu chứng (*)</label>
                                        <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} className="form-control textarea-field" placeholder="Mô tả..."/>
                                    </div>
                                    <button className="btn-primary" onClick={handleSubmitNewRequest} disabled={loading}>{loading ? "Đang gửi..." : "Bắt đầu tư vấn"}</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* === TAB 2: YÊU CẦU ĐIỀU DƯỠNG === */}
                {activeTab === 'NURSE_REQUEST' && (
                    <div className="nurse-request-tab-container">
                        <NurseRequest />
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default RequestConsultation;