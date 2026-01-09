import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaQrcode, FaTimes } from "react-icons/fa"; 
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; 
import "./Billing.css";

const Billing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Phùng Thanh Độ" };
  
  // --- STATE MODALS ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Lấy dữ liệu
  const { prescription, shippingInfo, shippingFee } = location.state || {
    prescription: { medicines: [], totalBill: 0 },
    shippingInfo: { 
        address: "", phone: "", deliveryDate: "", note: "", paymentMethod: "cod" 
    },
    shippingFee: 0
  };

  const finalTotal = (prescription.totalBill || 0) + shippingFee;

  // --- XỬ LÝ NÚT XÁC NHẬN ---
  const handleConfirm = () => {
    if (shippingInfo.paymentMethod === 'qr') {
        setShowQR(true);
    } else {
        setShowSuccess(true);
    }
  };

  const handleFinishQR = () => {
      setShowQR(false);
      setShowSuccess(true);
  };

  const closeSuccess = () => {
      setShowSuccess(false);
      navigate("/dashboard");
  };

  const qrCodeUrl = `https://img.vietqr.io/image/MB-0000123456789-compact.png?amount=${finalTotal}&addInfo=Thanh toan don thuoc&accountName=MEDICARE`;

  return (
    <div className="pd-layout">
      
      {/* QR MODAL */}
      {showQR && (
        <div className="modal-overlay">
          <div className="qr-modal">
            <div className="qr-header">
                <h3>THANH TOÁN QR</h3>
                <FaTimes className="close-icon" onClick={() => setShowQR(false)} />
            </div>
            <div className="qr-body">
                <p className="qr-instruct">Vui lòng quét mã bên dưới để thanh toán</p>
                <div className="qr-image-box">
                    <img src={qrCodeUrl} alt="VietQR" className="qr-img-real" />
                </div>
                <div className="qr-amount-display">
                    Số tiền: <span>{finalTotal.toLocaleString()} VNĐ</span>
                </div>
            </div>
            <button className="btn-qr-paid" onClick={handleFinishQR}>
                <FaCheckCircle /> TÔI ĐÃ THANH TOÁN
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="success-modal">
            <FaCheckCircle className="success-icon-large" />
            <h3 className="success-title">THANH TOÁN THÀNH CÔNG!</h3>
            <p className="success-message">
                Đơn hàng của bạn đã được xác nhận.<br/>
                Cảm ơn bạn đã sử dụng dịch vụ của MediCare.
            </p>
            <button className="btn-success-modal" onClick={closeSuccess}>
                VỀ TRANG CHỦ
            </button>
          </div>
        </div>
      )}

      <div className="pd-sidebar-container">
        <PatientSidebar />
      </div>

      <div className="pd-main-content">
        <header className="pd-header">
           <h2 className="header-title">THANH TOÁN ĐƠN THUỐC</h2> 
           <UserDropdown />
        </header>

        <div className="pd-body-scroll">
          <h3 className="section-heading">XÁC NHẬN THÔNG TIN THANH TOÁN</h3>
          <div className="billing-container-card">
            <div className="billing-grid">
                
                {/* --- CỘT TRÁI: CHI TIẾT HÓA ĐƠN (Đã sửa layout) --- */}
                <div className="bill-col left-col">
                    <h4 className="col-title">CHI TIẾT HOÁ ĐƠN</h4>
                    
                    {/* Header Cột */}
                    <div className="grid-header">
                        <span className="g-name">Tên thuốc</span>
                        <span className="g-price">Đơn giá</span>
                        <span className="g-qty">SL</span>
                        <span className="g-total">Thành tiền</span>
                    </div>

                    <div className="bill-list-scroll">
                        {prescription.medicines && prescription.medicines.map((item, idx) => (
                            <div key={idx} className="grid-row">
                                <div className="g-name">{item.name}</div>
                                <div className="g-price">{item.price?.toLocaleString()}</div>
                                <div className="g-qty">{item.qty}</div>
                                <div className="g-total">{item.total?.toLocaleString()}</div>
                            </div>
                        ))}
                        
                        {/* Dòng phí vận chuyển */}
                        <div className="grid-row fee-row">
                            <div className="g-name">Phí vận chuyển</div>
                            <div className="g-price"></div>
                            <div className="g-qty"></div>
                            <div className="g-total">{shippingFee.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="bill-total-area">
                        <span>Tổng tiền:</span>
                        <span className="total-number">{finalTotal.toLocaleString()}</span>
                    </div>
                </div>

                {/* Cột Phải: Thông tin */}
                <div className="bill-col right-col">
                    <h4 className="col-title">THÔNG TIN THANH TOÁN</h4>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Họ và tên:</span>
                            <span className="info-val">{user.FullName}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Địa chỉ:</span>
                            <span className="info-val">{shippingInfo.address}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Số điện thoại:</span>
                            <span className="info-val">{shippingInfo.phone}</span>
                        </div>
                        <div className="info-item payment-method-row">
                            <span className="info-label">Phương thức thanh toán:</span>
                            <span className="info-val" style={{color: '#2563eb', fontWeight: 'bold'}}>
                                {shippingInfo.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 
                                 shippingInfo.paymentMethod === 'qr' ? 'Thanh toán bằng QR (Chuyển khoản)' : shippingInfo.paymentMethod}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="billing-actions">
                <button className="btn-confirm-billing" onClick={handleConfirm}>
                    {shippingInfo.paymentMethod === 'qr' ? "Thanh toán ngay" : "Xác nhận đơn hàng"}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;