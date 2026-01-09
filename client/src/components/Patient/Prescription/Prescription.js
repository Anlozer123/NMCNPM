import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPills,
  FaChevronDown,
  FaCalendarAlt // Import thêm icon lịch
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; 
// ĐIỀU CHỈNH ĐƯỜNG DẪN IMPORT NÀY THEO CẤU TRÚC THỰC TẾ CỦA BẠN
import CustomCalendar from "../../Common/CustomCalendar/CustomCalendar"; 
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
    deliveryDate: "", // Sẽ lưu Date Object hoặc String ISO
    note: "",
    paymentMethod: ""
  });
  
  // State mới để quản lý việc hiển thị lịch
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null); // Ref để xử lý click outside

  const [errorModal, setErrorModal] = useState({ show: false, title: "", message: "" });

  const currentPrescription = mockPrescriptions.find(p => p.id === selectedPrescriptionId) || mockPrescriptions[0];

  // Xử lý click ra ngoài để đóng lịch
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm mới xử lý khi chọn ngày từ CustomCalendar
  const handleDateSelect = (date) => {
    setFormData({ ...formData, deliveryDate: date });
    setShowCalendar(false); // Đóng lịch sau khi chọn
  };

  // Helper function để hiển thị ngày đẹp hơn (dd/mm/yyyy)
  const formatDateDisplay = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return ""; // Check invalid date
    return date.toLocaleDateString('vi-VN'); // Format kiểu Việt Nam
  };

  const handleSubmit = () => {
    // 1. Validate
    if (!formData.address || !formData.phone || !formData.paymentMethod || !formData.deliveryDate) {
      setErrorModal({
        show: true,
        title: "THÔNG BÁO LỖI",
        message: "Các thông tin bắt buộc (*) không được để trống"
      });
      return;
    }

    const selectedDate = new Date(formData.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // So sánh ngày (lưu ý: CustomCalendar thường trả về thời gian cụ thể, nên cần reset time để so sánh chính xác)
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        setErrorModal({
            show: true,
            title: "THÔNG BÁO LỖI",
            message: "Ngày chọn phải sau ngày hiện hành"
        });
        return;
    }

    // 2. Chuyển hướng sang Billing với dữ liệu
    navigate("/billing", { 
      state: { 
        prescription: currentPrescription, 
        shippingInfo: formData, 
        shippingFee: 50000 
      } 
    });
  };

  return (
    <div className="pd-layout">
      {/* ERROR MODAL */}
      {errorModal.show && (
        <div className="modal-overlay">
          <div className="error-modal">
            <h3 className="error-title">{errorModal.title}</h3>
            <p className="error-message">{errorModal.message}</p>
            <button className="btn-retry" onClick={() => setErrorModal({ show: false, title: "", message: "" })}>
                THỬ LẠI
            </button>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div className="pd-sidebar-container">
        <PatientSidebar />
      </div>

      <div className="pd-main-content">
        <header className="pd-header">
           <h2 className="header-title">ĐƠN THUỐC</h2> 
           <UserDropdown />
        </header>

        <div className="pd-body-scroll">
          <div className="prescription-main-card">
            
            <div className="prescription-select-section">
                <label className="section-label-blue">
                    <FaPills className="icon-label" /> Đơn thuốc của bạn
                </label>
                <div className="custom-select-wrapper">
                    <select className="form-control-blue" value={selectedPrescriptionId} onChange={(e) => setSelectedPrescriptionId(e.target.value)}>
                        {mockPrescriptions.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                </div>
            </div>

            <div className="prescription-grid-layout">
                {/* Form Inputs */}
                <div className="left-form-column">
                    <h3 className="section-title-red"><FaMapMarkerAlt className="icon-label" /> Thông tin nhận hàng</h3>
                    
                    <div className="form-group">
                        <label>Địa chỉ giao hàng(*)</label>
                        <input type="text" name="address" className="form-control" value={formData.address} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại liên hệ(*)</label>
                        <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    
                    {/* --- PHẦN THAY THẾ CALENDAR --- */}
                    <div className="form-group" ref={calendarRef}>
                        <label>Ngày giao hàng(*)</label>
                        <div 
                            className="form-control date-input-trigger" 
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            <span className={formData.deliveryDate ? "text-dark" : "text-placeholder"}>
                                {formData.deliveryDate ? formatDateDisplay(formData.deliveryDate) : "dd/mm/yyyy"}
                            </span>
                            <FaCalendarAlt className="calendar-icon-right" />
                        </div>
                        
                        {/* Dropdown Calendar */}
                  {showCalendar && (
                    <div className="calendar-dropdown-container">
                      <CustomCalendar
                        onClose={() => setShowCalendar(false)}
                        onChange={handleDateSelect}
                        value={formData.deliveryDate} />
                    </div>
                  )}
                    </div>
                    {/* ------------------------------- */}

                    <div className="form-group">
                        <label>Ghi chú (tuỳ chọn)</label>
                        <input type="text" name="note" className="form-control" value={formData.note} onChange={handleInputChange} />
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
                                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                                <option value="qr">Thanh toán bằng QR</option>
                            </select>
                            <FaChevronDown className="select-arrow-sm" />
                        </div>
                    </div>

                    <button className="btn-checkout" onClick={handleSubmit}>Tiến hành thanh toán</button>
                </div>

                {/* Bill Preview */}
                <div className="right-bill-column">
                    <div className="bill-card">
                        <h3 className="bill-header">CHI TIẾT ĐƠN THUỐC</h3>
                        <div className="bill-table-header"><span>Tên thuốc/Đơn giá/Số lượng/Thành tiền</span></div>
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