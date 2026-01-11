import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPhoneAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    // Hàm kiểm tra active menu
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="header-wrapper">
            {/* DÒNG 1: LOGO & LIÊN HỆ */}
            <div className="header-top">
                <div className="logo" onClick={() => handleNavigate('/')} style={{cursor: 'pointer'}}>TÂMANH</div>
                <div className="contact-info-group">
                    <div className="info-item">
                        <FaPhoneAlt className="icon-blue" />
                        <div className="info-text">
                            <span className="label">LIÊN HỆ</span>
                            <span className="value text-blue">(237) 681-812-255</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <FaClock className="icon-blue" />
                        <div className="info-text">
                            <span className="label">GIỜ LÀM VIỆC</span>
                            <span className="value text-blue">09:00 - 20:00 mỗi ngày</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <FaMapMarkerAlt className="icon-blue" />
                        <div className="info-text">
                            <span className="label">ĐỊA CHỈ</span>
                            <span className="value text-blue">120 YÊN LÃNG</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DÒNG 2: MENU & BUTTONS */}
            <div className="header-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
                <div className="nav-links" style={{ display: 'flex', gap: '40px' }}>
                    <span className={`nav-link-item ${isActive('/')}`} onClick={() => handleNavigate('/')}>Trang chủ</span>
                    <span className={`nav-link-item ${isActive('/services')}`} onClick={() => handleNavigate('/services')}>Dịch vụ</span>
                    <span className={`nav-link-item ${isActive('/doctors')}`} onClick={() => handleNavigate('/doctors')}>Bác sĩ</span>
                </div>

                <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => handleNavigate('/login')} 
                        style={{backgroundColor: 'transparent', border: '1px solid #333', color: '#333', padding: '6px 16px', fontSize: '14px', fontWeight: '500', borderRadius: '3px', cursor: 'pointer', fontFamily: 'Roboto, sans-serif'}}>
                        Đăng nhập
                    </button>
                    <button onClick={() => handleNavigate('/register')} 
                        style={{backgroundColor: '#222', border: '1px solid #222', color: '#fff', padding: '6px 16px', fontSize: '14px', fontWeight: '500', borderRadius: '3px', cursor: 'pointer', fontFamily: 'Roboto, sans-serif'}}>
                        Đăng ký
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;