import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
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
            // Gửi request (Server mới yêu cầu 'username')
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username: email, 
                password: password
            });

            console.log("Server Response:", response.data); // Để debug

            const responseData = response.data;
            const userAccount = responseData.data?.account || responseData.user;

            if (userAccount) {
                // Lưu vào localStorage
                localStorage.setItem('user', JSON.stringify(userAccount));
                
                // Lấy Role (Server mới trả về Role viết hoa chữ cái đầu)
                const userRole = userAccount.Role || userAccount.role; 
                localStorage.setItem('role', userRole);

                // --- [SỬA LỖI ĐIỀU HƯỚNG] ---
                // Chỉ chuyển hướng đến các trang CÓ TỒN TẠI trong App.js cũ
                setTimeout(() => {
                    if (userRole === 'Doctor') {
                        // Route này có trong App.js cũ
                        navigate('/doctor/appointments'); 
                    } 
                    else {
                        // Admin, Nurse, Patient tạm thời về Dashboard chung
                        // Vì App.js cũ chưa có /admin-dashboard hay /nurse-dashboard
                        navigate('/dashboard'); 
                    }
                }, 500);
            } else {
                setError('Đăng nhập thành công nhưng không lấy được thông tin tài khoản.');
            }

        } catch (err) {
            setIsLoading(false);
            console.error("Lỗi đăng nhập:", err); 
            // Hiển thị lỗi từ backend nếu có
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Không thể kết nối đến Server. Vui lòng thử lại!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-banner">
                <div className="banner-content">
                    <h1>Hospital Management System</h1>
                    <p>Hệ thống quản lý bệnh viện hiện đại, an toàn và tin cậy.</p>
                </div>
            </div>

            <div className="login-form-section">
                <div className="login-box">
                    <div className="login-header">
                        <h2>Xin Chào!</h2>
                        <p>Vui lòng đăng nhập để tiếp tục</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Tên đăng nhập (Username)</label>
                            <div className="input-wrapper">
                                <FaUser className="input-icon" />
                                <input 
                                    type="text" 
                                    className="input-field"
                                    placeholder="Nhập username (ví dụ: doc_01)"
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