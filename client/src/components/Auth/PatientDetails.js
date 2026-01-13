import React, { useState, useEffect, useRef } from 'react'; // [MODIFIED] Thêm useRef
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FaUser, FaCalendarAlt, FaVenusMars, FaMapMarkerAlt,
    FaIdCard, FaNotesMedical, FaAllergies, 
    FaUserFriends, FaPhone, FaTint, FaCheckCircle 
} from 'react-icons/fa';
import CustomCalendar from "../Common/CustomCalendar/CustomCalendar"; // [NEW] Import Calendar
import './Register.css'; 

const PatientDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy dữ liệu từ Bước 1
    const initialData = location.state?.initialData;

    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        gender: '',
        address: '',
        insuranceId: '',
        bloodGroup: '',
        allergies: '',
        medicalHistory: '',
        relativeName: '',
        relativePhone: '',
        relationship: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // --- [NEW] STATE CHO CALENDAR ---
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    // Redirect về nếu không có data bước 1
    useEffect(() => {
        if (!initialData) {
            navigate('/register');
        }
    }, [initialData, navigate]);

    // --- [NEW] XỬ LÝ CLICK OUTSIDE CALENDAR ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- [NEW] HÀM XỬ LÝ CHỌN NGÀY TỪ CALENDAR ---
    const handleDateChange = (newDate) => {
        setFormData({ ...formData, dob: newDate }); // newDate format: YYYY-MM-DD
        setShowCalendar(false);
    };

    // --- VALIDATION ---
    const validateForm = () => {
        // 1. Thông tin cá nhân
        if (!formData.fullName.trim()) return "Vui lòng nhập Họ và tên!";
        if (!formData.gender) return "Vui lòng chọn Giới tính!";
        if (!formData.address.trim()) return "Vui lòng nhập Địa chỉ!";
        if (!formData.insuranceId.trim()) return "Vui lòng nhập Mã BHYT!";

        // 2. Ngày sinh
        if (!formData.dob) {
            return "Vui lòng chọn Ngày sinh!";
        } else {
            const selectedDate = new Date(formData.dob);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Logic: Không tương lai & Không quá 150 năm
            const minDate = new Date();
            minDate.setFullYear(today.getFullYear() - 150);

            if (selectedDate > today) return "Ngày sinh không được là ngày trong tương lai!";
            if (selectedDate < minDate) return "Ngày sinh không hợp lệ (quá 150 tuổi)!";
        }

        // 3. Thông tin Y tế
        if (!formData.bloodGroup) return "Vui lòng chọn Nhóm máu!";
        if (!formData.medicalHistory.trim()) return "Vui lòng nhập Tiền sử bệnh (Ghi 'Không' nếu không có)!";
        if (!formData.allergies.trim()) return "Vui lòng nhập Dị ứng (Ghi 'Không' nếu không có)!";

        // 4. Người thân
        if (!formData.relativeName.trim()) return "Vui lòng nhập Họ tên người thân!";
        if (!formData.relationship.trim()) return "Vui lòng nhập Mối quan hệ!";

        // 5. SĐT Người thân
        const relPhone = formData.relativePhone.trim();
        if (!relPhone) return "Vui lòng nhập SĐT người thân!";
        if (!/^\d+$/.test(relPhone)) return "SĐT người thân chỉ được chứa ký tự số!";
        if (relPhone.length < 10 || relPhone.length > 11) return "SĐT người thân phải có 10 hoặc 11 chữ số!";
        
        // Check trùng với SĐT của mình
        if (initialData && relPhone === initialData.phone.trim()) {
            return "SĐT người thân không được trùng với SĐT đăng ký của bạn!";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        const finalPayload = { ...initialData, ...formData };

        try {
            await axios.post('http://localhost:5000/api/auth/register', finalPayload);
            setIsLoading(false);
            setShowSuccess(true);
        } catch (err) {
            setIsLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("Đăng ký thất bại. Vui lòng thử lại.");
            }
        }
    };

    if (!initialData) return null;

    return (
        <div className="register-container">
            {/* MODAL THÀNH CÔNG */}
            {showSuccess && (
                <div className="modal-overlay">
                    <div className="success-modal">
                        <FaCheckCircle className="success-icon-large" />
                        <h3>ĐĂNG KÝ THÀNH CÔNG!</h3>
                        <p>Thông tin của bạn đã được ghi nhận.<br/>Vui lòng đăng nhập để bắt đầu sử dụng.</p>
                        <button className="btn-success-modal" onClick={() => navigate('/login')}>
                            ĐẾN TRANG ĐĂNG NHẬP
                        </button>
                    </div>
                </div>
            )}

            <div className="register-banner">
                <div className="banner-content">
                    <h1>Hoàn tất hồ sơ</h1>
                    <p>Vui lòng cập nhật đầy đủ thông tin cá nhân và y tế.</p>
                </div>
            </div>

            <div className="register-form-section">
                <div className="register-box">

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Hàng 1: Họ tên */}
                        <div className="input-group">
                            <label>Họ và tên (*)</label>
                            <div className="input-wrapper">
                                <FaUser className="input-icon" />
                                <input type="text" className="input-field" name="fullName" placeholder="Nguyễn Văn A" onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Hàng 2: Ngày sinh & Giới tính */}
                        <div className="form-row">
                            
                            {/* [MODIFIED] ÁP DỤNG STYLE CALENDAR CỦA APPOINTMENT */}
                            <div className="input-group form-group half" ref={calendarRef}>
                                <label>Ngày sinh (*)</label>
                                <div 
                                    className="input-wrapper" 
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    style={{cursor: 'pointer'}} // Thêm con trỏ tay để biết bấm được
                                >
                                    <FaCalendarAlt className="input-icon" />
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        name="dob"
                                        // Format lại hiển thị dd/mm/yyyy
                                        value={formData.dob ? formData.dob.split('-').reverse().join('/') : ''} 
                                        readOnly 
                                        placeholder="dd/mm/yyyy"
                                        required
                                    />
                                    {/* Hiển thị CustomCalendar khi showCalendar = true */}
                                    {showCalendar && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000, marginTop: '5px' }}>
                                            <CustomCalendar 
                                                selectedDate={formData.dob} 
                                                onChange={handleDateChange} 
                                                onClose={() => setShowCalendar(false)} 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="input-group form-group half">
                                <label>Giới tính (*)</label>
                                <div className="input-wrapper">
                                    <FaVenusMars className="input-icon" />
                                    <select className="input-field" name="gender" onChange={handleChange} required>
                                        <option value="">Chọn</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Hàng 3: Địa chỉ & BHYT */}
                        <div className="form-row">
                            <div className="input-group form-group half">
                                <label>Địa chỉ (*)</label>
                                <div className="input-wrapper">
                                    <FaMapMarkerAlt className="input-icon" />
                                    <input type="text" className="input-field" name="address" placeholder="Số nhà, đường..." onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group form-group half">
                                <label>Mã BHYT (*)</label>
                                <div className="input-wrapper">
                                    <FaIdCard className="input-icon" />
                                    <input type="text" className="input-field" name="insuranceId" placeholder="VD: DN479..." onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <hr/>
                        <p style={{marginBottom: '10px', fontWeight: '700', color: '#1e3a8a', fontSize:'0.9rem'}}>Thông tin Y tế (Bắt buộc)</p>

                        {/* Hàng 4: Nhóm máu & Tiền sử */}
                        <div className="form-row">
                            <div className="input-group" style={{flex: '0.5'}}>
                                <label>Máu (*)</label>
                                <div className="input-wrapper">
                                    <FaTint className="input-icon" />
                                    <select className="input-field" name="bloodGroup" onChange={handleChange} required>
                                        <option value="">Chọn</option>
                                        <option value="A+">A+</option><option value="A-">A-</option>
                                        <option value="B+">B+</option><option value="B-">B-</option>
                                        <option value="O+">O+</option><option value="O-">O-</option>
                                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group" style={{flex: '1.5'}}>
                                <label>Tiền sử bệnh (*)</label>
                                <div className="input-wrapper">
                                    <FaNotesMedical className="input-icon" />
                                    <input type="text" className="input-field" name="medicalHistory" placeholder="Tiểu đường, tim mạch..." onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Hàng 5: Dị ứng */}
                        <div className="input-group">
                            <label>Dị ứng thuốc/thức ăn (*)</label>
                            <div className="input-wrapper">
                                <FaAllergies className="input-icon" />
                                <input type="text" className="input-field" name="allergies" placeholder="Kháng sinh, hải sản..." onChange={handleChange} required />
                            </div>
                        </div>

                        <hr/>
                        <p style={{marginBottom: '10px', fontWeight: '700', color: '#1e3a8a', fontSize:'0.9rem'}}>Người thân (Liên hệ khẩn cấp)</p>

                        {/* Hàng 6: Người thân */}
                        <div className="form-row">
                            <div className="input-group form-group half">
                                <label>Họ tên (*)</label>
                                <div className="input-wrapper">
                                    <FaUserFriends className="input-icon" />
                                    <input type="text" className="input-field" name="relativeName" onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group form-group half">
                                <label>SĐT người thân (*)</label>
                                <div className="input-wrapper">
                                    <FaPhone className="input-icon" />
                                    <input type="text" className="input-field" name="relativePhone" onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label>Mối quan hệ (*)</label>
                            <div className="input-wrapper">
                                <FaUserFriends className="input-icon" />
                                <input type="text" className="input-field" name="relationship" placeholder="VD: Cha, Vợ, Chồng..." onChange={handleChange} required />
                            </div>
                        </div>

                        <button type="submit" className="btn-register" disabled={isLoading}>
                            {isLoading ? 'Đang tạo tài khoản...' : 'HOÀN TẤT ĐĂNG KÝ'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;