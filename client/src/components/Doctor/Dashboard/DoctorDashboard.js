import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCalendarCheck, FaComments, FaUserInjured, FaFilePrescription, 
    FaHome, FaMagic, FaSignOutAlt 
} from 'react-icons/fa';
import './DoctorDashboard.css'; 

import DoctorAppointments from "../Appointments/DoctorAppointments";
import PatientProfile from "../PatientCare/PatientProfile";
import OnlineConsultation from "../Consultation/OnlineConsultation";
import AiSummary from "../Consultation/AiSummary"; 

const DoctorDashboard = ({ user, activeView }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const appointmentsData = [
        { id: 1, patientId: 1, name: 'Phạm Bệnh Nhân A', type: 'Khám định kỳ', time: '09:00', avatar: 'A' },
        { id: 2, patientId: 2, name: 'Hoàng Bệnh Nhân B', type: 'Tư vấn', time: '10:30', avatar: 'B' },
    ];

    return (
        <div className="doctor-layout">
            <aside className="doc-sidebar">
                <div className="brand">
                    <div className="logo-icon">⚡</div> <span>MediCare Hospital</span>
                </div>
                <ul className="doc-menu">
                    <li className={!activeView ? "active" : ""} onClick={() => navigate('/dashboard')}>
                        <FaHome /> Trang chủ
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

            <main className="doc-main">
                <header className="doc-header">
                    <div className="user-info">
                        <span>BS. {user?.FullName || 'Đang tải...'}</span>
                        <button onClick={handleLogout} className="btn-logout"><FaSignOutAlt /> Đăng xuất</button>
                    </div>
                </header>

                <div className="content-wrapper">
                    {activeView === 'appointments' ? <DoctorAppointments initialTab="appointments" /> : 
                     activeView === 'patients' ? <DoctorAppointments initialTab="patients" /> : 
                     activeView === 'patient-detail' ? <PatientProfile /> : 
                     activeView === 'online-consultation' ? <OnlineConsultation doctorId={user?.ID || 2} /> : 
                     
                     // --- SỬA DÒNG NÀY: Truyền user vào AiSummary ---
                     activeView === 'ai-summary' ? <AiSummary user={user} /> : (
                     // ------------------------------------------------
                        <>
                            <h1 className="page-title">Bảng điều khiển</h1>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-info"><p>Lịch hẹn hôm nay</p><h3>{appointmentsData.length}</h3></div>
                                    <div className="stat-icon blue"><FaCalendarCheck /></div>
                                </div>
                            </div>

                            <h2 className="section-header">Chức năng nhanh</h2>
                            <div className="actions-grid">
                                <div className="action-card" onClick={() => navigate('/doctor/appointments')}>
                                    <FaCalendarCheck className="action-icon blue" />
                                    <h4>Xem lịch khám</h4><p>UC007</p>
                                </div>
                                <div className="action-card highlight" onClick={() => navigate('/doctor/ai-summary')}>
                                    <FaMagic className="action-icon blue" />
                                    <h4>AI Tóm tắt</h4><p>UC018</p>
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