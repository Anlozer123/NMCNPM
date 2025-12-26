import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaUserCircle, FaFileMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './DoctorAppointments.css';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments'); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
    const staffID = user?.StaffID;

    const fetchAppointments = useCallback(async () => {
        if (!staffID) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/doctor/appointments/${staffID}`);
            setAppointments(response.data);
        } catch (error) { console.error("Lỗi:", error); } finally { setLoading(false); }
    }, [staffID]);

    const fetchMyPatients = useCallback(async () => {
        if (!staffID) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/doctor/my-patients/${staffID}`);
            setPatients(response.data);
        } catch (error) { console.error("Lỗi:", error); } finally { setLoading(false); }
    }, [staffID]);

    useEffect(() => {
        activeTab === 'appointments' ? fetchAppointments() : fetchMyPatients();
    }, [activeTab, fetchAppointments, fetchMyPatients]);

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : "N/A";
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : "N/A";

    return (
        <div className="doc-page-container">
            <div className="page-header">
                <h1>Lịch khám & Bệnh nhân</h1>
                <p>Quản lý lịch hẹn và danh sách bệnh nhân bạn đang phụ trách</p>
            </div>

            <div className="tabs-container">
                <button className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>Lịch hẹn</button>
                <button className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>Bệnh nhân của tôi</button>
            </div>

            <div className="list-content">
                {activeTab === 'appointments' ? (
                    <div className="tab-panel">
                        <h3 className="list-title">📅 Lịch khám sắp tới</h3>
                        <p className="list-subtitle">Danh sách bệnh nhân đã đặt lịch khám</p>
                        
                        {loading ? <p>Đang tải...</p> : (
                            <div className="cards-grid">
                                {appointments.map((app) => (
                                    <div key={app.AppointmentID} className="app-card">
                                        <div className="card-header">
                                            <div className="patient-info-header">
                                                <div className="avatar-placeholder"><FaUserCircle /></div>
                                                <div>
                                                    <h4>{app.PatientName}</h4>
                                                    <span className="exam-type">Khám định kỳ</span>
                                                </div>
                                            </div>
                                            <span className={`status-badge confirmed`}>Đã xác nhận</span>
                                        </div>
                                        <div className="card-body">
                                            <div className="time-info">
                                                <span><FaCalendarAlt /> {formatDate(app.AppointmentDate)}</span>
                                                <span><FaClock /> {formatTime(app.AppointmentDate)}</span>
                                            </div>
                                            <div className="reason-box"><strong>Lý do:</strong> {app.Reason}</div>
                                        </div>
                                        <div className="card-actions-horizontal">
                                            <button className="btn-primary-blue" onClick={() => navigate(`/patient-profile/${app.PatientID}`)}>Xem hồ sơ</button>
                                            <button className="btn-secondary-white">Liên hệ</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="tab-panel">
                        <h3 className="list-title">👥 Bệnh nhân đang điều trị</h3>
                        <p className="list-subtitle">Bệnh nhân trong phòng bệnh bạn phụ trách</p>
                        
                        {loading ? <p>Đang tải...</p> : (
                            <div className="cards-grid">
                                {patients.map((p) => (
                                    <div key={p.PatientID} className="treatment-card">
                                        <div className="card-main-content">
                                            <div className="patient-text-details">
                                                <h4>{p.FullName}</h4>
                                                <p className="sub-info">Phòng {p.RoomNumber || '301'}</p>
                                                <p className="sub-info">Nhập viện: {formatDate(p.AdmissionDate || '2025-01-15')}</p>
                                            </div>
                                            <span className="status-tag good">Hồi phục tốt</span>
                                        </div>
                                        <div className="card-actions-horizontal">
                                            <button className="btn-primary-blue" onClick={() => navigate(`/patient-profile/${p.PatientID}`)}>
                                                <FaFileMedical /> Xem hồ sơ
                                            </button>
                                            <button className="btn-secondary-white">Cập nhật</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <button className="btn-back-link" onClick={() => navigate('/dashboard')}>← Quay lại Dashboard</button>
        </div>
    );
};

export default DoctorAppointments;