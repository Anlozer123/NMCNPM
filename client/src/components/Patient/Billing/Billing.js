import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCreditCard, FaLock, FaSignOutAlt, FaStethoscope } from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import "./Billing.css";

const Billing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy dữ liệu được truyền từ trang Prescription
  // Nếu không có dữ liệu (truy cập trực tiếp), dùng dữ liệu giả định
  const { prescription, shippingFee } = location.state || {
    prescription: {
      medicines: [
        { name: "Paracetamol 500mg", qty: "30 viên", price: 150000 },
        { name: "Amoxicillin 250mg", qty: "20 viên", price: 200000 },
        { name: "Vitamin C 1000mg", qty: "15 viên", price: 100000 },
      ],
      total: 450000
    },
    shippingFee: 30000
  };

  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Nguyễn Văn X" };
  const grandTotal = prescription.total + shippingFee;

  // Mock state cho form thẻ
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "1234 5678 9012 3456",
    cardName: "NGUYEN VAN A",
    expiry: "",
    cvv: ""
  });

  const handlePayment = () => {
    // Logic xử lý thanh toán (API call) sẽ đặt ở đây
    // Sau khi thành công, chuyển hướng sang trang BillingSuccess
    navigate("/billing-success");
  };

  return (
    <div className="layout-container">
       {/* Header giữ nguyên để đồng bộ layout */}
       <header className="top-header">
        <div className="logo-section">
          <FaStethoscope className="logo-icon" />
          <span>MediCare Hospital</span>
        </div>
        <div className="user-section">
          <span className="user-name">{user.FullName}</span>
          <button className="header-logout-btn"><FaSignOutAlt /> Đăng xuất</button>
        </div>
      </header>

      <div className="body-container">
        <PatientSidebar />
        
        <main className="main-content-area">
          <div className="page-header">
            <h1>Thanh toán</h1>
            <p>UC016: Process Payment - Xác nhận và thanh toán đơn hàng</p>
          </div>

          <div className="billing-layout">
            
            {/* CỘT TRÁI: TÓM TẮT ĐƠN HÀNG */}
            <div className="billing-card order-summary-col">
              <h3>Tóm tắt đơn hàng</h3>
              <div style={{marginTop: '20px'}}>
                {prescription.medicines.map((med, idx) => (
                    // Giả lập giá từng món thuốc để khớp với hình ảnh (logic thực tế có thể khác)
                    <div className="summary-row" key={idx}>
                        <span>{med.name} x{med.qty.replace(/\D/g,'')}</span> 
                        {/* Lưu ý: Dữ liệu gốc chỉ có tổng tiền, ở đây ta giả lập hiển thị */}
                        <span>...</span> 
                    </div>
                ))}
                
                <div className="summary-row">
                    <span>Tổng tiền thuốc</span>
                    <span>{prescription.total.toLocaleString()} VNĐ</span>
                </div>
                
                <div className="summary-row">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString()} VNĐ</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                    <span>Tổng cộng</span>
                    <span>{grandTotal.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: FORM THANH TOÁN */}
            <div className="billing-card payment-form-col">
                <div className="payment-header">
                    <FaCreditCard color="#0089d0" /> Thông tin thanh toán
                </div>
                <p style={{marginBottom: '20px', fontSize: '14px', color: '#666'}}>
                    Nhập thông tin thẻ để hoàn tất thanh toán
                </p>

                <div className="card-input-group">
                    <label>Số thẻ</label>
                    <input 
                        type="text" 
                        className="card-input" 
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                    />
                </div>

                <div className="card-input-group">
                    <label>Tên trên thẻ</label>
                    <input 
                        type="text" 
                        className="card-input" 
                        value={cardInfo.cardName}
                        onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})}
                    />
                </div>

                <div className="row-inputs">
                    <div className="card-input-group" style={{flex: 1}}>
                        <label>Ngày hết hạn</label>
                        <input type="text" className="card-input" placeholder="MM/YY" />
                    </div>
                    <div className="card-input-group" style={{flex: 1}}>
                        <label>CVV</label>
                        <input type="text" className="card-input" placeholder="123" />
                    </div>
                </div>

                <button className="btn-confirm-payment" onClick={handlePayment}>
                    Xác nhận thanh toán
                </button>
            </div>

          </div>

          <div className="security-note">
             <FaLock style={{marginTop: '2px'}} />
             <div>
                <strong>Bảo mật thanh toán</strong> <br/>
                Thông tin thẻ của bạn được mã hóa và bảo mật theo tiêu chuẩn PCI DSS. Chúng tôi không lưu trữ thông tin thẻ của bạn.
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Billing;