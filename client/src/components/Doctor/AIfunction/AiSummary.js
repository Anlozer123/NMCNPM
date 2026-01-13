import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExclamationCircle, FaVial, FaPills, FaMagic, FaInfoCircle } from 'react-icons/fa';
import './AiSummary.css';

// Nhận prop user từ Dashboard
const AiSummary = ({ user }) => { 
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [patients, setPatients] = useState([]); 
    const [selectedPatientId, setSelectedPatientId] = useState(""); 

    // 1. Tải danh sách bệnh nhân CỦA BÁC SĨ NÀY
    useEffect(() => {
        const fetchPatients = async () => {
            // Nếu chưa có thông tin bác sĩ thì chưa gọi API
            if (!user) return; 

            try {
                // Lấy ID bác sĩ (ưu tiên StaffID theo DB, fallback sang ID)
                const doctorId = user.StaffID || user.ID || user.id;
                
                // Gọi API kèm theo tham số doctorId để lọc
                const res = await axios.get(`http://localhost:5000/api/ai/patients?doctorId=${doctorId}`);
                if (res.data.success) {
                    setPatients(res.data.patients);
                }
            } catch (err) {
                console.error("Không lấy được danh sách bệnh nhân:", err);
            }
        };
        fetchPatients();
    }, [user]); // Chạy lại khi user thay đổi

    const handleGenerate = async () => {
        if (!selectedPatientId) {
            alert("Vui lòng chọn một bệnh nhân!");
            return;
        }

        setLoading(true);
        setSummary(null);

        try {
            // Thay vì gửi text dài dòng, giờ chỉ cần gửi ID
            // Backend sẽ tự tra cứu DB để lấy dữ liệu chuẩn nhất
            const res = await axios.post('http://localhost:5000/api/ai/summarize', {
                patientId: selectedPatientId 
            });

            if (res.data.success) {
                setSummary(res.data.summary);
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi kết nối AI: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-container">
            <div className="ai-header-info">
                <h1><FaMagic className="magic-icon" /> AI Tóm tắt hồ sơ bệnh nhân</h1>
                <p>Bác sĩ: <b>{user?.FullName}</b> - Công nghệ AI hỗ trợ tóm tắt thông tin điều trị</p>
            </div>

            <div className="ai-card selection-box">
                <h3>Chọn bệnh nhân phụ trách</h3>
                <div className="input-group">
                    <select 
                        className="patient-select" 
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                    >
                        <option value="">-- Chọn bệnh nhân --</option>
                        {patients.length > 0 ? (
                            patients.map((patient) => (
                                <option key={patient.PatientID} value={patient.PatientID}>
                                    {patient.FullName} (ID: {patient.PatientID})
                                </option>
                            ))
                        ) : (
                            <option disabled>Không có bệnh nhân nào đặt lịch với bạn</option>
                        )}
                    </select>

                    <button className="btn-ai-action" onClick={handleGenerate} disabled={loading}>
                        {loading ? "Đang phân tích dữ liệu..." : "✨ Tạo bản tóm tắt AI"}
                    </button>
                </div>
            </div>

            {summary && (
                <div className="ai-results fade-in">
                    <div className="ai-card alert-section">
                        <h4><FaExclamationCircle /> Thông tin quan trọng</h4>
                        <div className="summary-content">{summary.important_info}</div>
                    </div>

                    <div className="ai-card">
                        <div style={{color: '#16a34a', fontWeight: 'bold', marginBottom: '10px'}}>🌿 Tình trạng hiện tại</div>
                        <p>{summary.current_status}</p>
                    </div>

                    <div className="ai-grid">
                        <div className="ai-card">
                            <h4><FaVial /> Kết quả khám & Xét nghiệm</h4>
                            <div className="data-box">{summary.recent_tests}</div>
                        </div>
                        <div className="ai-card">
                            <h4><FaPills /> Thuốc đang chỉ định</h4>
                            <div className="data-box">{summary.current_medications}</div>
                        </div>
                    </div>
                     <div className="ai-card">
                        <div style={{color: '#007bff', fontWeight: 'bold', marginBottom: '10px'}}>👤 Ghi chú điều dưỡng</div>
                        <p>{summary.nursing_notes}</p>
                    </div>
                    <div className="ai-footer-note">
                        <FaInfoCircle /> <b>Lưu ý:</b> Dữ liệu được AI tổng hợp từ Bệnh án (MedicalRecord) và Đơn thuốc (Prescription) trong hệ thống.
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiSummary;