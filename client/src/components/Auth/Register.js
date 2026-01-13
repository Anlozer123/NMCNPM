import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import './Register.css'; 

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        role: 'Patient', 
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        // 1. Kiểm tra Email
        if (!formData.email.trim()) return "Vui lòng nhập Email!";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return "Địa chỉ Email không đúng định dạng!";

        // 2. Kiểm tra SĐT
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(formData.phone)) return "Số điện thoại chỉ được chứa ký tự số!";
        if (formData.phone.length < 10 || formData.phone.length > 11) return "Số điện thoại phải có 10 hoặc 11 chữ số!";

        // 3. Kiểm tra Mật khẩu
        if (formData.password !== formData.confirmPassword) return "Mật khẩu xác nhận không khớp!";

        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true); 

        try {
            // [API Check] Kiểm tra trùng lặp trong DB trước khi chuyển trang
            // Đảm bảo Backend đã có route /api/auth/check-existence như đã thiết lập
            await axios.post('http://localhost:5000/api/auth/check-existence', {
                email: formData.email,
                phone: formData.phone
            });

            // Nếu hợp lệ (API trả về 200) -> Chuyển sang Bước 2
            navigate('/patient-details', { state: { initialData: formData } });

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message); // Hiển thị lỗi từ Backend (VD: "Email đã tồn tại")
            } else {
                setError("Không thể kết nối đến máy chủ. Vui lòng thử lại!");
            }
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="register-container">
            <div className="register-banner">
                <div className="banner-content">
                    <h1>Hospital Management System</h1>
                    <p>Đăng ký nhanh chóng, bảo mật và tiện lợi.</p>
                </div>
            </div>

            <div className="register-form-section">
                <div className="register-box">
                    <div className="register-header">
                        <h2>Đăng Ký</h2>
                        <p>Nhập thông tin tài khoản (Bước 1/2)</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleRegister}>
                        {/* Role ẩn */}
                        <div style={{display:'none'}}>
                            <input name="role" value="Patient" readOnly/>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label>Email (*)</label>
                            <div className="input-wrapper">
                                <FaEnvelope className="input-icon" />
                                <input type="email" className="input-field" name="email" placeholder="email@domain.com" onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="input-group">
                            <label>Số điện thoại (*)</label>
                            <div className="input-wrapper">
                                <FaPhone className="input-icon" />
                                <input type="text" className="input-field" name="phone" placeholder="0912..." onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="input-group">
                            <label>Mật khẩu (*)</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input type="password" className="input-field" name="password" placeholder="******" onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Xác nhận MK */}
                        <div className="input-group">
                            <label>Nhập lại mật khẩu (*)</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input type="password" className="input-field" name="confirmPassword" placeholder="******" onChange={handleChange} required />
                            </div>
                        </div>

                        <button type="submit" className="btn-register" disabled={isLoading}>
                            {isLoading ? 'Đang kiểm tra...' : 'Tiếp Tục'}
                        </button>
                    </form>

                    <p className="login-link">
                        Đã có tài khoản? <span onClick={() => navigate('/login')}>Đăng nhập ngay</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;