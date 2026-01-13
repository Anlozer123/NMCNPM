import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CustomCalendar.css";

const CustomCalendar = ({ selectedDate, onChange, onClose }) => {
  const today = new Date();
  
  // State quản lý tháng/năm đang xem trên lịch (View Mode)
  const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); 

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // --- LOGIC MỚI: Tạo danh sách năm để user chọn ---
  const generateYears = () => {
    const years = [];
    const currentY = new Date().getFullYear();
    // Tạo danh sách từ năm 1900 đến năm hiện tại + 10 năm
    for (let i = currentY + 10; i >= 1850; i--) {
      years.push(i);
    }
    return years;
  };

  const yearsList = generateYears();

  // --- LOGIC MỚI: Xử lý khi user chọn từ dropdown ---
  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(new Date(currentYear, newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate(new Date(newYear, currentMonth, 1));
  };

  // Logic cũ: Next/Prev tháng
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  
  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentYear, currentMonth, day);
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    
    onChange(`${yyyy}-${mm}-${dd}`);
    onClose();
  };

  const renderDays = () => {
    const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
    const startDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      let isSelected = false;
      if (selectedDate) {
        const sDate = new Date(selectedDate);
        isSelected = 
          sDate.getDate() === i && 
          sDate.getMonth() === currentMonth && 
          sDate.getFullYear() === currentYear;
      }

      const isToday = 
        today.getDate() === i && 
        today.getMonth() === currentMonth && 
        today.getFullYear() === currentYear;

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
    <div className="calendar-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={handlePrevMonth}>
          <FaChevronLeft size={12}/>
        </button>
        
        {/* THAY ĐỔI Ở ĐÂY: Dùng Select thay vì Span */}
        <div className="calendar-controls">
          <select 
            value={currentMonth} 
            onChange={handleMonthChange}
            className="calendar-select month-select"
          >
            {monthNames.map((name, index) => (
              <option key={index} value={index}>{name}</option>
            ))}
          </select>

          <select 
            value={currentYear} 
            onChange={handleYearChange}
            className="calendar-select year-select"
          >
            {yearsList.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
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