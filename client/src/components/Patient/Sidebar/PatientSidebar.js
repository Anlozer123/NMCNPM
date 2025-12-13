import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarPlus, // Icon Đặt lịch (Dấu cộng)
  FaCalendarAlt,  // Icon Quản lý lịch (Cuốn lịch)
  FaComments,
  FaFilePrescription,
  FaCalendarCheck, // Icon cho Quản lý lịch hẹn
  FaPrescriptionBottle
} from "react-icons/fa";
import "./PatientSidebar.css"; // Dùng chung CSS của Sidebar cũ

const PatientSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook này giúp lấy đường dẫn hiện tại

  // Hàm kiểm tra active
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <aside className="sidebar-nav">
      <ul>
        {/* 1. Trang chủ */}
        <li 
          className={isActive("/dashboard")} 
          onClick={() => navigate("/dashboard")}
        >
          <FaHome /> Trang chủ
        </li>

        {/* 2. Đặt lịch khám (UC003) */}
        <li 
          className={isActive("/appointment")} 
          onClick={() => navigate("/appointment")}
        >
          <FaCalendarPlus /> Đặt lịch khám
        </li>

        {/* 3. MỤC MỚI: Quản lý lịch hẹn (UC List) */}
        <li 
          className={isActive("/my-appointments")} 
          onClick={() => navigate("/my-appointments")}
        >
          <FaCalendarCheck /> Quản lý lịch hẹn
        </li>

        {/* 4. Tư vấn */}
        <li 
          className={isActive("/request-consultation")} 
          onClick={() => navigate("/request-consultation")}
        >
          <FaComments /> Tư vấn
        </li>

        {/* 5. Đơn thuốc */}
        <li 
          className={isActive("/prescription")} 
          onClick={() => navigate("/prescription")}
        >
          <FaFilePrescription /> Đơn thuốc
        </li>
      </ul>
    </aside>
  );
};

export default PatientSidebar;