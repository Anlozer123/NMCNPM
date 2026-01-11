import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa'; // Đã xóa FaHospitalSymbol vì không dùng nữa
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
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                const userRole = response.data.user.Role || response.data.user.role; 
                localStorage.setItem('role', userRole);

                setTimeout(() => {
                    if (userRole === 'Nurse') navigate('/nurse-dashboard'); 
                    else if (userRole === 'Doctor') navigate('/doctor/appointments');
                    else if (userRole === 'Admin') navigate('/admin-dashboard'); 
                    else navigate('/'); 
                }, 500);
            }
        } catch (err) {
            setIsLoading(false);
            console.error("Lỗi đăng nhập:", err); 
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
                    {/* Đã xóa dòng Sprint 3 */}
                </div>
            </div>

            {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
            <div className="login-form-section">
                <div className="login-box">
                    <div className="login-header">
                        {/* Đã xóa dòng HMS Project */}
                        <h2>Xin Chào!</h2>
                        <p>Vui lòng đăng nhập để tiếp tục</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleLogin}>
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