import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPills,
  FaChevronDown,
  FaCheckCircle // <--- Import icon tích xanh
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; 
import "./Prescription.css";

const Prescription = () => {
  const navigate = useNavigate();

  // --- MOCK DATA ---
  const mockPrescriptions = [
    {
      id: "DT001",
      label: "Đơn thuốc của BS. Thành",
      medicines: [
        { name: "Paracetamol 500mg", price: 20000, qty: 10, total: 200000 },
        { name: "Vitamin C 1000mg", price: 20000, qty: 10, total: 200000 },
      ],
      totalBill: 400000,
    },
    {
      id: "DT002",
      label: "Đơn thuốc của BS. Đạt",
      medicines: [
        { name: "Panadol Extra", price: 15000, qty: 10, total: 150000 },
        { name: "Siro ho Prospan", price: 80000, qty: 1, total: 80000 },
      ],
      totalBill: 230000,
    },
  ];

  // --- STATE ---
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(mockPrescriptions[0].id);
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    deliveryDate: "",
    note: "",
    paymentMethod: ""
  });
  
  // State quản lý Modal
  const [errorModal, setErrorModal] = useState({ show: false, title: "", message: "" });
  const [successModal, setSuccessModal] = useState(false); // <--- State Modal Thành công

  const currentPrescription = mockPrescriptions.find(p => p.id === selectedPrescriptionId) || mockPrescriptions[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- XỬ LÝ THANH TOÁN ---
  const handleSubmit = () => {
    // 1. Validate Bỏ trống
    if (!formData.address || !formData.phone || !formData.paymentMethod || !formData.deliveryDate) {
      setErrorModal({
        show: true,
        title: "THÔNG BÁO LỖI",
        message: "Các thông tin bắt buộc (*) không được để trống"
      });
      return;
    }

    // 2. Validate Ngày
    const selectedDate = new Date(formData.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        setErrorModal({
            show: true,
            title: "THÔNG BÁO LỖI",
            message: "Ngày chọn phải sau ngày hiện hành"
        });
        return;
    }

    // 3. THÀNH CÔNG: Hiển thị Modal thay vì Alert
    setSuccessModal(true);
  };

  // Hàm đóng modal thành công và có thể điều hướng đi nơi khác
  const closeSuccessModal = () => {
      setSuccessModal(false);
      // navigate("/dashboard"); // Bỏ comment dòng này nếu muốn quay về trang chủ
  };

  return (
    <div className="pd-layout">
      
      {/* --- ERROR MODAL --- */}
      {errorModal.show && (
        <div className="modal-overlay">
          <div className="error-modal">
            <h3 className="error-title">{errorModal.title}</h3>
            <p className="error-message">{errorModal.message}</p>
            <button 
                className="btn-retry" 
                onClick={() => setErrorModal({ show: false, title: "", message: "" })}
            >
                THỬ LẠI
            </button>
          </div>
        </div>
      )}

      {/* --- SUCCESS MODAL (MỚI) --- */}
      {successModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <FaCheckCircle className="success-icon-large" />
            <h3 className="success-title">ĐẶT HÀNG THÀNH CÔNG!</h3>
            <p className="success-message">
                Đơn thuốc của bạn đã được ghi nhận.<br/>
                Chúng tôi sẽ sớm liên hệ để giao hàng.
            </p>
            <button className="btn-success-modal" onClick={closeSuccessModal}>
                HOÀN TẤT
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="pd-sidebar-container">
        <PatientSidebar />
      </div>

      {/* Main Content */}
      <div className="pd-main-content">
        <header className="pd-header">
           <h2 className="header-title">ĐƠN THUỐC</h2> 
           <UserDropdown />
        </header>

        <div className="pd-body-scroll">
          
          <div className="prescription-main-card">
            
            {/* Select Đơn thuốc */}
            <div className="prescription-select-section">
                <label className="section-label-blue">
                    <FaPills className="icon-label" /> Đơn thuốc của bạn
                </label>
                <div className="custom-select-wrapper">
                    <select 
                        className="form-control-blue"
                        value={selectedPrescriptionId}
                        onChange={(e) => setSelectedPrescriptionId(e.target.value)}
                    >
                        {mockPrescriptions.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                </div>
            </div>

            <div className="prescription-grid-layout">
                
                {/* Form Column */}
                <div className="left-form-column">
                    <h3 className="section-title-red">
                        <FaMapMarkerAlt className="icon-label" /> Thông tin nhận hàng
                    </h3>

                    <div className="form-group">
                        <label>Địa chỉ giao hàng(*)</label>
                        <input 
                            type="text" 
                            name="address"
                            className="form-control" 
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại liên hệ(*)</label>
                        <input 
                            type="text" 
                            name="phone"
                            className="form-control" 
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Ngày giao hàng(*)</label>
                        <div className="input-with-icon">
                            <input 
                                type="date" 
                                name="deliveryDate"
                                className="form-control" 
                                value={formData.deliveryDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Ghi chú (tuỳ chọn)</label>
                        <input 
                            type="text" 
                            name="note"
                            className="form-control" 
                            value={formData.note}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phương thức thanh toán(*)</label>
                        <div className="custom-select-wrapper">
                            <select 
                                name="paymentMethod"
                                className="form-control"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                            >
                                <option value="">-- Chọn phương thức --</option>
                                <option value="cod">Thanh toán khi nhận hàng(COD)</option>
                                <option value="qr">Thanh toán bằng QR</option>
                            </select>
                            <FaChevronDown className="select-arrow-sm" />
                        </div>
                    </div>

                    <button className="btn-checkout" onClick={handleSubmit}>
                        Tiến hành thanh toán
                    </button>
                </div>

                {/* Bill Column */}
                <div className="right-bill-column">
                    <div className="bill-card">
                        <h3 className="bill-header">CHI TIẾT ĐƠN THUỐC</h3>
                        
                        <div className="bill-table-header">
                            <span>Tên thuốc/Đơn giá/Số lượng/Thành tiền</span>
                        </div>

                        <div className="bill-items-list">
                            {currentPrescription.medicines.map((med, idx) => (
                                <div key={idx} className="bill-item">
                                    <div className="item-name">{med.name}</div>
                                    <div className="item-details">
                                        <span>{med.price.toLocaleString()}</span>
                                        <span className="qty">{med.qty}</span>
                                        <span className="subtotal">{med.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bill-footer">
                            <span>Tổng tiền:</span>
                            <span className="total-amount">{currentPrescription.totalBill.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Prescription;