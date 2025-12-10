import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus, FaNotesMedical, FaUserMd, FaSignOutAlt } from 'react-icons/fa';
import './Dashboard.css';

const PatientDashboard = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar bên trái */}
            <div className="sidebar">
                <div className="profile-section">
                    <div className="avatar-circle">{user.FullName ? user.FullName.charAt(0) : 'P'}</div>
                    <h3>{user.FullName}</h3>
                    <p>Bệnh nhân</p>
                </div>
                <ul className="menu-list">
                    <li className="active"><FaUserMd /> Tổng quan</li>
                    <li><FaCalendarPlus /> Đặt lịch khám</li>
                    <li><FaNotesMedical /> Hồ sơ bệnh án</li>
                    <li onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Đăng xuất</li>
                </ul>
            </div>

            {/* Nội dung chính bên phải */}
            <div className="main-content">
                <header>
                    <h2>Chào mừng quay trở lại!</h2>
                    <p>Hôm nay sức khỏe của bạn thế nào?</p>
                </header>

                <div className="card-grid">
                    <div className="card blue-card">
                        <FaCalendarPlus size={40} />
                        <h3>Đặt Lịch Khám Mới</h3>
                        <p>Chọn bác sĩ và thời gian phù hợp</p>
                        <button>Đặt ngay</button>
                    </div>

                    <div className="card green-card">
                        <FaNotesMedical size={40} />
                        <h3>Lịch Sử Khám</h3>
                        <p>Xem lại đơn thuốc và chẩn đoán</p>
                        <button>Xem chi tiết</button>
                    </div>

                    <div className="card purple-card">
                        <FaUserMd size={40} />
                        <h3>Tư Vấn Trực Tuyến</h3>
                        <p>Chat trực tiếp với bác sĩ (AI hỗ trợ)</p>
                        <button>Bắt đầu chat</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;