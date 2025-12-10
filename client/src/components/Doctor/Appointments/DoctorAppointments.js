import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './DoctorAppointments.css'; // CSS ở bước 3

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments'); // Tab 'appointments' hoặc 'patients'
    const [loading, setLoading] = useState(true);
    
    // Lấy thông tin bác sĩ đang đăng nhập
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Gọi API Backend (Thay UserID thực tế của bác sĩ)
                const response = await axios.get(`http://localhost:5000/api/doctor/appointments/${user.StaffID}`);
                setAppointments(response.data);
            } catch (error) {
                console.error("Lỗi tải lịch khám:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.StaffID) {
            fetchAppointments();
        }
    }, [user]);

    // Hàm định dạng ngày giờ cho đẹp
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="doc-page-container">
            {/* Header Section */}
            <div className="page-header">
                <h1>Lịch khám & Bệnh nhân</h1>
                <p>UC007: View Patient List/Appointments - Quản lý lịch hẹn và danh sách bệnh nhân</p>
            </div>

            {/* Tabs Switcher */}
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                >
                    Lịch hẹn
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
                    onClick={() => setActiveTab('patients')}
                >
                    Bệnh nhân của tôi
                </button>
            </div>

            {/* Appointment List Content */}
            <div className="list-content">
                <h3 className="list-title">📅 Lịch khám sắp tới</h3>
                <p className="list-subtitle">Danh sách bệnh nhân đã đặt lịch khám</p>

                {loading ? <p>Đang tải dữ liệu...</p> : (
                    <div className="appointment-cards">
                        {appointments.length === 0 ? <p>Chưa có lịch hẹn nào.</p> : appointments.map((app) => (
                            <div key={app.AppointmentID} className="app-card">
                                <div className="card-header">
                                    <div className="patient-info">
                                        <div className="avatar-placeholder">
                                            <FaUserCircle />
                                        </div>
                                        <div>
                                            <h4>{app.PatientName}</h4>
                                            <span className="exam-type">Khám bệnh</span>
                                        </div>
                                    </div>
                                    <span className={`status-badge ${app.Status?.toLowerCase()}`}>
                                        {app.Status === 'Confirmed' ? 'Đã xác nhận' : app.Status}
                                    </span>
                                </div>

                                <div className="card-body">
                                    <div className="time-info">
                                        <span><FaCalendarAlt /> {formatDate(app.AppointmentDate)}</span>
                                        <span><FaClock /> {formatTime(app.AppointmentDate)}</span>
                                    </div>
                                    <div className="reason-box">
                                        <strong>Lý do:</strong> {app.Reason}
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button className="btn-view-profile">Xem hồ sơ</button>
                                    <button className="btn-contact">Liên hệ</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Nút quay lại Dashboard */}
            <button className="btn-back" onClick={() => navigate('/dashboard')}>← Quay lại Dashboard</button>
        </div>
    );
};

export default DoctorAppointments;