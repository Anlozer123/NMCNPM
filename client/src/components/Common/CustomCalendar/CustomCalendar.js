import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CustomCalendar.css"; // Import CSS vừa tạo

const CustomCalendar = ({ selectedDate, onChange, onClose }) => {
  // Lấy ngày hiện tại làm mốc ban đầu
  const today = new Date();
  
  // State quản lý tháng/năm đang xem trên lịch
  const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // Danh sách tên tháng và thứ (Tiếng Anh như hình hoặc Tiếng Việt tùy bạn)
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Logic lấy số ngày trong tháng
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  
  // Logic lấy ngày đầu tiên của tháng bắt đầu từ thứ mấy (0=CN, 1=T2...)
  // Hình mẫu bắt đầu là Monday (Mo), nên ta cần xử lý index chút xíu
  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Chuyển đổi để Thứ 2 là index 0
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    // Tạo string định dạng YYYY-MM-DD để lưu vào form data
    // Lưu ý: tháng phải +1 vì getMonth trả về 0-11
    const selected = new Date(year, month, day);
    // Format YYYY-MM-DD thủ công để tránh lệch múi giờ
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    
    onChange(`${yyyy}-${mm}-${dd}`); // Trả value về component cha
    onClose(); // Đóng lịch sau khi chọn
  };

  // Render lưới ngày
  const renderDays = () => {
    const daysInCurrentMonth = getDaysInMonth(month, year);
    const startDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Các ô trống trước ngày mùng 1
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Các ngày trong tháng
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      // Kiểm tra xem ngày này có phải là ngày đang được chọn trong formData không
      let isSelected = false;
      if (selectedDate) {
        const sDate = new Date(selectedDate);
        isSelected = 
          sDate.getDate() === i && 
          sDate.getMonth() === month && 
          sDate.getFullYear() === year;
      }

      // Kiểm tra hôm nay
      const isToday = 
        today.getDate() === i && 
        today.getMonth() === month && 
        today.getFullYear() === year;

      days.push(
        <div
          key={i}
          className={`calendar-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-dropdown">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={handlePrevMonth}>
          <FaChevronLeft size={12}/>
        </button>
        <div className="calendar-title">
          <span>{monthNames[month]}</span>
          <span>{year}</span>
        </div>
        <button className="calendar-nav-btn" onClick={handleNextMonth}>
           <FaChevronRight size={12}/>
        </button>
      </div>

      <div className="calendar-weekdays">
        {weekDays.map((day) => (
          <div key={day} className="weekday-item">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {renderDays()}
      </div>
    </div>
  );
};

export default CustomCalendar;