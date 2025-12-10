import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarPlus,
  FaNotesMedical,
  FaUserMd,
  FaSignOutAlt,
  FaLink,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingCart
} from "react-icons/fa";
import "./Prescription.css"; // Import file CSS riêng

const Prescription = () => {
  const navigate = useNavigate();
  
  // Giả lập thông tin user (thực tế sẽ lấy từ Context hoặc LocalStorage)
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Nguyễn Văn X" };

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  
  // 1. Dữ liệu giả lập các đơn thuốc (Mock Data)
  const mockPrescriptions = [
    {
      id: "DT001",
      label: "Đơn thuốc #001 - Bác sĩ Nguyễn Văn A - 2025-01-15 (3 loại thuốc)",
      medicines: [
        { name: "Paracetamol 500mg", qty: "30 viên" },
        { name: "Amoxicillin 250mg", qty: "20 viên" },
        { name: "Vitamin C 1000mg", qty: "15 viên" },
      ],
      total: 450000,
    },
    {
      id: "DT002",
      label: "Đơn thuốc #002 - Bác sĩ Trần Thị B - 2024-12-20 (2 loại thuốc)",
      medicines: [
        { name: "Panadol Extra", qty: "10 viên" },
        { name: "Siro ho Prospan", qty: "1 chai" },
      ],
      total: 210000,
    },
  ];

  // 2. State cho form
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(mockPrescriptions[0].id);
  const [shippingInfo, setShippingInfo] = useState({
    address: "123 Đường ABC, Quận XYZ, TP. HCM",
    phone: "0912345678",
    deliveryTime: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Lấy đơn thuốc đang chọn hiện tại
  const currentPrescription = mockPrescriptions.find(p => p.id === selectedPrescriptionId) || mockPrescriptions[0];

  // --- HÀM XỬ LÝ ---
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleSubmit = () => {
    if (!shippingInfo.deliveryTime || !paymentMethod) {
      alert("Vui lòng chọn thời gian giao hàng và phương thức thanh toán!");
      return;
    }
    if (!isConfirmed) {
      alert("Vui lòng xác nhận đơn thuốc!");
      return;
    }
    
    // Logic gọi API đặt hàng sẽ nằm ở đây
    alert(`Đặt hàng thành công đơn thuốc ${currentPrescription.id}!\nTổng tiền: ${currentPrescription.total.toLocaleString()} VNĐ`);
    navigate("/dashboard");
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR (Giữ nguyên từ Dashboard để đồng bộ) --- */}
      <div className="sidebar">
        <div className="profile-section">
          <div className="avatar-circle">
            {user.FullName ? user.FullName.charAt(0) : "P"}
          </div>
          <h3>{user.FullName}</h3>
          <p>Bệnh nhân</p>
        </div>
        <ul className="menu-list">
          <li onClick={() => navigate("/dashboard")}>
            <FaUserMd /> Tổng quan
          </li>
          <li onClick={() => navigate("/doctor/appointments")}>
            <FaCalendarPlus /> Đặt lịch khám
          </li>
          <li onClick={() => navigate("/medical-record")}>
            <FaNotesMedical /> Hồ sơ bệnh án
          </li>
          <li className="active"> {/* Active state */}
            <FaNotesMedical /> Đặt đơn thuốc
          </li>
          <li onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Đăng xuất
          </li>
        </ul>
      </div>

      {/* --- MAIN CONTENT (Phần chính theo UI Prototype) --- */}
      <div className="main-content prescription-page">
        <header className="page-header">
          <h2>Đặt đơn thuốc</h2>
          <p>UC001: Online Prescription Ordering - Đặt thuốc theo đơn bác sĩ</p>
        </header>

        <div className="prescription-content">
          
          {/* PHẦN 1: CHỌN ĐƠN THUỐC (Hình 1) */}
          <div className="card-section">
            <div className="section-title">
              <FaLink className="icon-green" /> 
              <h3>Chọn đơn thuốc</h3>
            </div>
            <p className="sub-text">Chọn đơn thuốc đã được bác sĩ kê để đặt hàng</p>
            
            <div className="form-group">
              <label>Đơn thuốc của bạn</label>
              <select 
                value={selectedPrescriptionId}
                onChange={(e) => setSelectedPrescriptionId(e.target.value)}
                className="form-input dropdown"
              >
                {mockPrescriptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="medicine-details-box">
              <h4>Chi tiết đơn thuốc</h4>
              <div className="medicine-list">
                {currentPrescription.medicines.map((med, index) => (
                  <div key={index} className="medicine-item">
                    <span>{med.name}</span>
                    <span className="qty">x{med.qty}</span>
                  </div>
                ))}
              </div>
              <div className="total-divider"></div>
              <div className="total-row">
                <span>Tổng cộng:</span>
                <span className="total-price">{currentPrescription.total.toLocaleString()} VNĐ</span>
              </div>
            </div>
          </div>

          {/* PHẦN 2: THÔNG TIN GIAO HÀNG (Hình 2) */}
          <div className="card-section mt-20">
            <div className="section-title">
              <FaMapMarkerAlt className="icon-blue" />
              <h3>Thông tin giao hàng</h3>
            </div>

            <div className="form-group">
              <label>Địa chỉ giao hàng</label>
              <input 
                type="text" 
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại liên hệ</label>
              <input 
                type="text" 
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Thời gian giao hàng mong muốn</label>
              <select 
                name="deliveryTime"
                value={shippingInfo.deliveryTime}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Chọn khung giờ</option>
                <option value="morning">Buổi sáng (8h - 12h)</option>
                <option value="afternoon">Buổi chiều (13h - 17h)</option>
                <option value="evening">Buổi tối (18h - 20h)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ghi chú (tùy chọn)</label>
              <textarea 
                name="note"
                value={shippingInfo.note}
                onChange={handleInputChange}
                placeholder="Ghi chú thêm cho người giao hàng..."
                className="form-input textarea"
              ></textarea>
            </div>
          </div>

          {/* PHẦN 3: THANH TOÁN & ACTION (Hình 2 - Cuối) */}
          <div className="card-section mt-20">
            <div className="section-title">
              <FaCreditCard className="icon-blue" />
              <h3>Phương thức thanh toán</h3>
            </div>

            <div className="form-group">
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-input"
              >
                <option value="">Chọn phương thức thanh toán</option>
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="banking">Chuyển khoản ngân hàng</option>
                <option value="momo">Ví MoMo</option>
              </select>
            </div>

            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="confirm" 
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
              <label htmlFor="confirm">Tôi xác nhận đơn thuốc đã được bác sĩ kê và muốn đặt hàng</label>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={handleSubmit}>
                <FaShoppingCart /> Tiến hành thanh toán
              </button>
              <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                Hủy
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Prescription;