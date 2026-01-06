import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage'; 
import Login from './Login';        
import Dashboard from './Dashboard'; 
import Register from './Register';
// XÓA HOẶC COMMENT DÒNG DƯỚI ĐÂY:
// import DoctorAppointments from './components/DoctorAppointments'; 

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
        
        {/* Dashboard mặc định */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Trang Lịch khám: Gọi qua Dashboard và truyền tin hiệu activeView */}
        <Route 
          path="/doctor/appointments" 
          element={<Dashboard activeView="appointments" />} 
        />

        {/* --- THÊM MỚI: Route cho chức năng Xem hồ sơ (UC005) --- */}
        <Route path="/patient-profile/:id" element={<Dashboard activeView="patient-detail" />} />

        {/* --- THÊM MỚI: Route cho chức năng Tư vấn trực tuyến (UC008) --- */}
        {/* URL: http://localhost:3000/online-consultation */}
        <Route path="/online-consultation" element={<Dashboard activeView="online-consultation" />} />

      </Routes>
    </Router>
  );
}

export default App;