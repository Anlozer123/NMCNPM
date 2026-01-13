import React from "react";
import { NavLink } from "react-router-dom"; 
import {
  FaHome,
  FaCalendarPlus,
  FaComments,
  FaPrescriptionBottleAlt,
  // FaStethoscope, <--- XÓA hoặc Comment dòng này vì không dùng nữa
} from "react-icons/fa";
import "./PatientSidebar.css";

const PatientSidebar = () => {
  return (
    <aside className="ps-sidebar">
      {/* 1. Logo & Tên bệnh viện (Style mới) */}
      <div className="ps-logo-section">
        {/* Đã xóa FaStethoscope */}
        <span className="ps-brand-name">Tâm Anh</span>
      </div>

      {/* 2. Danh sách Menu điều hướng */}
      <nav className="ps-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaHome className="ps-icon" />
              <span>Tổng quan</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/appointment" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaCalendarPlus className="ps-icon" />
              <span>Đặt lịch khám</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/request-consultation" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaComments className="ps-icon" />
              <span>Tư vấn</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/prescription" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaPrescriptionBottleAlt className="ps-icon" />
              <span>Đơn thuốc</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default PatientSidebar;