import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaHome,
  FaColumns,
  FaSignOutAlt
} from "react-icons/fa";
import "./UserDropdown.css"; // Import file CSS riêng

const UserDropdown = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy thông tin user từ LocalStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    FullName: "Khách",
    Role: "Bệnh nhân",
    Avatar: "https://i.pravatar.cc/150?img=11" // Ảnh mặc định nếu không có
  };

  // Xử lý click ra ngoài để đóng menu (UX tốt hơn)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login"); 
  };

  return (
    <div 
      className="user-dropdown-container" 
      ref={dropdownRef} 
      onClick={() => setShowMenu(!showMenu)}
    >
      {/* Avatar & Tên */}
      <img 
        src={user.Avatar || "https://i.pravatar.cc/150?img=11"} 
        alt="avatar" 
        className="ud-avatar" 
      />
      <div className="ud-info">
        <span className="ud-name">{user.FullName}</span>
        <span className="ud-role">{user.Role || "Bệnh nhân"}</span>
      </div>
      
      {/* Icon mũi tên */}
      <FaChevronDown className={`ud-arrow ${showMenu ? 'rotate' : ''}`} />

      {/* Menu thả xuống */}
      {showMenu && (
        <div className="ud-menu">
          <div className="ud-item" onClick={(e) => {
             e.stopPropagation();
             navigate("/");
          }}>
             <FaHome className="ud-icon" /> Trang chủ
          </div>
          
          <div className="ud-item" onClick={(e) => {
             e.stopPropagation();
             navigate("/dashboard");
          }}>
             <FaColumns className="ud-icon" /> Dashboard
          </div>
          
          <div className="ud-divider"></div>
          
          <div className="ud-item ud-logout" onClick={(e) => {
             e.stopPropagation();
             handleLogout();
          }}>
             <FaSignOutAlt className="ud-icon" /> Đăng xuất
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;