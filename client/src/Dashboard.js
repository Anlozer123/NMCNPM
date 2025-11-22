import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Lấy thông tin user từ bộ nhớ trình duyệt
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
            // Chưa đăng nhập -> Đá về trang Login
            navigate('/');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    if (!user) return null; 

    // Phân quyền hiển thị
    return (
        <div>
            {/* Dashboard Bác sĩ */}
            {user.Role === 'Doctor' && <DoctorDashboard user={user} />}

            {/* Hiện Dashboard Bệnh nhân */}
            {(user.Role === 'Patient' || !user.Role) && <PatientDashboard user={user} />}
            
            {/* Sprint sau sẽ làm thêm Admin/Nurse */}
            {user.Role === 'Admin' && <h1>Chào Admin (Tính năng đang phát triển)</h1>}
        </div>
    );
};

export default Dashboard;