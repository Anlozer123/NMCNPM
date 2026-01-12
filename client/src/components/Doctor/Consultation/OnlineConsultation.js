import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LuClock3, LuMessageSquare, LuSend } from "react-icons/lu";
import { FaUserCircle, FaUserMd } from "react-icons/fa";
import './OnlineConsultation.css';

const OnlineConsultation = ({ doctorId = 2 }) => { 
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [messages, setMessages] = useState([]); // State lưu lịch sử chat
    const [replyContent, setReplyContent] = useState('');
    const chatEndRef = useRef(null); // Để tự động cuộn xuống tin mới nhất

    // 1. Tải danh sách yêu cầu bên trái
    const fetchRequests = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:5000/api/doctor/consultations');
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // 2. Khi chọn 1 yêu cầu -> Tải lịch sử tin nhắn
    useEffect(() => {
        if (selectedRequest) {
            fetchMessages(selectedRequest.RequestID);
        }
    }, [selectedRequest]);

    const fetchMessages = async (requestId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/doctor/consultation/${requestId}/messages`);
            const data = await res.json();
            
            // Nếu chưa có tin nhắn nào trong bảng Messages (do dữ liệu cũ), 
            // ta hiển thị tin nhắn đầu tiên từ cột Symptoms
            if (data.length === 0 && selectedRequest?.Symptoms) {
                 setMessages([{
                     MessageID: 'init',
                     SenderType: 'Patient',
                     Content: selectedRequest.Symptoms,
                     SentAt: selectedRequest.CreatedTime
                 }]);
            } else {
                setMessages(data);
            }
        } catch (error) {
            console.error("Lỗi tải tin nhắn:", error);
        }
    };

    // Auto scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 3. Xử lý gửi tin nhắn (Nút Gửi)
    const handleSendReply = async () => {
        if (!replyContent.trim()) return;

        try {
            // [QUAN TRỌNG] Dùng method POST để gọi API mới
            const res = await fetch(`http://localhost:5000/api/doctor/consultation/reply/${selectedRequest.RequestID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: doctorId,
                    responseContent: replyContent
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Thêm tin nhắn vừa gửi vào giao diện ngay lập tức
                const newMsg = {
                    MessageID: data.messageId,
                    SenderType: 'Doctor',
                    Content: replyContent,
                    SentAt: new Date().toISOString()
                };
                setMessages(prev => [...prev, newMsg]);
                setReplyContent(''); 
                
                // Cập nhật lại danh sách bên trái (để làm mới trạng thái)
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
        return new Date(dateString).toLocaleString('vi-VN', { 
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
        });
    };

    return (
        <div className="oc-container">
            <div className="oc-header">
                <h1 className="oc-title">Tư vấn trực tuyến</h1>
                <p className="oc-subtitle">Phản hồi và theo dõi sức khỏe bệnh nhân</p>
            </div>

            <div className="oc-layout">
                {/* CỘT TRÁI: DANH SÁCH */}
                <div className="oc-list-panel">
                    <h4 style={{ marginBottom: '15px' }}>💬 Yêu cầu ({requests.length})</h4>
                    {requests.map(req => (
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
                    ))}
                </div>

                {/* CỘT PHẢI: CHI TIẾT & CHAT ROOM */}
                <div className="oc-detail-panel">
                    {selectedRequest ? (
                        <>
                            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                <h3 style={{ margin: 0 }}>{selectedRequest.PatientName} - {selectedRequest.Specialty}</h3>
                                <span style={{ fontSize: '13px', color: '#666' }}>Trạng thái: {selectedRequest.Status}</span>
                            </div>

                            {/* KHUNG CHAT REAL-TIME */}
                            <div className="oc-chat-area">
                                {messages.map((msg, index) => {
                                    const isDoctor = msg.SenderType === 'Doctor';
                                    return (
                                        <div key={index} className={`oc-message-bubble ${isDoctor ? 'oc-msg-doctor' : 'oc-msg-patient'}`}>
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
                                    )
                                })}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Ô NHẬP TIN NHẮN (LUÔN HIỆN ĐỂ CHAT TIẾP) */}
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