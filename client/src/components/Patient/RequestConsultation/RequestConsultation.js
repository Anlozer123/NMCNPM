import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaComments, 
  FaUpload,
  FaExclamationCircle,
  FaStethoscope
} from "react-icons/fa";
import PatientSidebar from "../Sidebar/PatientSidebar"; 
import UserDropdown from "../UserDropdown/UserDropdown"; // Import Dropdown menu
import "./RequestConsultation.css";

const RequestConsultation = () => {
  const navigate = useNavigate();

  // State form
  const [formData, setFormData] = useState({
    department: "",
    urgency: "",
    symptoms: "",
    file: null
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem("consultation_draft");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.department || !formData.urgency || !formData.symptoms) {
      alert("Vui lòng điền đầy đủ thông tin (*)"); return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập API
      alert("Gửi yêu cầu thành công!");
      localStorage.removeItem("consultation_draft");
      navigate("/dashboard");
    } catch (error) {
      const draftData = { ...formData, file: null };
      localStorage.setItem("consultation_draft", JSON.stringify(draftData));
      alert("Lỗi kết nối! Đã lưu nháp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Sử dụng Layout chuẩn Dashboard
    <div className="pd-layout">
      {/* 1. Sidebar */}
      <div className="pd-sidebar-container">
        <PatientSidebar />
      </div>

      {/* 2. Main Content */}
      <div className="pd-main-content">
        
        {/* HEADER: Tiêu đề + Dropdown */}
        <header className="pd-header">
          <h2 className="header-title">TƯ VẤN TRỰC TUYẾN</h2>
          <UserDropdown />
        </header>

        {/* BODY: Nội dung cuộn */}
        <div className="pd-body-scroll">
    
          <div className="form-card">
            {/* Section Header */}
            <div className="form-section-header">
              <FaComments className="section-icon" />
              <h3>Thông tin tư vấn</h3>
            </div>
            <p className="section-desc">Mô tả triệu chứng và tình trạng của bạn để bác sĩ có thể tư vấn chính xác</p>

            {/* Field: Chuyên khoa */}
            <div className="form-group">
              <label>
                 <FaStethoscope className="input-icon"/> 
                 <span>Chuyên khoa cần tư vấn</span>
              </label>
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
              <label>
                  <FaExclamationCircle className="input-icon"/> 
                  <span>Mức độ khẩn cấp</span>
              </label>
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
                placeholder="Mô tả chi tiết các triệu chứng, thời gian bắt đầu..."
              />
              <span className="helper-text">Càng chi tiết càng giúp bác sĩ tư vấn chính xác hơn</span>
            </div>

            {/* Field: Đính kèm hình ảnh */}
            <div className="form-group">
              <label>
                  <FaUpload className="input-icon"/> 
                  <span>Đính kèm hình ảnh/tài liệu (tùy chọn)</span>
              </label>
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

            {/* Actions */}
            <div className="form-actions">
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi yêu cầu"}
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

export default RequestConsultation;