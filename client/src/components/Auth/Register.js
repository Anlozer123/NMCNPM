import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        role: 'Bệnh nhân',
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("Đăng ký thất bại. Vui lòng thử lại!");
            }
        }
    };

    return (
        <div className="register-container">
            {/* CỘT TRÁI: BANNER (Giống Login) */}
            <div className="register-banner">
                <div className="banner-content">
                    <h1>Hospital Management System</h1>
                    <p>Đăng ký tài khoản để trải nghiệm dịch vụ y tế tốt nhất.</p>
                </div>
            </div>

            {/* CỘT PHẢI: FORM ĐĂNG KÝ */}
            <div className="register-form-section">
                <div className="register-box">
                    <div className="register-header">
                        <h2>Đăng ký tài khoản</h2>
                        <p>Tạo tài khoản mới để sử dụng hệ thống</p>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleRegister}>
                        {/* Hàng 1: Vai trò (Ẩn hoặc Disable vì mặc định Bệnh nhân) */}
                        <div className="form-group" style={{display:'none'}}>
                            <select name="role" value={formData.role} onChange={handleChange} disabled>
                                <option value="Bệnh nhân">Bệnh nhân</option>
                            </select>
                        </div>

                        {/* Hàng: Họ tên & Email */}
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Họ và tên</label>
                                <input type="text" className="reg-input" name="fullName" placeholder="Nguyễn Văn A" onChange={handleChange} required />
                            </div>
                            <div className="form-group half">
                                <label>Email</label>
                                <input type="email" className="reg-input" name="email" placeholder="email@domain.com" onChange={handleChange} />
                            </div>
                        </div>

                        {/* Hàng: SĐT & Ngày sinh */}
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Số điện thoại</label>
                                <input type="text" className="reg-input" name="phone" placeholder="0912..." onChange={handleChange} required />
                            </div>
                            <div className="form-group half">
                                <label>Ngày sinh</label>
                                <input type="date" className="reg-input" name="dob" onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Hàng: Giới tính & Địa chỉ */}
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Giới tính</label>
                                <select className="reg-input" name="gender" onChange={handleChange} required>
                                    <option value="">Chọn</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                            <div className="form-group half">
                                <label>Địa chỉ</label>
                                <input type="text" className="reg-input" name="address" placeholder="Địa chỉ..." onChange={handleChange} />
                            </div>
                        </div>

                        {/* Hàng: Mật khẩu */}
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Mật khẩu</label>
                                <input type="password" className="reg-input" name="password" placeholder="******" onChange={handleChange} required />
                            </div>
                            <div className="form-group half">
                                <label>Nhập lại MK</label>
                                <input type="password" className="reg-input" name="confirmPassword" placeholder="******" onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" required id="terms" />
                            <label htmlFor="terms">Tôi đồng ý với <span>Điều khoản sử dụng</span></label>
                        </div>

                        <button type="submit" className="btn-register">Đăng ký</button>
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