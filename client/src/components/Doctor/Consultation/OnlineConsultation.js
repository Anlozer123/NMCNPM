import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { LuClock3, LuMessageSquare, LuSend } from "react-icons/lu";
import { FaUserCircle, FaUserMd } from "react-icons/fa";
import './OnlineConsultation.css';

// Loại bỏ mặc định "= 2" để tránh việc gán nhầm ID
const OnlineConsultation = ({ doctorId: propDoctorId }) => { 
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [messages, setMessages] = useState([]); 
    const [replyContent, setReplyContent] = useState('');
    const chatEndRef = useRef(null);

    // [SỬA QUAN TRỌNG] Lấy thông tin bác sĩ thực tế từ localStorage
    const user = useMemo(() => JSON.parse(sessionStorage.getItem('user')), []);
    const currentDoctorId = propDoctorId || user?.StaffID || user?.ID;

    // 1. Tải danh sách yêu cầu (Đã thêm tham số doctorId vào URL)
    const fetchRequests = useCallback(async () => {
        if (!currentDoctorId) return; // Nếu chưa có ID thì không gọi API
        
        try {
            // [SỬA] Gửi kèm doctorId qua query string để Backend lọc danh sách
            const res = await fetch(`http://localhost:5000/api/doctor/consultations?doctorId=${currentDoctorId}`);
            const data = await res.json();
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
            setRequests([]);
        }
    }, [currentDoctorId]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // 2. Hàm tải tin nhắn
    const fetchMessages = useCallback(async (requestId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/doctor/consultation/${requestId}/messages`);
            const data = await res.json();
            
            const safeData = Array.isArray(data) ? data : [];

            if (safeData.length === 0 && selectedRequest?.Symptoms) {
                 setMessages([{
                     MessageID: 'init',
                     SenderType: 'Patient',
                     Content: selectedRequest.Symptoms,
                     SentAt: selectedRequest.CreatedTime
                 }]);
            } else {
                setMessages(safeData);
            }
        } catch (error) {
            console.error("Lỗi tải tin nhắn:", error);
            setMessages([]);
        }
    }, [selectedRequest]);

    useEffect(() => {
        if (selectedRequest) {
            fetchMessages(selectedRequest.RequestID);
        } else {
            setMessages([]);
        }
    }, [selectedRequest, fetchMessages]);

    // Auto scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 3. Xử lý gửi tin nhắn
    const handleSendReply = async () => {
        if (!replyContent.trim() || !selectedRequest || !currentDoctorId) return;

        try {
            const res = await fetch(`http://localhost:5000/api/doctor/consultation/reply/${selectedRequest.RequestID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: currentDoctorId, // [SỬA] Sử dụng ID động thay vì số 2
                    responseContent: replyContent
                })
            });

            const data = await res.json();

            if (res.ok) {
                const newMsg = {
                    MessageID: data.messageId || Date.now(),
                    SenderType: 'Doctor',
                    Content: replyContent,
                    SentAt: new Date().toISOString()
                };
                setMessages(prev => [...prev, newMsg]);
                setReplyContent(''); 
                fetchRequests(); 
            } else {
                alert("❌ Lỗi: " + (data.msg || "Không thể gửi tin nhắn"));
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        }
    };

    const getPriorityClass = (priority) => {
        if (priority === 'Khẩn cấp') return 'tag-khan-cap';
        if (priority === 'Trung bình') return 'tag-trung-binh';
        return 'tag-thap';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleString('vi-VN', { 
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
            });
        } catch (e) { return dateString; }
    };

    return (
        <div className="oc-container">
            <div className="oc-header">
                <h1 className="oc-title">Tư vấn trực tuyến</h1>
                <p className="oc-subtitle">Phản hồi và theo dõi sức khỏe bệnh nhân</p>
            </div>

            <div className="oc-layout">
                {/* CỘT TRÁI: DANH SÁCH YÊU CẦU */}
                <div className="oc-list-panel">
                    <h4 style={{ marginBottom: '15px' }}>💬 Yêu cầu tư vấn ({requests.length})</h4>
                    {requests.length === 0 ? (
                        <p style={{textAlign: 'center', color: '#888', marginTop: '20px'}}>Không có yêu cầu phù hợp</p>
                    ) : (
                        requests.map(req => (
                            <div 
                                key={req.RequestID} 
                                className={`oc-card ${selectedRequest?.RequestID === req.RequestID ? 'active' : ''}`}
                                onClick={() => setSelectedRequest(req)}
                            >
                                <div className="oc-card-header">
                                    <span className="oc-patient-name">{req.PatientName}</span>
                                    <span className={`oc-tag ${getPriorityClass(req.Priority)}`}>{req.Priority}</span>
                                </div>
                                <div className="oc-specialty">{req.Specialty}</div>
                                <div className="oc-time">
                                    <LuClock3 /> {req.CreatedTime}
                                </div>
                                <p className="oc-symptoms">{req.Symptoms}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* CỘT PHẢI: KHUNG CHAT */}
                <div className="oc-detail-panel">
                    {selectedRequest ? (
                        <>
                            <div className="oc-detail-header">
                                <h3 style={{ margin: 0 }}>{selectedRequest.PatientName} - {selectedRequest.Specialty}</h3>
                                <span style={{ fontSize: '13px', color: '#666' }}>Trạng thái: {selectedRequest.Status}</span>
                            </div>

                            <div className="oc-chat-area">
                                {Array.isArray(messages) && messages.map((msg, index) => {
                                    const isDoctor = msg.SenderType === 'Doctor';
                                    return (
                                        <div key={msg.MessageID || index} className={`oc-message-bubble ${isDoctor ? 'oc-msg-doctor' : 'oc-msg-patient'}`}>
                                            <div style={{ 
                                                fontWeight: 'bold', 
                                                marginBottom: '5px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '5px', 
                                                flexDirection: isDoctor ? 'row-reverse' : 'row' 
                                            }}>
                                                {isDoctor ? <FaUserMd /> : <FaUserCircle />} 
                                                {isDoctor ? "Bạn" : "Bệnh nhân"}
                                            </div>
                                            <div>{msg.Content}</div>
                                            <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                                {formatDate(msg.SentAt)}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="oc-input-area">
                                <textarea 
                                    className="oc-textarea"
                                    placeholder="Nhập nội dung tư vấn..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendReply();
                                        }
                                    }}
                                />
                                <button className="oc-btn-send" onClick={handleSendReply}>
                                    <LuSend /> Gửi
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="oc-empty-state">
                            <LuMessageSquare size={48} color="#ddd" />
                            <p>Chọn một yêu cầu để bắt đầu tư vấn</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnlineConsultation;