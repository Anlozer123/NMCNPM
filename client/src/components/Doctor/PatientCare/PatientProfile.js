import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './PatientProfile.css';

// --- IMPORT CÁC COMPONENT CŨ (KÊ ĐƠN) ---
import { FaPills } from 'react-icons/fa';
import PrescriptionForm from './PrescriptionForm';
import PrescriptionHistory from './PrescriptionHistory';

// --- IMPORT MỚI: CÁC COMPONENT CHỈ THỊ ĐIỀU DƯỠNG ---
import NursingInstructionForm from './NursingInstructionForm';
import NursingInstructionHistory from './NursingInstructionHistory';
import './NursingInstruction.css';

const PatientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // [FIX] 1. Lấy thông tin User đang đăng nhập để lấy đúng DoctorID
    const user = useMemo(() => JSON.parse(sessionStorage.getItem('user')), []);
    const currentDoctorId = user?.StaffID; 

    const [patient, setPatient] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const [instructionHistory, setInstructionHistory] = useState([]);

    // API lấy thông tin bệnh nhân từ Database
    useEffect(() => {
        fetch(`http://localhost:5000/api/doctor/patient-detail/${id}`)
            .then(res => res.json())
            .then(data => {
                setPatient(data);
                setFormData(data);
            })
            .catch(err => console.error("Lỗi lấy thông tin bệnh nhân:", err));
    }, [id]);

    // Logic tự động mở tab và chế độ sửa nếu đi từ nút "Cập nhật" ở trang ngoài
    useEffect(() => {
        if (location.state?.autoEdit) {
            setActiveTab(location.state.targetTab || 'info');
            setIsEditing(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Lấy lịch sử chỉ thị điều dưỡng
    const fetchInstructionHistory = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/doctor/instruction-history/${id}`);
            const data = await res.json();
            setInstructionHistory(data);
        } catch (error) {
            console.error("Lỗi tải lịch sử chỉ thị:", error);
        }
    }, [id]);

    useEffect(() => {
        if (activeTab === 'nursing') {
            fetchInstructionHistory();
        }
    }, [activeTab, fetchInstructionHistory]);

    // Hàm lưu thông tin
    const handleSave = async () => {
        const requiredFields = [
            { key: 'Phone', label: 'Số điện thoại' },
            { key: 'Address', label: 'Địa chỉ' },
            { key: 'InsuranceID', label: 'Bảo hiểm y tế' },
            { key: 'CurrentRoom', label: 'Phòng bệnh' },
            { key: 'BloodGroup', label: 'Nhóm máu' },
            { key: 'AdmissionDiagnosis', label: 'Chẩn đoán nhập viện' },
            { key: 'CurrentCondition', label: 'Tình trạng hiện tại' },
            { key: 'Allergies', label: 'Dị ứng thuốc' },
            { key: 'MedicalHistory', label: 'Tiền sử bệnh' }
        ];

        const missingFields = requiredFields.filter(field => 
            !formData[field.key] || formData[field.key].toString().trim() === ""
        );

        if (missingFields.length > 0) {
            const errorLabels = missingFields.map(f => f.label).join(", ");
            alert(`Vui lòng điền đầy đủ các thông tin bắt buộc: ${errorLabels}`);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/doctor/update-patient/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok) {
                setPatient(formData);
                setIsEditing(false);
                alert("Cập nhật thông tin thành công!");
            } else {
                alert(result.message || "Có lỗi xảy ra khi cập nhật dữ liệu.");
            }
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            alert("Lỗi kết nối đến server.");
        }
    };

    const handleToggleEdit = () => {
        if (isEditing) {
            setFormData(patient);
        }
        setIsEditing(!isEditing);
    };

    if (!patient) return <div style={{ padding: "20px", textAlign: "center" }}>Đang tải thông tin...</div>;

    return (
        <div className="patient-profile-container">
            <div className="profile-navbar">
                <h1 className="main-title">Hồ sơ bệnh nhân</h1>
                <button className="btn-back" onClick={() => navigate(-1)}>Quay lại</button>
            </div>
            <div className="breadcrumb">Hồ sơ bệnh nhân / {patient.FullName}</div>

            {/* PHẦN TÓM TẮT */}
            <div className="card summary-card">
                <div className="header-info">
                    <div className="avatar">{patient.FullName?.[0]}</div>
                    <div className="name-block">
                        <h2>{patient.FullName}</h2>
                        <p>NS: {patient.DoB ? patient.DoB.substring(0, 10) : 'N/A'} • {patient.Gender} • Phòng {patient.CurrentRoom}</p>
                    </div>
                </div>

                <div className="summary-grid">
                    <div className="grid-item"><label>Nhóm máu</label><span className="val">{patient.BloodGroup || 'O+'}</span></div>
                    <div className="grid-item"><label>Chẩn đoán</label><span className="val">{patient.AdmissionDiagnosis}</span></div>
                    <div className="grid-item"><label>Tình trạng</label><span className="status-tag stable">Ổn định</span></div>
                    
                    {/* [FIX] 2. Hiển thị ngày nhập viện đúng định dạng */}
                    <div className="grid-item">
                        <label>Ngày nhập viện</label>
                        <span className="val">
                            {patient.AdmissionDate ? new Date(patient.AdmissionDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </span>
                    </div>

                    <div className="grid-item"><label>Dị ứng</label><span className="val text-danger">{patient.Allergies || 'Không có'}</span></div>
                    <div className="grid-item"><label>Tiền sử</label><span className="val">{patient.MedicalHistory}</span></div>
                </div>
            </div>

            {/* TAB MENU */}
            <div className="profile-tabs">
                <button className={`tab-item ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Thông tin cá nhân</button>
                <button className={`tab-item ${activeTab === 'prescription' ? 'active' : ''}`} onClick={() => setActiveTab('prescription')}>Kê đơn thuốc</button>
                <button className={`tab-item ${activeTab === 'nursing' ? 'active' : ''}`} onClick={() => setActiveTab('nursing')}>Chỉ thị điều dưỡng</button>
                <button className={`tab-item ${activeTab === 'medical_record' ? 'active' : ''}`} onClick={() => setActiveTab('medical_record')}>Hồ sơ bệnh án</button>
            </div>

            {/* 1. TAB THÔNG TIN CÁ NHÂN */}
            {activeTab === 'info' && (
                <div className="card detail-card">
                    <div className="profile-detail-header">
                        <div className="header-left-content">
                            <div className="title-with-icon">
                                <span className="blue-user-icon">👤</span> 
                                <h3 className="header-title">Thông tin chi tiết</h3>
                            </div>
                        </div>
                        <button className={`btn-edit-modern ${isEditing ? 'btn-cancel' : ''}`} onClick={handleToggleEdit}>
                            {isEditing ? "✖ Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
                        </button>
                    </div>

                    <div className="form-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div className="form-section">
                            <h4 style={{ color: '#0081c9', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                I. Thông tin hành chính
                            </h4>
                            <div className="input-group-vertical">
                                <label>Họ và tên</label>
                                <input value={formData.FullName || ''} disabled={true} style={{backgroundColor: '#f5f5f5'}} />
                            </div>
                            <div className="input-row-grid">
                                <div className="input-group-vertical">
                                    <label>Ngày sinh</label>
                                    <input value={formData.DoB ? formData.DoB.substring(0, 10) : ''} disabled={true} style={{backgroundColor: '#f5f5f5'}} />
                                </div>
                                <div className="input-group-vertical">
                                    <label>Giới tính</label>
                                    <input value={formData.Gender || ''} disabled={true} style={{backgroundColor: '#f5f5f5'}} />
                                </div>
                            </div>
                            <div className="input-group-vertical">
                                <label>Số điện thoại *</label>
                                <input name="Phone" value={formData.Phone || ''} onChange={(e) => setFormData({ ...formData, Phone: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className="input-group-vertical">
                                <label>Địa chỉ *</label>
                                <input name="Address" value={formData.Address || ''} onChange={(e) => setFormData({ ...formData, Address: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className="input-group-vertical">
                                <label>Bảo hiểm y tế *</label>
                                <input name="InsuranceID" value={formData.InsuranceID || ''} onChange={(e) => setFormData({ ...formData, InsuranceID: e.target.value })} disabled={!isEditing} />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4 style={{ color: '#0081c9', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                II. Thông tin liên hệ người thân
                            </h4>
                            <div className="input-group-vertical">
                                <label>Họ và tên người thân</label>
                                <input name="RelativeName" value={formData.RelativeName || ''} onChange={(e) => setFormData({ ...formData, RelativeName: e.target.value })} disabled={!isEditing} placeholder="Ví dụ: Nguyễn Văn A" />
                            </div>
                            <div className="input-group-vertical">
                                <label>Số điện thoại người thân</label>
                                <input name="RelativePhone" value={formData.RelativePhone || ''} onChange={(e) => setFormData({ ...formData, RelativePhone: e.target.value })} disabled={!isEditing} placeholder="Nhập số điện thoại" />
                            </div>
                            <div className="input-group-vertical">
                                <label>Quan hệ với bệnh nhân</label>
                                <input name="Relationship" value={formData.Relationship || ''} onChange={(e) => setFormData({ ...formData, Relationship: e.target.value })} disabled={!isEditing} placeholder="Mối quan hệ" />
                            </div>
                            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px', color: '#0056b3', fontSize: '14px' }}>
                                <strong>Lưu ý:</strong> Thông tin người thân được sử dụng trong các trường hợp khẩn cấp.
                            </div>
                        </div>
                    </div>
                    
                    {isEditing && (
                        <div className="form-footer-action">
                            <button className="btn-save-submit" onClick={handleSave}>Lưu tất cả thay đổi</button>
                        </div>
                    )}
                </div>
            )}

            {/* TAB KÊ ĐƠN THUỐC */}
            {activeTab === 'prescription' && (
                <div className="prescription-tab-wrapper">
                    <div style={{ display: 'grid', gridTemplateColumns: '65% 33%', gap: '2%' }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaPills color="#0081c9" /> Kê đơn thuốc
                            </h3>
                            {/* [FIX] 3. Truyền currentDoctorId thay vì số 2 */}
                            <PrescriptionForm patientId={id} doctorId={currentDoctorId} />
                        </div>
                        <div className="card">
                            <h3 style={{ marginBottom: '20px' }}>⏳ Lịch sử dùng thuốc</h3>
                            <PrescriptionHistory patientId={id} />
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CHỈ THỊ ĐIỀU DƯỠNG */}
            {activeTab === 'nursing' && (
                <div className="nursing-tab-wrapper" style={{ marginTop: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '60% 38%', gap: '2%' }}>
                        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            {/* [FIX] 4. Truyền currentDoctorId thay vì số 2 */}
                            <NursingInstructionForm 
                                patientId={id} 
                                doctorId={currentDoctorId} 
                                onInstructionSent={fetchInstructionHistory} 
                            />
                        </div>
                        <div className="card" style={{ backgroundColor: '#f9f9f9', borderLeft: '1px solid #ddd' }}>
                            <NursingInstructionHistory history={instructionHistory} />
                        </div>
                    </div>
                </div>
            )}

            {/* 4. TAB HỒ SƠ BỆNH ÁN */}
            {activeTab === 'medical_record' && (
                <div className="card detail-card">
                    <div className="profile-detail-header">
                        <div className="header-left-content"><h3 className="header-title">📂 Thông tin điều trị & Bệnh án</h3></div>
                        <button className={`btn-edit-modern ${isEditing ? 'btn-cancel' : ''}`} onClick={handleToggleEdit}>
                            {isEditing ? "✖ Hủy" : "✏️ Chỉnh sửa bệnh án"}
                        </button>
                    </div>
                    <div className="form-container">
                        <div className="form-section" style={{ width: '100%' }}>
                            <div className="input-row-grid">
                                <div className="input-group-vertical"><label>Phòng bệnh *</label><input name="CurrentRoom" value={formData.CurrentRoom || ''} onChange={(e) => setFormData({ ...formData, CurrentRoom: e.target.value })} disabled={!isEditing} /></div>
                                <div className="input-group-vertical"><label>Nhóm máu *</label><input name="BloodGroup" value={formData.BloodGroup || ''} onChange={(e) => setFormData({ ...formData, BloodGroup: e.target.value })} disabled={!isEditing} /></div>
                            </div>
                            <div className="input-group-vertical"><label>Chẩn đoán nhập viện *</label><input name="AdmissionDiagnosis" value={formData.AdmissionDiagnosis || ''} onChange={(e) => setFormData({ ...formData, AdmissionDiagnosis: e.target.value })} disabled={!isEditing} /></div>
                            <div className="input-group-vertical"><label>Tình trạng hiện tại *</label><input name="CurrentCondition" value={formData.CurrentCondition || ''} onChange={(e) => setFormData({ ...formData, CurrentCondition: e.target.value })} disabled={!isEditing} /></div>
                            <div className="input-group-vertical"><label>Dị ứng thuốc *</label><input name="Allergies" className="danger-text" value={formData.Allergies || ''} onChange={(e) => setFormData({ ...formData, Allergies: e.target.value })} disabled={!isEditing} /></div>
                            <div className="input-group-vertical"><label>Tiền sử bệnh *</label><textarea name="MedicalHistory" rows="5" value={formData.MedicalHistory || ''} onChange={(e) => setFormData({ ...formData, MedicalHistory: e.target.value })} disabled={!isEditing} /></div>
                        </div>
                    </div>
                    {isEditing && (<div className="form-footer-action"><button className="btn-save-submit" onClick={handleSave}>Cập nhật bệnh án</button></div>)}
                </div>
            )}
        </div>
    );
};

export default PatientProfile;