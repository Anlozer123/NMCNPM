import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaHome,
  FaColumns,
  FaSignOutAlt
} from "react-icons/fa";
import "./UserDropdown.css"; 

const UserDropdown = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy thông tin user từ LocalStorage
  // Lưu ý: Dashboard dùng 'AvatarURL', nên ta ưu tiên lấy field đó
  const user = JSON.parse(sessionStorage.getItem("user")) || {
    FullName: "Khách",
    Role: "Bệnh nhân",
    AvatarURL: null 
  };

  // --- LOGIC TẠO CHỮ CÁI ĐẦU (Giống Dashboard) ---
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Xử lý click ra ngoài để đóng menu
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
    sessionStorage.removeItem("user");
    navigate("/login"); 
  };

  return (
    <div 
      className="user-dropdown-container" 
      ref={dropdownRef} 
      onClick={() => setShowMenu(!showMenu)}
    >
      {/* --- PHẦN AVATAR ĐÃ CẬP NHẬT --- */}
      {user.AvatarURL ? (
        <img 
            src={user.AvatarURL} 
            alt="avatar" 
            className="ud-avatar" 
        />
      ) : (
        <div className="ud-avatar-placeholder">
            {getInitials(user.FullName)}
        </div>
      )}
      {/* ------------------------------- */}

      <div className="ud-info">
        <span className="ud-name">{user.FullName}</span>
        <span className="ud-role">{user.Role || "Bệnh nhân"}</span>
      </div>
      
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