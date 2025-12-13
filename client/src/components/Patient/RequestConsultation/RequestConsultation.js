import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaComments, 
  FaSignOutAlt, 
  FaUpload,
  FaExclamationCircle,
  FaStethoscope
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; // <--- Import Sidebar dùng chung
import "./RequestConsultation.css";

const RequestConsultation = () => {
  const navigate = useNavigate();
  
  // Giả lập thông tin user
  const user = JSON.parse(localStorage.getItem("user")) || { FullName: "Nguyễn Văn X" };

  // State quản lý form
  const [formData, setFormData] = useState({
    department: "",
    urgency: "",
    symptoms: "",
    file: null
  });

  const [loading, setLoading] = useState(false);

  // Load bản nháp nếu có
  useEffect(() => {
    const savedDraft = localStorage.getItem("consultation_draft");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý file upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Xử lý gửi yêu cầu
  const handleSubmit = async () => {
    if (!formData.department || !formData.urgency || !formData.symptoms) {
      alert("Vui lòng điền đầy đủ các trường thông tin bắt buộc (Chuyên khoa, Mức độ, Triệu chứng).");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const isNetworkError = Math.random() < 0.1; 
          if (isNetworkError) reject(new Error("Network Error"));
          else resolve();
        }, 1500);
      });

      alert("Gửi yêu cầu tư vấn thành công! Bác sĩ sẽ phản hồi sớm.");
      localStorage.removeItem("consultation_draft");
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      const draftData = { ...formData, file: null };
      localStorage.setItem("consultation_draft", JSON.stringify(draftData));
      alert("Lỗi kết nối! Hệ thống đã lưu bản nháp, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-container">
      {/* Header */}
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

        {/* Main Content Area */}
        <main className="main-content-area">
          <div className="page-title-group">
            <h1>Yêu cầu tư vấn bác sĩ</h1>
            <p className="subtitle">UC002: Request Doctor Consultation - Gửi yêu cầu tư vấn trực tuyến</p>
          </div>

          <div className="form-card">
            {/* Section: Thông tin tư vấn */}
            <div className="form-section-header">
              <FaComments className="section-icon" />
              <h3>Thông tin tư vấn</h3>
            </div>
            <p className="section-desc">Mô tả triệu chứng và tình trạng của bạn để bác sĩ có thể tư vấn chính xác</p>

            {/* Field: Chuyên khoa */}
            <div className="form-group">
              <label><FaStethoscope className="input-icon"/> Chuyên khoa cần tư vấn</label>
              <select name="department" value={formData.department} onChange={handleChange} className="form-control">
                <option value="">Chọn chuyên khoa</option>
                <option value="General">Đa khoa</option>
                <option value="Cardiology">Tim mạch</option>
                <option value="Dermatology">Da liễu</option>
                <option value="Pediatrics">Nhi khoa</option>
              </select>
            </div>

            {/* Field: Mức độ khẩn cấp */}
            <div className="form-group">
              <label><FaExclamationCircle className="input-icon"/> Mức độ khẩn cấp</label>
              <select name="urgency" value={formData.urgency} onChange={handleChange} className="form-control">
                <option value="">Chọn mức độ</option>
                <option value="Low">Thấp - Cần tư vấn thông thường</option>
                <option value="Medium">Trung bình - Có triệu chứng khó chịu</option>
                <option value="High">Cao - Cần phản hồi gấp</option>
              </select>
            </div>

            {/* Field: Mô tả triệu chứng */}
            <div className="form-group">
              <label>Mô tả triệu chứng</label>
              <textarea 
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                className="form-control textarea-field"
                placeholder="Mô tả chi tiết các triệu chứng, thời gian bắt đầu, mức độ nghiêm trọng..."
              />
              <span className="helper-text">Càng chi tiết càng giúp bác sĩ tư vấn chính xác hơn</span>
            </div>

            {/* Field: Đính kèm hình ảnh */}
            <div className="form-group">
              <label><FaUpload className="input-icon"/> Đính kèm hình ảnh/tài liệu (tùy chọn)</label>
              <div className="upload-box">
                <input type="file" id="file-upload" onChange={handleFileChange} hidden />
                <label htmlFor="file-upload" className="upload-label">
                  <FaUpload size={24} className="upload-icon-center"/>
                  <span>
                    {formData.file ? formData.file.name : "Nhấn để tải lên hình ảnh hoặc tài liệu"}
                  </span>
                  <small>JPG, PNG, PDF (tối đa 10MB)</small>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
              </button>
              <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                Hủy
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestConsultation;