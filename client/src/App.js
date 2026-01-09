import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage'; // Import trang chủ mới
import Login from './Login';       // Import trang đăng nhập 
import Dashboard from './Dashboard'; // Import Dashboard
import Register from './Register';
import DoctorAppointments from './components/DoctorAppointments';
import NurseDashboard from './NurseDashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<Homepage />} />

        {/* Trang Login */}
        <Route path="/login" element={<Login />} />

        {/* Đăng ký */}
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard sau khi đăng nhập */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Dashboard appointment của bác sĩ */}
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />

        {/* Route dẫn đến Dashboard Y tá */}
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />

        {/* Route dẫn đến Dashboard Quản trị viên */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;