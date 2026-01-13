import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCalendarCheck, FaComments, FaUserInjured, FaFilePrescription, 
    FaHome, FaMagic, FaSignOutAlt 
} from 'react-icons/fa';
import './DoctorDashboard.css'; 

/* ===== IMPORT COMPONENTS ===== */
import DoctorAppointments from "../Appointments/DoctorAppointments";
import PatientProfile from "../PatientCare/PatientProfile";
import OnlineConsultation from "../Consultation/OnlineConsultation";
import AiSummary from "../AIfunction/AiSummary";

const DoctorDashboard = ({ user, activeView }) => {
    const navigate = useNavigate();

    // Lấy ID thực tế từ user (StaffID hoặc ID tùy theo DB của bạn)
    const currentDoctorId = user?.StaffID || user?.ID;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Dữ liệu giả lập cho phần thống kê (Stats) - GIỮ NGUYÊN
    const appointmentsData = [
        { id: 1, patientId: 1, name: 'Phạm Bệnh Nhân A', type: 'Khám định kỳ', time: '09:00', avatar: 'A' },
        { id: 2, patientId: 2, name: 'Hoàng Bệnh Nhân B', type: 'Tư vấn', time: '10:30', avatar: 'B' },
        { id: 3, patientId: 1, name: 'Phạm Bệnh Nhân A', type: 'Tái khám', time: '14:00', avatar: 'A' },
    ];

    return (
        <div className="doctor-layout">
            {/* --- SIDEBAR --- GIỮ NGUYÊN */}
            <aside className="doc-sidebar">
                <div className="brand">
                    <h2 className="footer-logo">TÂM ANH</h2>
                </div>

                <ul className="doc-menu">
                    <li className={!activeView ? "active" : ""} onClick={() => navigate('/dashboard')}>
                        <FaHome /> Tổng quan
                    </li>
                    <li className={activeView === 'appointments' ? "active" : ""} onClick={() => navigate('/doctor/appointments')}>
                        <FaCalendarCheck /> Lịch khám
                    </li>
                    <li className={activeView === 'online-consultation' ? "active" : ""} onClick={() => navigate('/online-consultation')}>
                        <FaComments /> Tư vấn
                    </li>
                    <li className={activeView === 'patients' ? "active" : ""} onClick={() => navigate('/doctor/patients')}>
                        <FaUserInjured /> Bệnh nhân
                    </li>
                    <li className={activeView === 'ai-summary' ? "active" : ""} onClick={() => navigate('/doctor/ai-summary')}>
                        <FaMagic /> AI Tóm tắt
                    </li>
                </ul>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="doc-main">
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
                    {/* RENDER NỘI DUNG DỰA TRÊN ACTIVE VIEW */}
                    
                    {/* [SỬA] Truyền doctorId động vào DoctorAppointments */}
                    {activeView === 'appointments' ? (
                        <DoctorAppointments initialTab="appointments" doctorId={currentDoctorId} />
                    ) : 
                    
                    /* [SỬA] Truyền doctorId động vào DoctorAppointments */
                    activeView === 'patients' ? (
                        <DoctorAppointments initialTab="patients" doctorId={currentDoctorId} />
                    ) : 
                    
                    activeView === 'patient-detail' ? (
                        <PatientProfile />
                    ) : 
                    
                    /* [SỬA] Bỏ "|| 2", dùng ID thực tế từ props user */
                    activeView === 'online-consultation' ? (
                        <OnlineConsultation doctorId={currentDoctorId} />
                    ) : 
                    
                    activeView === 'ai-summary' ? (  /* <--- CHÈN THÊM ĐOẠN NÀY */
                        <AiSummary user={user} />
                    ) : 
                    
                    /* PHẦN MẶC ĐỊNH - GIỮ NGUYÊN HOÀN TOÀN */
                    (
                        <>
                            <h1 className="page-title">Bảng điều khiển</h1>
                            <p className="page-subtitle">Quản lý lịch khám và bệnh nhân của bạn</p>

                            {/* STATS CARDS */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-info"><p>Lịch hẹn hôm nay</p><h3>{appointmentsData.length}</h3></div>
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
                                <div className="action-card" onClick={() => navigate('/online-consultation')}>
                                    <FaComments className="action-icon teal" />
                                    <h4>Tư vấn trực tuyến</h4><p>UC008</p>
                                </div>
                                <div className="action-card" onClick={() => navigate('/doctor/patients')}>
                                    <FaUserInjured className="action-icon green" />
                                    <h4>Quản lý bệnh nhân</h4><p>UC012</p>
                                </div>
                                <div className="action-card highlight" onClick={() => navigate('/doctor/ai-summary')}>
                                    <FaMagic className="action-icon blue" />
                                    <h4>AI Tóm tắt</h4><p>UC018</p>
                                </div>
                            </div>

                            {/* APPOINTMENT LIST RÚT GỌN */}
                            <div className="appointments-section">
                                <h2 className="section-header">Lịch hẹn hôm nay</h2>
                                <div className="appointment-list">
                                    {appointmentsData.map((app) => (
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