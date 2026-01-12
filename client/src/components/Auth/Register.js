import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    
    // State lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        role: 'Bệnh nhân', // Mặc định
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

    // Xử lý khi nhập liệu
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Xử lý khi bấm Đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Validate mật khẩu
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            // Gọi API Backend
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
            <div className="register-card">
                <div className="register-header">
                    <div className="icon-circle">
                        <FaHeartbeat />
                    </div>
                    <h2>Đăng ký tài khoản</h2>
                    <p>Tạo tài khoản mới để sử dụng hệ thống</p>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleRegister}>
                    {/* Hàng 1: Vai trò */}
                    <div className="form-group">
                        <label>Vai trò đăng ký</label>
                        <select name="role" value={formData.role} onChange={handleChange} disabled>
                            <option value="Bệnh nhân">Bệnh nhân</option>
                        </select>
                    </div>

                    {/* Hàng 2: Họ tên & Email */}
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Họ và tên</label>
                            <input type="text" name="fullName" placeholder="Nguyễn Văn A" onChange={handleChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="your@email.com" onChange={handleChange} />
                        </div>
                    </div>

                    {/* Hàng 3: SĐT & Ngày sinh */}
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Số điện thoại</label>
                            <input type="text" name="phone" placeholder="0912345678" onChange={handleChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Ngày sinh</label>
                            <input type="date" name="dob" onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Hàng 4: Giới tính */}
                    <div className="form-group">
                        <label>Giới tính</label>
                        <select name="gender" onChange={handleChange} required>
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    {/* Hàng 5: Địa chỉ */}
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" name="address" placeholder="123 Đường ABC..." onChange={handleChange} />
                    </div>

                    {/* Hàng 6: Mật khẩu & Xác nhận */}
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Mật khẩu</label>
                            <input type="password" name="password" placeholder="********" onChange={handleChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Xác nhận mật khẩu</label>
                            <input type="password" name="confirmPassword" placeholder="********" onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Checkbox điều khoản */}
                    <div className="checkbox-group">
                        <input type="checkbox" required />
                        <label>Tôi đồng ý với <span>Điều khoản sử dụng</span> và <span>Chính sách bảo mật</span></label>
                    </div>

                    <button type="submit" className="btn-register">Đăng ký</button>
                </form>

                <p className="login-link">
                    Đã có tài khoản? <span onClick={() => navigate('/login')}>Đăng nhập ngay</span>
                </p>
            </div>
        </div>
    );
};

export default Register;