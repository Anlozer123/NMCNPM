import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SỬA ĐƯỜNG DẪN IMPORT TẠI ĐÂY ---
// Dùng ../ để lùi ra khỏi thư mục Dashboard, sau đó đi vào Doctor hoặc Patient
import DoctorDashboard from '../Doctor/Dashboard/DoctorDashboard';
import PatientDashboard from '../Patient/Dashboard/PatientDashboard';

const Dashboard = () => {
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
            {/* Dashboard Bác sĩ */}
            {user.Role === 'Doctor' && <DoctorDashboard user={user} />}

            {/* Hiện Dashboard Bệnh nhân */}
            {(user.Role === 'Patient' || !user.Role) && <PatientDashboard user={user} />}
            
            {user.Role === 'Admin' && <h1>Chào Admin (Tính năng đang phát triển)</h1>}
        </div>
    );
};

export default Dashboard;