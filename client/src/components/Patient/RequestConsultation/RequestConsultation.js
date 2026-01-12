import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaComments, 
  FaExclamationCircle, 
  FaStethoscope, 
  FaCheckCircle,
  FaPlus,
  FaUserMd,
  FaPaperPlane,
  FaPencilAlt,
  FaTimes,
  FaTrash // [MỚI] Import icon thùng rác
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; 
import "./RequestConsultation.css";

const RequestConsultation = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // --- STATE ---
  const [viewMode, setViewMode] = useState("loading");
  const [userInfo, setUserInfo] = useState(null);
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

  const [errorModal, setErrorModal] = useState({ show: false, title: "", message: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- INITIAL LOAD ---
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

        const response = await fetch(`http://localhost:5000/api/patient/${user.PatientID}/latest-consultation-full`);
        const data = await response.json();

        if (data && data.requestInfo) {
          setRequestInfo(data.requestInfo);
          setMessages(data.messages || []); 
          setViewMode("chat"); 
        } else {
          setViewMode("form");
        }

        const savedDraft = localStorage.getItem("consultation_draft");
        if (savedDraft && (!data || !data.requestInfo)) {
           setFormData(JSON.parse(savedDraft));
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setViewMode("form");
      }
    };
    fetchInitialData();
  }, [navigate]);

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

  const handleCreateNewRequest = () => {
    setFormData({ department: "", urgency: "Thấp", symptoms: "" });
    setViewMode("form");
  };

  // --- LOGIC GỬI / SỬA TIN NHẮN ---
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !requestInfo) return;

    try {
        if (editingMessageId) {
            // PUT: Cập nhật
            const response = await fetch(`http://localhost:5000/api/patient/consultation/message/${editingMessageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderID: userInfo.PatientID,
                    content: newMessage
                })
            });

            if (response.ok) {
                setMessages(prev => prev.map(msg => 
                    msg.MessageID === editingMessageId 
                    ? { ...msg, Content: newMessage, UpdatedAt: new Date().toISOString() } 
                    : msg
                ));
                setEditingMessageId(null);
                setNewMessage("");
            } else {
                alert("Lỗi: Không thể cập nhật tin nhắn.");
            }
        } else {
            // POST: Gửi mới
            const response = await fetch(`http://localhost:5000/api/patient/consultation/${requestInfo.RequestID}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderID: userInfo.PatientID,
                    senderType: 'Patient',
                    content: newMessage
                })
            });

            const data = await response.json();

            if (response.ok) {
                const newMsgObj = {
                    MessageID: data.messageId, 
                    SenderType: 'Patient',
                    Content: newMessage,
                    SentAt: new Date().toISOString()
                };
                setMessages(prev => [...prev, newMsgObj]);
                setNewMessage("");
            }
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
  };

  // [MỚI] LOGIC XÓA TIN NHẮN
  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin nhắn này không?")) return;

    try {
        const response = await fetch(`http://localhost:5000/api/patient/consultation/message/${msgId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderID: userInfo.PatientID // Gửi ID để backend check quyền
            })
        });

        if (response.ok) {
            // Xóa tin nhắn khỏi state UI
            setMessages(prev => prev.filter(msg => msg.MessageID !== msgId));
            
            // Nếu đang sửa tin nhắn này thì hủy chế độ sửa
            if (editingMessageId === msgId) {
                setEditingMessageId(null);
                setNewMessage("");
            }
        } else {
            alert("Không thể xóa tin nhắn này.");
        }
    } catch (error) {
        console.error("Lỗi xóa tin nhắn:", error);
    }
  };

  const handleSubmitNewRequest = async () => {
    if (!formData.department || !formData.urgency || !formData.symptoms) {
      setErrorModal({ show: true, title: "LỖI", message: "Vui lòng điền đủ thông tin (*)" });
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
      setErrorModal({ show: true, title: "LỖI", message: "Gửi thất bại. Dữ liệu đã lưu nháp." });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (msg) => {
    setEditingMessageId(msg.MessageID);
    setNewMessage(msg.Content);
  };

  const formatDate = (date) => date ? new Date(date).toLocaleString('vi-VN') : "";

  // --- RENDER ---
  return (
    <div className="pd-layout">
      {/* Modals */}
      {errorModal.show && (
        <div className="modal-overlay">
          <div className="error-modal">
            <h3>{errorModal.title}</h3>
            <p>{errorModal.message}</p>
            <button onClick={() => setErrorModal({ ...errorModal, show: false })}>ĐÓNG</button>
          </div>
        </div>
      )}
      
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <FaCheckCircle className="success-icon-large" />
            <h3>THÀNH CÔNG!</h3>
            <button onClick={() => window.location.reload()}>VÀO PHÒNG CHAT</button>
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
          {viewMode === "loading" && <div className="pd-loading">Đang tải...</div>}

          {/* CHẾ ĐỘ CHAT */}
          {viewMode === "chat" && requestInfo && (
            <div className="chat-container">
                <div className="chat-header">
                    <div>
                        <h3>{requestInfo.DoctorName ? `BS. ${requestInfo.DoctorName}` : "Đang chờ bác sĩ..."} - {requestInfo.Specialty}</h3>
                        <div className="request-id">Trạng thái: {requestInfo.Status} | Mức độ: {requestInfo.Priority}</div>
                    </div>
                    <button className="btn-new-request" onClick={handleCreateNewRequest}><FaPlus /> Yêu cầu mới</button>
                </div>

                <div className="chat-body">
                    {messages.map((msg, index) => {
                        const isPatient = msg.SenderType === 'Patient';
                        
                        // Logic: Cho phép sửa/xóa nếu là Patient VÀ Bác sĩ chưa trả lời ngay sau đó
                        let canModify = isPatient && requestInfo.Status !== 'Completed';
                        if (canModify && index < messages.length - 1) {
                            if (messages[index + 1].SenderType === 'Doctor') canModify = false;
                        }

                        return (
                            <div key={index} className={`message-box ${!isPatient ? 'doctor-reply' : 'patient-msg'}`}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                                    <span className="msg-role">{isPatient ? <FaUserMd /> : <FaStethoscope />} {isPatient ? "Bạn" : "Bác sĩ"}</span>
                                    
                                    {/* NHÓM NÚT SỬA/XÓA */}
                                    {canModify && (
                                        <div className="msg-actions">
                                            <button 
                                                className="btn-icon-action btn-edit-msg" 
                                                onClick={() => startEdit(msg)} 
                                                title="Sửa"
                                            >
                                                <FaPencilAlt size={12}/>
                                            </button>
                                            <button 
                                                className="btn-icon-action btn-delete-msg" 
                                                onClick={() => handleDeleteMessage(msg.MessageID)} 
                                                title="Xóa"
                                            >
                                                <FaTrash size={12}/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="msg-content">
                                    {msg.Content}
                                    {msg.UpdatedAt && <small style={{fontStyle:'italic', color:'#888', marginLeft:5}}>(đã sửa)</small>}
                                </div>
                                <span className="msg-time">{formatDate(msg.SentAt)}</span>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                <div className="chat-footer">
                    {editingMessageId && (
                        <div className="editing-indicator">
                            <span><FaPencilAlt /> Đang chỉnh sửa...</span>
                            <span onClick={() => {setEditingMessageId(null); setNewMessage("");}} style={{cursor:'pointer'}}><FaTimes /> Hủy</span>
                        </div>
                    )}
                    <div className="input-group">
                        <textarea 
                            className="chat-input" 
                            placeholder="Nhập nội dung..." 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button className="btn-send" onClick={handleSendMessage} style={{backgroundColor: editingMessageId ? '#e67e22' : '#0089d0'}}>
                            {editingMessageId ? "Cập nhật" : <><FaPaperPlane /> Gửi</>}
                        </button>
                    </div>
                </div>
            </div>
          )}

          {/* CHẾ ĐỘ FORM */}
          {viewMode === "form" && (
             <div className="form-card">
                {/* ... (Giữ nguyên phần form) ... */}
                <div className="form-section-header">
                    <FaComments className="section-icon" />
                    <h3>Gửi yêu cầu tư vấn mới</h3>
                    {requestInfo && <button className="btn-secondary" style={{marginLeft:'auto'}} onClick={() => setViewMode("chat")}>Quay lại Chat</button>}
                </div>
                {/* ... Các ô input ... */}
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
                    <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} className="form-control textarea-field" placeholder="Mô tả chi tiết..."/>
                </div>
                <button className="btn-primary" onClick={handleSubmitNewRequest} disabled={loading}>{loading ? "Đang gửi..." : "Bắt đầu tư vấn"}</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestConsultation;