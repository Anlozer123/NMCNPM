import React, { useState, useEffect, useCallback } from 'react';
import { LuClock3, LuMessageSquare, LuSend } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import './OnlineConsultation.css';

const OnlineConsultation = ({ doctorId = 2 }) => { 
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    // 1. Dùng useCallback để "ghi nhớ" hàm fetchRequests
    // Hàm này chỉ tạo lại khi logic bên trong thay đổi (ở đây là không có gì thay đổi nên deps là [])
    const fetchRequests = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:5000/api/doctor/consultations');
            const data = await res.json();
            setRequests(data);
            return data; // Trả về data để dùng ở nơi khác nếu cần
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
            return [];
        }
    }, []);

    // 2. useEffect tải danh sách lần đầu
    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]); // Đã an toàn để thêm vào dependency

    // 3. useEffect riêng để cập nhật selectedRequest khi danh sách requests thay đổi
    // (Giúp đồng bộ dữ liệu mới nhất vào item đang chọn mà không cần fetch lại)
    useEffect(() => {
        if (selectedRequest && requests.length > 0) {
            const updated = requests.find(r => r.RequestID === selectedRequest.RequestID);
            if (updated) {
                // Chỉ set lại nếu có sự thay đổi về nội dung để tránh render thừa
                if (updated.Status !== selectedRequest.Status || updated.ResponseContent !== selectedRequest.ResponseContent) {
                    setSelectedRequest(updated);
                }
            }
        }
    }, [requests, selectedRequest]);

    // 4. Xử lý gửi phản hồi
    const handleSendReply = async () => {
        if (!replyContent.trim()) return;

        try {
            const res = await fetch(`http://localhost:5000/api/doctor/consultation/reply/${selectedRequest.RequestID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: doctorId,
                    responseContent: replyContent
                })
            });

            if (res.ok) {
                alert("✅ Đã gửi phản hồi thành công!");
                setReplyContent(''); 
                fetchRequests(); // Gọi lại hàm fetch để cập nhật danh sách
            } else {
                alert("❌ Lỗi khi gửi phản hồi");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        }
    };

    // Helper: Màu sắc tag ưu tiên
    const getPriorityClass = (priority) => {
        if (priority === 'Khẩn cấp') return 'tag-khan-cap';
        if (priority === 'Trung bình') return 'tag-trung-binh';
        return 'tag-thap';
    };

    return (
        <div className="oc-container">
            <div className="oc-header">
                <h1 className="oc-title">Tư vấn trực tuyến</h1>
                <p className="oc-subtitle">UC008: Online Consultation - Phản hồi yêu cầu tư vấn từ bệnh nhân</p>
            </div>

            <div className="oc-layout">
                {/* CỘT TRÁI: DANH SÁCH */}
                <div className="oc-list-panel">
                    <h4 style={{ marginBottom: '15px' }}>💬 Yêu cầu tư vấn ({requests.length})</h4>
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
                                {req.Status === 'Đã phản hồi' && <span style={{color: '#28a745', marginLeft: 'auto', fontSize: '11px'}}>✓ Đã trả lời</span>}
                            </div>
                            <p className="oc-symptoms">{req.Symptoms}</p>
                        </div>
                    ))}
                </div>

                {/* CỘT PHẢI: CHI TIẾT & PHẢN HỒI */}
                <div className="oc-detail-panel">
                    {selectedRequest ? (
                        <>
                            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                <h3 style={{ margin: 0 }}>{selectedRequest.PatientName} - {selectedRequest.Specialty}</h3>
                                <span style={{ fontSize: '13px', color: '#666' }}>ID Bệnh nhân: {selectedRequest.PatientID}</span>
                            </div>

                            <div className="oc-chat-area">
                                {/* Tin nhắn của bệnh nhân */}
                                <div className="oc-message-bubble oc-msg-patient">
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FaUserCircle /> Bệnh nhân
                                    </div>
                                    <div>{selectedRequest.Symptoms}</div>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>{selectedRequest.CreatedTime}</div>
                                </div>

                                {/* Tin nhắn phản hồi của bác sĩ (Nếu có) */}
                                {selectedRequest.Status === 'Đã phản hồi' && (
                                    <div className="oc-message-bubble oc-msg-doctor">
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Bác sĩ phản hồi</div>
                                        <div>{selectedRequest.ResponseContent}</div>
                                        <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>{selectedRequest.ResponseTime}</div>
                                    </div>
                                )}
                            </div>

                            {/* Ô nhập phản hồi (Chỉ hiện khi chưa phản hồi) */}
                            {selectedRequest.Status === 'Chờ phản hồi' ? (
                                <div className="oc-input-area">
                                    <textarea 
                                        className="oc-textarea"
                                        placeholder="Nhập nội dung tư vấn..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                    />
                                    <button className="oc-btn-send" onClick={handleSendReply}>
                                        <LuSend /> Gửi phản hồi
                                    </button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#28a745', background: '#f0fff4', borderRadius: '8px' }}>
                                    ✅ Yêu cầu này đã được xử lý.
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="oc-empty-state">
                            <LuMessageSquare size={48} color="#ddd" />
                            <p>Chọn một yêu cầu tư vấn để xem chi tiết và phản hồi</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnlineConsultation;