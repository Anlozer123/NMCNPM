import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaHospitalSymbol } from 'react-icons/fa'; 
import './Login.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Gọi API Backend
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            // Kiểm tra dữ liệu trả về
            // Lưu ý: Backend cần trả về cấu trúc có chứa thông tin user và role
            if (response.data.user) {
                // 1. Lưu thông tin vào localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Lấy Role từ dữ liệu user (Lưu ý: check kỹ xem backend trả về là 'Role' hay 'role')
                // Dựa theo SQL của bạn thì tên cột là Role (viết hoa chữ R)
                const userRole = response.data.user.Role || response.data.user.role; 
                
                // Lưu role riêng để tiện kiểm tra sau này
                localStorage.setItem('role', userRole);

                // 2. Chuyển hướng sau 0.5s dựa trên Role
                setTimeout(() => {
                    if (userRole === 'Nurse') {
                        console.log("Là Y tá -> Chuyển sang Nurse Dashboard");
                        navigate('/nurse-dashboard'); 
                    } 
                    else if (userRole === 'Doctor') {
                        console.log("Là Bác sĩ -> Chuyển sang Doctor Dashboard");
                        navigate('/doctor/appointments');
                    } 
                    else if (userRole === 'Admin') {
                        console.log("Là Admin -> Chuyển sang Admin Dashboard");
                        navigate('/admin-dashboard'); 
                    } 
                    else {
                        // Mặc định nếu không nhận diện được quyền hoặc là Bệnh nhân
                        navigate('/'); 
                    }
                }, 500);
            }
        } catch (err) {
            setIsLoading(false);
            console.error("Lỗi đăng nhập:", err); // Log lỗi ra console để dễ debug
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Không thể kết nối đến Server. Vui lòng thử lại!');
            }
        }
    };

    return (
        <div className="login-container">
            {/* CỘT TRÁI: ẢNH & BANNER */}
            <div className="login-banner">
                <div className="banner-content">
                    <h1>Hospital Management System</h1>
                    <p>Hệ thống quản lý bệnh viện hiện đại, an toàn và tin cậy.</p>
                    <p>Sprint 3: Authentication Module</p>
                </div>
            </div>

            {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
            <div className="login-form-section">
                <div className="login-box">
                    <div className="login-header">
                        <span className="logo-text"><FaHospitalSymbol /> HMS Project</span>
                        <h2>Xin Chào!</h2>
                        <p>Vui lòng đăng nhập để tiếp tục</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleLogin}>
                        {/* Input Tài khoản */}
                        <div className="input-group">
                            <label>Email hoặc Số điện thoại</label>
                            <div className="input-wrapper">
                                <FaUser className="input-icon" />
                                <input 
                                    type="text" 
                                    className="input-field"
                                    placeholder="Nhập tài khoản..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Mật khẩu */}
                        <div className="input-group">
                            <label>Mật khẩu</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input 
                                    type="password" 
                                    className="input-field"
                                    placeholder="Nhập mật khẩu..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-login" disabled={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;