import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaHeartbeat, FaCalendarAlt, FaStethoscope, FaFileMedical, 
    FaClipboardList, FaUsers, FaMagic, 
    FaUserInjured, FaUserMd, FaUserNurse, FaUserCog 
} from 'react-icons/fa';
import './Homepage.css';

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            {/* --- HEADER (NAVBAR) --- */}
            <nav className="navbar">
                <div className="logo">
                    <FaHeartbeat className="logo-icon" />
                    <span>MediCare Hospital</span>
                </div>
                <div className="nav-buttons">
                    <button className="btn-text" onClick={() => navigate('/login')}>Đăng nhập</button>
                    <button className="btn-primary" onClick={() => navigate('/register')}>Đăng ký</button>
                </div>
            </nav>

            {/* HERO SECTION (BANNER)*/}
            <header className="hero-section">
                <h1 className="hero-title">Hệ Thống Quản Lý Bệnh Viện Hiện Đại</h1>
                <p className="hero-subtitle">
                    Nền tảng số hóa toàn diện cho bệnh viện - Quản lý bệnh nhân, 
                    nhân sự và thiết bị y tế một cách thông minh và bảo mật
                </p>
                <div className="hero-buttons">
                    <button className="btn-primary large" onClick={() => navigate('/login')}>Bắt đầu ngay</button>
                    <button className="btn-outline large">Tìm hiểu thêm</button>
                </div>
            </header>

            {/*FEATURE SECTION*/}
            <section className="features-section">
                <h2 className="section-title">Chức năng nổi bật</h2>
                <div className="features-grid">
                    {/* Card 1 */}
                    <div className="feature-card">
                        <div className="icon-box blue"><FaCalendarAlt /></div>
                        <h3>Đặt lịch khám</h3>
                        <p>Đăng ký và quản lý lịch khám trực tuyến dễ dàng, tiện lợi</p>
                    </div>
                    {/* Card 2 */}
                    <div className="feature-card">
                        <div className="icon-box cyan"><FaStethoscope /></div>
                        <h3>Tư vấn trực tuyến</h3>
                        <p>Kết nối với bác sĩ từ xa, nhận tư vấn y tế chuyên nghiệp</p>
                    </div>
                    {/* Card 3 */}
                    <div className="feature-card">
                        <div className="icon-box blue-dark"><FaFileMedical /></div>
                        <h3>Hồ sơ điện tử</h3>
                        <p>Quản lý hồ sơ bệnh án số hóa, an toàn và dễ truy cập</p>
                    </div>
                    {/* Card 4 */}
                    <div className="feature-card">
                        <div className="icon-box blue"><FaClipboardList /></div>
                        <h3>Đặt đơn thuốc</h3>
                        <p>Đặt và nhận đơn thuốc trực tuyến, giao tận nhà</p>
                    </div>
                    {/* Card 5 */}
                    <div className="feature-card">
                        <div className="icon-box cyan"><FaUsers /></div>
                        <h3>Quản lý nhân sự</h3>
                        <p>Điều phối bác sĩ, điều dưỡng và nhân viên hiệu quả</p>
                    </div>
                    {/* Card 6 (AI) */}
                    <div className="feature-card highlight-card">
                        <div className="icon-box ai-color"><FaMagic /></div>
                        <h3>AI Tóm tắt hồ sơ</h3>
                        <p>Công nghệ AI giúp tóm tắt thông tin bệnh nhân nhanh chóng</p>
                    </div>
                </div>
            </section>

            {/* TARGET AUDIENCE */}
            <section className="audience-section">
                <h2 className="section-title">Dành cho mọi đối tượng</h2>
                <div className="audience-grid">
                    <div className="audience-item">
                        <div className="circle-icon bg-blue-light"><FaUserInjured /></div>
                        <h3>Bệnh nhân</h3>
                        <p>Đặt lịch, tư vấn và đặt thuốc trực tuyến</p>
                    </div>
                    <div className="audience-item">
                        <div className="circle-icon bg-cyan-light"><FaUserMd /></div>
                        <h3>Bác sĩ</h3>
                        <p>Quản lý bệnh nhân và kê đơn thuốc</p>
                    </div>
                    <div className="audience-item">
                        <div className="circle-icon bg-green-light"><FaUserNurse /></div>
                        <h3>Điều dưỡng</h3>
                        <p>Chăm sóc và quản lý phòng bệnh</p>
                    </div>
                    <div className="audience-item">
                        <div className="circle-icon bg-red-light"><FaUserCog /></div>
                        <h3>Quản trị viên</h3>
                        <p>Quản lý toàn bộ hệ thống</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="logo">
                        <FaHeartbeat className="logo-icon" />
                        <span>MediCare Hospital Management System</span>
                    </div>
                    <p className="copyright">© 2025 - Đồ án Phân tích thiết kế hệ thống</p>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;