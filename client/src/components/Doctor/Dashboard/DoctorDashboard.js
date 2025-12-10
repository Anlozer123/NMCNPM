import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCalendarCheck, FaComments, FaUserInjured, FaFilePrescription, 
    FaHome, FaMagic, FaSignOutAlt 
} from 'react-icons/fa';
import './DoctorDashboard.css'; 

const DoctorDashboard = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Dữ liệu giả lập cho danh sách lịch hẹn 
    const appointments = [
        { id: 1, name: 'Nguyễn Văn A', type: 'Khám định kỳ', time: '09:00', avatar: 'A' },
        { id: 2, name: 'Trần Thị B', type: 'Tư vấn', time: '10:30', avatar: 'B' },
        { id: 3, name: 'Lê Văn C', type: 'Tái khám', time: '14:00', avatar: 'C' },
    ];

    return (
        <div className="doctor-layout">
            {/* --- SIDEBAR --- */}
            <aside className="doc-sidebar">
                <div className="brand">
                    <div className="logo-icon">⚡</div> 
                    <span>MediCare Hospital</span>
                </div>

                <ul className="doc-menu">
                    <li onClick={() => navigate('/dashboard')}><FaHome /> Trang chủ</li>
                    
                    {/* --- ĐÃ SỬA: Thêm sự kiện click vào đây --- */}
                    <li onClick={() => navigate('/doctor/appointments')}>
                        <FaCalendarCheck /> Lịch khám
                    </li>
                    {/* ---------------------------------------- */}

                    <li><FaComments /> Tư vấn</li>
                    <li><FaUserInjured /> Bệnh nhân</li>
                    <li><FaMagic /> AI Tóm tắt</li>
                </ul>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="doc-main">
                {/* Header */}
                <header className="doc-header">
                    <div className="welcome-text"></div> 
                    <div className="user-info">
                        <span>BS. {user.FullName || 'Nguyễn Văn A'}</span>
                        <button onClick={handleLogout} className="btn-logout">
                            <FaSignOutAlt /> Đăng xuất
                        </button>
                    </div>
                </header>

                <div className="content-wrapper">
                    <h1 className="page-title">Bảng điều khiển</h1>
                    <p className="page-subtitle">Quản lý lịch khám và bệnh nhân của bạn</p>

                    {/* STATS CARDS (Hàng 1) */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-info">
                                <p>Lịch hẹn hôm nay</p>
                                <h3>3</h3>
                            </div>
                            <div className="stat-icon blue"><FaCalendarCheck /></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p>Tư vấn chờ xử lý</p>
                                <h3>3</h3>
                            </div>
                            <div className="stat-icon teal"><FaComments /></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p>Bệnh nhân đang điều trị</p>
                                <h3>12</h3>
                            </div>
                            <div className="stat-icon green"><FaUserInjured /></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p>Đơn thuốc tuần này</p>
                                <h3>24</h3>
                            </div>
                            <div className="stat-icon red"><FaFilePrescription /></div>
                        </div>
                    </div>

                    {/* QUICK ACTIONS (Hàng 2) */}
                    <h2 className="section-header">Chức năng nhanh</h2>
                    <div className="actions-grid">
                        
                        {/* --- ĐÃ SỬA: Thêm sự kiện click vào đây --- */}
                        <div className="action-card" onClick={() => navigate('/doctor/appointments')}>
                            <FaCalendarCheck className="action-icon blue" />
                            <h4>Xem lịch khám</h4>
                            <p>UC007</p>
                        </div>
                        {/* ---------------------------------------- */}

                        <div className="action-card">
                            <FaComments className="action-icon teal" />
                            <h4>Tư vấn trực tuyến</h4>
                            <p>UC008</p>
                        </div>
                        <div className="action-card">
                            <FaUserInjured className="action-icon green" />
                            <h4>Quản lý bệnh nhân</h4>
                            <p>UC012</p>
                        </div>
                        <div className="action-card highlight">
                            <FaMagic className="action-icon blue" />
                            <h4>AI Tóm tắt</h4>
                            <p>UC018</p>
                        </div>
                    </div>

                    {/* APPOINTMENT LIST (Hàng 3) */}
                    <div className="appointments-section">
                        <h2 className="section-header">Lịch hẹn hôm nay</h2>
                        <p className="section-sub">Danh sách bệnh nhân đã đặt lịch</p>

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
                                        <button className="btn-detail">Xem chi tiết</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;