import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCalendarCheck, FaComments, FaUserInjured, FaFilePrescription, 
    FaHome, FaMagic, FaSignOutAlt 
} from 'react-icons/fa';
import './DoctorDashboard.css'; 
import DoctorAppointments from './DoctorAppointments';
import PatientProfile from './PatientProfile';
// --- MỚI THÊM: Import component Tư vấn trực tuyến ---
import OnlineConsultation from './OnlineConsultation';

const DoctorDashboard = ({ user, activeView }) => {
    const navigate = useNavigate();

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
                    {/* --- CẬP NHẬT: Thêm onClick và class active cho menu Tư vấn --- */}
                    <li className={activeView === 'online-consultation' ? "active" : ""} onClick={() => navigate('/online-consultation')}>
                        <FaComments /> Tư vấn
                    </li>
                    <li><FaUserInjured /> Bệnh nhân</li>
                    <li><FaMagic /> AI Tóm tắt</li>
                </ul>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="doc-main">
                <header className="doc-header">
                    <div className="welcome-text"></div> 
                    <div className="user-info">
                        {/* Truyền StaffID nếu có, hoặc ID mặc định để test */}
                        <span>BS. {user?.FullName || 'Nguyễn Văn A'}</span>
                        <button onClick={handleLogout} className="btn-logout">
                            <FaSignOutAlt /> Đăng xuất
                        </button>
                    </div>
                </header>

                <div className="content-wrapper">
                    {/* KIỂM TRA ĐIỀU KIỆN ĐỂ HIỂN THỊ NỘI DUNG */}
                    {activeView === 'appointments' ? (
                        <DoctorAppointments />
                    ) : activeView === 'patient-detail' ? (
                        <PatientProfile />
                    ) : activeView === 'online-consultation' ? (
                        /* --- MỚI THÊM: Hiển thị giao diện Tư vấn trực tuyến --- */
                        <OnlineConsultation doctorId={user?.StaffID || 2} />
                    ) : (
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
                                {/* --- CẬP NHẬT: Thêm onClick để điều hướng nhanh --- */}
                                <div className="action-card" onClick={() => navigate('/online-consultation')}>
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
                                                <button 
                                                    className="btn-detail" 
                                                    onClick={() => navigate(`/patient-profile/${app.patientId}`)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;