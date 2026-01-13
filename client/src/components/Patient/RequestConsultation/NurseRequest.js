import React, { useState } from 'react';
import { FaBell, FaCheckCircle } from 'react-icons/fa'; // [Thêm FaCheckCircle]
import './NurseRequest.css';

const NurseRequest = () => {
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 


  // const handleAddOption = (option) => {
  //   setNote((prev) => (prev ? `${prev}\n${option}` : option));
  // };

  const handleSubmit = async () => {
    if (!note.trim()) {
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const patientId = user ? user.PatientID : null;

      if (!patientId) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/patient/${patientId}/nurse-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: note })
      });

      if (response.ok) {
        setShowSuccessModal(true); 
        setNote(""); 
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nurse-request-wrapper">
      
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="error-modal">
            <h3 className="error-title">THÔNG BÁO LỖI</h3>
            <p className="error-message">Yêu cầu không được để trống</p>
            <button className="btn-retry" onClick={() => setShowErrorModal(false)}>THỬ LẠI</button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <FaCheckCircle className="success-icon-large" />
            <h3 className="success-title">GỬI THÀNH CÔNG!</h3>
            <p className="success-message">Điều dưỡng đã nhận được yêu cầu của bạn.</p>
            <button 
              className="btn-success-modal" 
              onClick={() => setShowSuccessModal(false)}
            >
              HOÀN TẤT
            </button>
          </div>
        </div>
      )}
      {/* -------------------------------------------------- */}

      <div className="nr-header-title">
        <FaBell className="nr-icon" />
        <h3>GỬI YÊU CẦU ĐẾN ĐIỀU DƯỠNG</h3>
      </div>

      <div className="nr-form-container">
        <label className="nr-label">GHI CHÚ YÊU CẦU (*)</label>
        
        <div className="nr-input-box">
          <textarea
            className="nr-textarea"
            placeholder="Nhập yêu cầu tại đây..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
          ></textarea>
        </div>
      </div>

      <button className="nr-submit-btn" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
      </button>
    </div>
  );
};

export default NurseRequest;