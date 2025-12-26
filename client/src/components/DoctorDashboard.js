import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCalendarCheck, FaComments, FaUserInjured, FaFilePrescription, 
    FaHome, FaMagic, FaSignOutAlt 
} from 'react-icons/fa';
import './DoctorDashboard.css'; 
import PrescriptionForm from './PrescriptionForm'; 
import PrescriptionHistory from './PrescriptionHistory';
import DoctorAppointments from './DoctorAppointments'; // Import component Lịch khám
import PatientProfile from './PatientProfile'; // THÊM DÒNG NÀY

const DoctorDashboard = ({ user, activeView }) => {
    const navigate = useNavigate();

    // 1. State lưu bệnh nhân đang được chọn để kê đơn
    const [selectedPatient, setSelectedPatient] = useState(null);
    
    // Ref dùng để tự động cuộn xuống form khi chọn bệnh nhân
    const prescriptionRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Dữ liệu giả lập cho danh sách lịch hẹn
    const appointments = [
        { id: 1, patientId: 1, name: 'Phạm Bệnh Nhân A', type: 'Khám định kỳ', time: '09:00', avatar: 'A' },
        { id: 2, patientId: 2, name: 'Hoàng Bệnh Nhân B', type: 'Tư vấn', time: '10:30', avatar: 'B' },
        { id: 3, patientId: 1, name: 'Phạm Bệnh Nhân A', type: 'Tái khám', time: '14:00', avatar: 'A' },
    ];

    // Hàm xử lý khi bấm nút "Kê đơn ngay"
    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setTimeout(() => {
            prescriptionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="doctor-layout">
            {/* --- SIDEBAR (Luôn hiển thị) --- */}
            <aside className="doc-sidebar">
                <div className="brand">
                    <div className="logo-icon">⚡</div> 
                    <span>MediCare Hospital</span>
                </div>

                <ul className="doc-menu">
                    <li className={!activeView ? "active" : ""} onClick={() => navigate('/dashboard')}>
                        <FaHome /> Trang chủ
                    </li>
                    <li className={activeView === 'appointments' ? "active" : ""} onClick={() => navigate('/doctor/appointments')}>
                        <FaCalendarCheck /> Lịch khám
                    </li>
                    <li><FaComments /> Tư vấn</li>
                    <li><FaUserInjured /> Bệnh nhân</li>
                    <li><FaMagic /> AI Tóm tắt</li>
                </ul>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="doc-main">
                {/* Header (Luôn hiển thị) */}
                <header className="doc-header">
                    <div className="welcome-text"></div> 
                    <div className="user-info">
                        <span>BS. {user?.FullName || 'Nguyễn Văn A'}</span>
                        <button onClick={handleLogout} className="btn-logout">
                            <FaSignOutAlt /> Đăng xuất
                        </button>
                    </div>
                </header>

                <div className="content-wrapper">
                    {/* KIỂM TRA ĐIỀU KIỆN ĐỂ HIỂN THỊ NỘI DUNG */}
                    {activeView === 'appointments' ? (
                        /* HIỂN THỊ TRANG LỊCH KHÁM */
                        <DoctorAppointments />
                    ) : 
                    /* TRƯỜNG HỢP 2: XEM CHI TIẾT HỒ SƠ BỆNH NHÂN (UC005) */
                    activeView === 'patient-detail' ? (
                    <PatientProfile />
                    ) : (
                        /* HIỂN THỊ BẢNG ĐIỀU KHIỂN MẶC ĐỊNH */
                        <>
                            <h1 className="page-title">Bảng điều khiển</h1>
                            <p className="page-subtitle">Quản lý lịch khám và bệnh nhân của bạn</p>

                            {/* STATS CARDS */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-info"><p>Lịch hẹn hôm nay</p><h3>{appointments.length}</h3></div>
                                    <div className="stat-icon blue"><FaCalendarCheck /></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info"><p>Tư vấn chờ xử lý</p><h3>3</h3></div>
                                    <div className="stat-icon teal"><FaComments /></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info"><p>Bệnh nhân đang điều trị</p><h3>12</h3></div>
                                    <div className="stat-icon green"><FaUserInjured /></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info"><p>Đơn thuốc tuần này</p><h3>24</h3></div>
                                    <div className="stat-icon red"><FaFilePrescription /></div>
                                </div>
                            </div>

                            {/* QUICK ACTIONS */}
                            <h2 className="section-header">Chức năng nhanh</h2>
                            <div className="actions-grid">
                                <div className="action-card" onClick={() => navigate('/doctor/appointments')}>
                                    <FaCalendarCheck className="action-icon blue" />
                                    <h4>Xem lịch khám</h4>
                                    <p>UC007</p>
                                </div>
                                <div className="action-card">
                                    <FaComments className="action-icon teal" />
                                    <h4>Tư vấn trực tuyến</h4><p>UC008</p>
                                </div>
                                <div className="action-card">
                                    <FaUserInjured className="action-icon green" />
                                    <h4>Quản lý bệnh nhân</h4><p>UC012</p>
                                </div>
                                <div className="action-card highlight">
                                    <FaMagic className="action-icon blue" />
                                    <h4>AI Tóm tắt</h4><p>UC018</p>
                                </div>
                            </div>

                            {/* APPOINTMENT LIST */}
                            <div className="appointments-section">
                                <h2 className="section-header">Lịch hẹn hôm nay</h2>
                                <div className="appointment-list">
                                    {appointments.map((app) => (
                                        <div key={app.id} className="appointment-item">
                                            <div className="app-left">
                                                <div className="avatar-circle">{app.avatar}</div>
                                                <div className="app-info">
                                                    <h4>{app.name}</h4>
                                                    <p>{app.type}</p>
                                                </div>
                                            </div>
                                            <div className="app-right">
                                                <span className="app-time">{app.time}</span>
                                                <button className="btn-detail" onClick={() => handleSelectPatient(app)}>
                                                    Kê đơn ngay
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* KHU VỰC KÊ ĐƠN THUỐC */}
                            <div ref={prescriptionRef} className="prescription-section" style={{ marginTop: '40px', paddingBottom: '50px' }}>
                                <h2 className="section-header">Kê đơn & Lịch sử dùng thuốc</h2>
                                {selectedPatient ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '65% 33%', gap: '2%' }}>
                                        <div>
                                            <div style={{ marginBottom: '15px', padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
                                                Đang kê đơn cho bệnh nhân: <strong>{selectedPatient.name}</strong>
                                            </div>
                                            <PrescriptionForm 
                                                patientId={selectedPatient.patientId} 
                                                doctorId={user?.StaffID || user?.id || 2}
                                            />
                                        </div>
                                        <div>
                                            <PrescriptionHistory patientId={selectedPatient.patientId} />
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ padding: '40px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px', color: '#6c757d', border: '2px dashed #dee2e6' }}>
                                        <FaFilePrescription size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                        <p>Vui lòng chọn một bệnh nhân để bắt đầu.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;