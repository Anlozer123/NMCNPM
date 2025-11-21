import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaStethoscope, FaSignOutAlt, FaUserInjured } from 'react-icons/fa';
import './Dashboard.css';

const DoctorDashboard = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar doctor-sidebar">
                <div className="profile-section">
                    <div className="avatar-circle doc-avatar">Dr</div>
                    <h3>{user.FullName}</h3>
                    <p>{user.Specialization || 'Bác sĩ đa khoa'}</p>
                </div>
                <ul className="menu-list">
                    <li className="active"><FaCalendarCheck /> Lịch làm việc</li>
                    <li><FaUserInjured /> Danh sách bệnh nhân</li>
                    <li><FaStethoscope /> Kê đơn thuốc</li>
                    <li onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Đăng xuất</li>
                </ul>
            </div>

            <div className="main-content">
                <header>
                    <h2>Bảng điều khiển Bác sĩ</h2>
                    <p>Chúc bác sĩ một ngày làm việc hiệu quả!</p>
                </header>

                <div className="stats-row">
                    <div className="stat-box">
                        <h3>05</h3>
                        <p>Bệnh nhân chờ</p>
                    </div>
                    <div className="stat-box">
                        <h3>12</h3>
                        <p>Lịch hẹn hôm nay</p>
                    </div>
                </div>

                <div className="schedule-section">
                    <h3>Lịch khám sắp tới</h3>
                    {/* Đây là dữ liệu giả, Sprint sau sẽ gọi API */}
                    <div className="schedule-item">
                        <span className="time">09:00</span>
                        <div className="info">
                            <h4>Phạm Bệnh Nhân A</h4>
                            <p>Lý do: Đau đầu, chóng mặt</p>
                        </div>
                        <button className="btn-action">Tiếp nhận</button>
                    </div>
                    <div className="schedule-item">
                        <span className="time">10:30</span>
                        <div className="info">
                            <h4>Nguyễn Văn B</h4>
                            <p>Lý do: Tái khám dạ dày</p>
                        </div>
                        <button className="btn-action">Tiếp nhận</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;