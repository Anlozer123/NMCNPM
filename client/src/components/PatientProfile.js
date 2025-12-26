import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PatientProfile.css';
// --- IMPORT THÊM CÁC COMPONENT KÊ ĐƠN ---
import { FaPills } from 'react-icons/fa';
import PrescriptionForm from './PrescriptionForm';
import PrescriptionHistory from './PrescriptionHistory';

const PatientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // --- THÊM STATE ĐỂ QUẢN LÝ TAB (Mặc định là 'info') ---
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        fetch(`http://localhost:5000/api/doctor/patient-detail/${id}`)
            .then(res => res.json())
            .then(data => {
                setPatient(data);
                setFormData(data);
            });
    }, [id]);

    const handleSave = async () => {
        const response = await fetch(`http://localhost:5000/api/doctor/update-patient/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            setPatient(formData);
            setIsEditing(false);
            alert("Cập nhật thành công!");
        }
    };

    if (!patient) return null;

    return (
        <div className="patient-profile-container">
            <div className="profile-navbar">
                <h1 className="main-title">Hồ sơ bệnh nhân</h1>
                <button className="btn-back" onClick={() => navigate(-1)}>Quay lại</button>
            </div>
            <div className="breadcrumb">Hồ sơ bệnh nhân / {patient.FullName}</div>

            {/* PHẦN 1: TÓM TẮT (Giữ nguyên cấu trúc cũ) */}
            <div className="card summary-card">
                <div className="header-info">
                    <div className="avatar">{patient.FullName?.[0]}</div>
                    <div className="name-block">
                        <h2>{patient.FullName}</h2>
                        <p>45 tuổi • Nam • Phòng {patient.CurrentRoom}</p>
                    </div>
                </div>

                <div className="summary-grid">
                    <div className="grid-item"><label>Nhóm máu</label><span className="val">{patient.BloodGroup || 'O+'}</span></div>
                    <div className="grid-item"><label>Chẩn đoán</label><span className="val">{patient.AdmissionDiagnosis || 'Viêm phổi'}</span></div>
                    <div className="grid-item"><label>Tình trạng</label><span className="status-tag stable">Ổn định</span></div>
                    <div className="grid-item"><label>Ngày nhập viện</label><span className="val">2025-01-15</span></div>
                    <div className="grid-item"><label>Dị ứng</label><span className="val text-danger">{patient.Allergies || 'Penicillin'}</span></div>
                    <div className="grid-item"><label>Tiền sử</label><span className="val">{patient.MedicalHistory || 'Tiểu đường type 2'}</span></div>
                </div>
            </div>

            {/* TAB MENU: Cập nhật sự kiện onClick để đổi Tab */}
            <div className="profile-tabs">
                <button
                    className={`tab-item ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    Thông tin cá nhân
                </button>
                <button
                    className={`tab-item ${activeTab === 'prescription' ? 'active' : ''}`}
                    onClick={() => setActiveTab('prescription')}
                >
                    Kê đơn thuốc
                </button>
                <button className="tab-item">Chỉ thị điều dưỡng</button>
                <button className="tab-item">Hồ sơ bệnh án</button>
            </div>

            {/* NỘI DUNG THAY ĐỔI DỰA TRÊN TAB ĐANG CHỌN */}
            {activeTab === 'info' ? (
                /* HIỂN THỊ PHẦN 2 CŨ: THÔNG TIN CHI TIẾT (Giữ nguyên cấu trúc cũ) */
                <div className="card detail-card">
                    <div className="detail-header">
                        <h3>👤 Thông tin chi tiết</h3>
                        <button className={`btn-toggle-edit ${isEditing ? 'btn-cancel' : ''}`} onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
                        </button>
                    </div>

                    <div className="form-container">
                        <div className="form-section">
                            <h4>Thông tin hành chính</h4>
                            <div className="input-group">
                                <label>Họ và tên</label>
                                <input name="FullName" value={formData.FullName || ''} onChange={(e) => setFormData({ ...formData, FullName: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className="input-row">
                                <div className="input-group"><label>Tuổi</label><input value="45" disabled /></div>
                                <div className="input-group"><label>Giới tính</label><input value="Nam" disabled /></div>
                            </div>
                            <div className="input-group">
                                <label>Số điện thoại</label>
                                <input name="Phone" value={formData.Phone || ''} onChange={(e) => setFormData({ ...formData, Phone: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className="input-group">
                                <label>Địa chỉ</label>
                                <input name="Address" value={formData.Address || ''} onChange={(e) => setFormData({ ...formData, Address: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className="input-group">
                                <label>Bảo hiểm y tế</label>
                                <input name="InsuranceID" value={formData.InsuranceID || ''} onChange={(e) => setFormData({ ...formData, InsuranceID: e.target.value })} disabled={!isEditing} />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4>Thông tin điều trị</h4>
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Phòng bệnh</label>
                                    <input name="CurrentRoom" value={formData.CurrentRoom || ''} onChange={(e) => setFormData({ ...formData, CurrentRoom: e.target.value })} disabled={!isEditing} />
                                </div>
                                <div className="input-group">
                                    <label>Nhóm máu</label>
                                    <input name="BloodGroup" value={formData.BloodGroup || ''} onChange={(e) => setFormData({ ...formData, BloodGroup: e.target.value })} disabled={!isEditing} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Chẩn đoán nhập viện</label>
                                <input name="AdmissionDiagnosis" value={formData.AdmissionDiagnosis || ''} onChange={(e) => setFormData({ ...formData, AdmissionDiagnosis: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className="input-group">
                                <label>Tình trạng hiện tại</label>
                                <input name="CurrentCondition" value={formData.CurrentCondition || ''} onChange={(e) => setFormData({ ...formData, CurrentCondition: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className="input-group">
                                <label>Dị ứng thuốc</label>
                                <input name="Allergies" className="danger-text" value={formData.Allergies || ''} onChange={(e) => setFormData({ ...formData, Allergies: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className="input-group">
                                <label>Tiền sử bệnh</label>
                                <textarea name="MedicalHistory" rows="3" value={formData.MedicalHistory || ''} onChange={(e) => setFormData({ ...formData, MedicalHistory: e.target.value })} disabled={!isEditing} />
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="form-footer">
                            <button className="btn-save-submit" onClick={handleSave}>Lưu thay đổi</button>
                        </div>
                    )}
                </div>
            ) : (
                /* --- NHÚNG PHẦN KÊ ĐƠN TỪ DASHBOARD SANG ĐÂY --- */
                <div className="prescription-tab-wrapper">
                    <div style={{ display: 'grid', gridTemplateColumns: '65% 33%', gap: '2%' }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {/* ĐÃ ĐỔI BIỂU TƯỢNG TẠI ĐÂY */}
                                <FaPills color="#0081c9" /> Kê đơn thuốc
                            </h3>
                            <PrescriptionForm
                                patientId={id}
                                doctorId={2}
                            />
                        </div>
                        <div className="card">
                            <h3 style={{ marginBottom: '20px' }}>⏳ Lịch sử dùng thuốc</h3>
                            <PrescriptionHistory patientId={id} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientProfile;