import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPills,
  FaChevronDown,
  FaCalendarAlt 
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; 

import CustomCalendar from "../../Common/CustomCalendar/CustomCalendar"; 
import "./Prescription.css";

const Prescription = () => {
  const navigate = useNavigate();

  // --- STATE DỮ LIỆU ---
  const [prescriptions, setPrescriptions] = useState([]); // Dữ liệu từ API
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState("");
  const [loading, setLoading] = useState(true);

  // --- STATE FORM ---
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    deliveryDate: "", 
    note: "",
    paymentMethod: ""
  });
  
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null); 
  const [errorModal, setErrorModal] = useState({ show: false, title: "", message: "" });

  // --- 1. LẤY DỮ LIỆU TỪ API ---
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // Lấy User từ LocalStorage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        const user = JSON.parse(storedUser);
        const patientId = user.PatientID;

        // Gọi API
        const response = await fetch(`http://localhost:5000/api/patient/${patientId}/prescriptions`);
        if (!response.ok) throw new Error("Không thể tải danh sách đơn thuốc");

        const data = await response.json();
        
        setPrescriptions(data);
        
        // Mặc định chọn đơn thuốc mới nhất nếu có dữ liệu
        if (data.length > 0) {
            setSelectedPrescriptionId(data[0].id);
            
            // Tự động điền số điện thoại từ thông tin user (nếu muốn tiện cho user)
            // setFormData(prev => ({ ...prev, phone: user.Phone || "" }));
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorModal({ show: true, title: "LỖI HỆ THỐNG", message: "Không thể tải dữ liệu đơn thuốc." });
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [navigate]);

  // --- Helper: Tìm đơn thuốc đang chọn ---
  // Lưu ý: data trả về ID là số (Int), value thẻ select là string -> dùng '==' thay vì '===' hoặc convert
  const currentPrescription = prescriptions.find(p => p.id == selectedPrescriptionId) || null;

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN (GIỮ NGUYÊN) ---
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

  const handleDateSelect = (date) => {
    setFormData({ ...formData, deliveryDate: date });
    setShowCalendar(false);
  };

  const formatDateDisplay = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return ""; 
    return date.toLocaleDateString('vi-VN');
  };

  const handleSubmit = () => {
    if (!currentPrescription) {
        setErrorModal({ show: true, title: "LỖI", message: "Vui lòng chọn đơn thuốc cần mua." });
        return;
    }

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
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        setErrorModal({ show: true, title: "THÔNG BÁO LỖI", message: "Ngày giao hàng phải từ hôm nay trở đi" });
        return;
    }

    navigate("/billing", { 
      state: { 
        prescription: currentPrescription, 
        shippingInfo: formData, 
        shippingFee: 50000 
      } 
    });
  };

  // --- RENDER ---
  if (loading) return <div className="pd-loading">Đang tải đơn thuốc...</div>;

  return (
    <div className="pd-layout">
      {/* ERROR MODAL */}
      {errorModal.show && (
        <div className="modal-overlay">
          <div className="error-modal">
            <h3 className="error-title">{errorModal.title}</h3>
            <p className="error-message">{errorModal.message}</p>
            <button className="btn-retry" onClick={() => setErrorModal({ show: false, title: "", message: "" })}>
                ĐÓNG
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
           <h2 className="header-title">ĐẶT THUỐC ONLINE</h2> 
           <UserDropdown />
        </header>

        <div className="pd-body-scroll">
          <div className="prescription-main-card">
            
            {/* Nếu không có đơn thuốc nào */}
            {prescriptions.length === 0 ? (
                <div className="empty-state">
                    <p>Bạn chưa có đơn thuốc nào trong hệ thống.</p>
                </div>
            ) : (
                <>
                {/* 1. Select Box chọn đơn thuốc */}
                <div className="prescription-select-section">
                    <label className="section-label-blue">
                        <FaPills className="icon-label" /> Chọn đơn thuốc cần mua:
                    </label>
                    <div className="custom-select-wrapper">
                        <select 
                            className="form-control-blue" 
                            value={selectedPrescriptionId} 
                            onChange={(e) => setSelectedPrescriptionId(e.target.value)}
                        >
                            {prescriptions.map(p => (
                                <option key={p.id} value={p.id}>{p.label}</option>
                            ))}
                        </select>
                        <FaChevronDown className="select-arrow" />
                    </div>
                </div>

                <div className="prescription-grid-layout">
                    {/* Left: Form Inputs */}
                    <div className="left-form-column">
                        <h3 className="section-title-red"><FaMapMarkerAlt className="icon-label" /> Thông tin nhận hàng</h3>
                        
                        <div className="form-group">
                            <label>Địa chỉ giao hàng(*)</label>
                            <input type="text" name="address" className="form-control" placeholder="Số nhà, tên đường, phường/xã..." value={formData.address} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại liên hệ(*)</label>
                            <input type="text" name="phone" className="form-control" placeholder="Ví dụ: 0912345678" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        
                        {/* Calendar */}
                        <div className="form-group" ref={calendarRef}>
                            <label>Ngày giao hàng(*)</label>
                            <div 
                                className="form-control date-input-trigger" 
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                <span className={formData.deliveryDate ? "text-dark" : "text-placeholder"}>
                                    {formData.deliveryDate ? formatDateDisplay(formData.deliveryDate) : "Chọn ngày nhận"}
                                </span>
                                <FaCalendarAlt className="calendar-icon-right" />
                            </div>
                            
                            {showCalendar && (
                                <div className="calendar-dropdown-container">
                                <CustomCalendar
                                    onClose={() => setShowCalendar(false)}
                                    onChange={handleDateSelect}
                                    value={formData.deliveryDate} />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Ghi chú (tuỳ chọn)</label>
                            <input type="text" name="note" className="form-control" placeholder="Lời nhắn cho shipper..." value={formData.note} onChange={handleInputChange} />
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
                                    <option value="qr">Thanh toán bằng QR / Chuyển khoản</option>
                                </select>
                                <FaChevronDown className="select-arrow-sm" />
                            </div>
                        </div>

                        <button className="btn-checkout" onClick={handleSubmit}>Tiến hành thanh toán</button>
                    </div>

                    {/* Right: Bill Preview */}
                    <div className="right-bill-column">
                        {currentPrescription && (
                            <div className="bill-card">
                                <h3 className="bill-header">CHI TIẾT: {currentPrescription.id}</h3>
                                <div className="bill-sub-header">Bác sĩ kê đơn: {currentPrescription.doctor}</div>
                                
                                <div className="bill-table-header"><span>Tên thuốc / Đơn giá / SL / Thành tiền</span></div>
                                <div className="bill-items-list">
                                    {currentPrescription.medicines.map((med, idx) => (
                                        <div key={idx} className="bill-item">
                                            <div className="item-name">{med.name}</div>
                                            <div className="item-details">
                                                <span>{med.price ? med.price.toLocaleString() : 0}</span>
                                                <span className="qty">x{med.qty}</span>
                                                <span className="subtotal">{med.total ? med.total.toLocaleString() : 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bill-footer">
                                    <span>Tạm tính:</span>
                                    <span className="total-amount">{currentPrescription.totalBill.toLocaleString()} VNĐ</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescription;