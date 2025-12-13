import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaLink,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingCart,
  FaStethoscope
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; // <--- Import Component Sidebar dùng chung
import "./Prescription.css";

const Prescription = () => {
  const navigate = useNavigate();
  
  // Giả lập thông tin user
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Nguyễn Văn X" };

  // --- STATE DỮ LIỆU (GIỮ NGUYÊN) ---
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

  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(mockPrescriptions[0].id);
  const [shippingInfo, setShippingInfo] = useState({
    address: "123 Đường ABC, Quận XYZ, TP. HCM",
    phone: "0912345678",
    deliveryTime: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentPrescription = mockPrescriptions.find(p => p.id === selectedPrescriptionId) || mockPrescriptions[0];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };
  const handleSubmit = () => {
    // Validate cơ bản
    if (!shippingInfo.deliveryTime || !paymentMethod) {
      alert("Vui lòng chọn thời gian giao hàng và phương thức thanh toán!");
      return;
    }
    if (!isConfirmed) {
      alert("Vui lòng xác nhận đơn thuốc!");
      return;
    }
    
    // THAY ĐỔI Ở ĐÂY: Thay vì Alert, ta điều hướng sang trang Billing
    // Truyền state bao gồm thông tin đơn thuốc và phí ship (giả lập 30k)
    navigate("/billing", { 
      state: { 
        prescription: currentPrescription, 
        shippingInfo: shippingInfo,
        shippingFee: 30000 
      } 
    });
  };

  return (
    <div className="layout-container">
      {/* --- TOP HEADER --- */}
      <header className="top-header">
        <div className="logo-section" onClick={() => navigate("/dashboard")} style={{cursor: 'pointer'}}>
          <FaStethoscope className="logo-icon" />
          <span className="brand-name">MediCare Hospital</span>
        </div>
        <div className="user-section">
          <span className="user-name">{user.FullName}</span>
          <button className="header-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </header>

      <div className="body-container">
        {/* --- SỬ DỤNG SIDEBAR DÙNG CHUNG --- */}
        <PatientSidebar />
        {/* ---------------------------------- */}

        {/* --- MAIN CONTENT --- */}
        <main className="main-content-area">
          <div className="page-header">
            <h1>Đặt đơn thuốc</h1>
            <p>UC001: Online Prescription Ordering - Đặt thuốc theo đơn bác sĩ</p>
          </div>

          <div className="prescription-card">
            
            {/* 1. Chọn đơn thuốc */}
            <div className="form-section">
              <div className="section-header-group">
                <FaLink className="section-icon icon-teal" /> 
                <div>
                  <h3>Chọn đơn thuốc</h3>
                  <p className="sub-text">Chọn đơn thuốc đã được bác sĩ kê để đặt hàng</p>
                </div>
              </div>
              
              <div className="form-group">
                <label>Đơn thuốc của bạn</label>
                <select 
                  value={selectedPrescriptionId}
                  onChange={(e) => setSelectedPrescriptionId(e.target.value)}
                  className="form-control"
                >
                  {mockPrescriptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="medicine-summary-box">
                <h4>Chi tiết đơn thuốc</h4>
                <div className="medicine-list">
                  {currentPrescription.medicines.map((med, index) => (
                    <div key={index} className="medicine-item">
                      <span className="med-name">{med.name}</span>
                      <span className="med-qty">x{med.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="divider"></div>
                <div className="total-row">
                  <span>Tổng cộng:</span>
                  <span className="total-price">{currentPrescription.total.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>

            {/* 2. Giao hàng */}
            <div className="form-section mt-40">
              <div className="section-header-group">
                <FaMapMarkerAlt className="section-icon icon-blue" />
                <h3>Thông tin giao hàng</h3>
              </div>

              <div className="form-group">
                <label>Địa chỉ giao hàng</label>
                <input 
                  type="text" 
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại liên hệ</label>
                <input 
                  type="text" 
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Thời gian giao hàng mong muốn</label>
                <select 
                  name="deliveryTime"
                  value={shippingInfo.deliveryTime}
                  onChange={handleInputChange}
                  className="form-control"
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
                  className="form-control textarea"
                ></textarea>
              </div>
            </div>

            {/* 3. Thanh toán */}
            <div className="form-section mt-40">
              <div className="section-header-group">
                <FaCreditCard className="section-icon icon-blue" />
                <h3>Phương thức thanh toán</h3>
              </div>

              <div className="form-group">
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-control"
                >
                  <option value="">Chọn phương thức thanh toán</option>
                  <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                  <option value="banking">Chuyển khoản ngân hàng</option>
                  <option value="momo">Ví MoMo</option>
                </select>
              </div>

              <div className="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="confirm" 
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                />
                <label htmlFor="confirm">Tôi xác nhận đơn thuốc đã được bác sĩ kê và muốn đặt hàng</label>
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={handleSubmit}>
                  <FaShoppingCart /> Tiến hành thanh toán
                </button>
                <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                  Hủy
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Prescription;