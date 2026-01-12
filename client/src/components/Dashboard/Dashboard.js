import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SỬA ĐƯỜNG DẪN IMPORT TẠI ĐÂY ---
// Dùng ../ để lùi ra khỏi thư mục Dashboard, sau đó đi vào Doctor hoặc Patient
import DoctorDashboard from '../Doctor/Dashboard/DoctorDashboard';
import PatientDashboard from '../Patient/Dashboard/PatientDashboard';

// Thêm activeView vào props nhận từ App.js
const Dashboard = ({ activeView }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
            navigate('/');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    if (!user) return null; 

    return (
        <div>
            {/* Dashboard Bác sĩ: Truyền thêm activeView xuống */}
            {user.Role === 'Doctor' && (
                <DoctorDashboard user={user} activeView={activeView} />
            )}

            {/* Hiện Dashboard Bệnh nhân */}
            {(user.Role === 'Patient' || !user.Role) && (
                <PatientDashboard user={user} />
            )}
            
            {user.Role === 'Admin' && <h1>Chào Admin (Tính năng đang phát triển)</h1>}
        </div>
    );
};

export default Dashboard;