import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCalendarCheck, FaComments, FaUserInjured, FaFilePrescription, 
    FaHome, FaMagic, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaRegCalendarAlt 
} from 'react-icons/fa';
import './DoctorDashboard.css'; 

/* ===== IMPORT COMPONENTS ===== */
import DoctorAppointments from "../Appointments/DoctorAppointments";
import PatientProfile from "../PatientCare/PatientProfile";
import OnlineConsultation from "../Consultation/OnlineConsultation";
import AiSummary from "../AIfunction/AiSummary";

const DoctorDashboard = ({ user, activeView }) => {
    const navigate = useNavigate();

    // Lấy ID thực tế từ user
    const currentDoctorId = user?.StaffID || user?.ID;

    // State lưu trữ lịch làm việc từ database
    const [workSchedule, setWorkSchedule] = useState([]);

    // --- [SỬA] STATE QUẢN LÝ TUẦN ĐANG XEM ---
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day; // Lấy ngày Chủ Nhật tuần này
        const sunday = new Date(now.setDate(diff));
        sunday.setHours(0, 0, 0, 0);
        return sunday;
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Effect gọi API lấy lịch làm việc
    useEffect(() => {
        if (currentDoctorId) {
            fetch(`http://localhost:5000/api/doctor/work-schedule/${currentDoctorId}`)
                .then(res => res.json())
                .then(data => {
                    setWorkSchedule(Array.isArray(data) ? data : []);
                })
                .catch(err => console.error("Lỗi tải lịch làm việc:", err));
        }
    }, [currentDoctorId]);

    // Dữ liệu giả lập cho phần thống kê - GIỮ NGUYÊN
    const appointmentsData = [
        { id: 1, patientId: 1, name: 'Phạm Bệnh Nhân A', type: 'Khám định kỳ', time: '09:00', avatar: 'A' },
        { id: 2, patientId: 2, name: 'Hoàng Bệnh Nhân B', type: 'Tư vấn', time: '10:30', avatar: 'B' },
        { id: 3, patientId: 1, name: 'Phạm Bệnh Nhân A', type: 'Tái khám', time: '14:00', avatar: 'A' },
    ];

    // --- [MỚI] HÀM TRÁNH LỖI NHẢY NGÀY (Sử dụng giờ địa phương thay vì UTC) ---
    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const getWeekDates = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(currentWeekStart);
            d.setDate(currentWeekStart.getDate() + i);
            return d;
        });
    };

    const weekDates = getWeekDates();

    // Hiển thị dải ngày (VD: 12 - 18 Tháng 1, 2026)
    const getWeekRangeLabel = () => {
        const start = weekDates[0];
        const end = weekDates[6];
        return `${start.getDate()} - ${end.getDate()} Tháng ${start.getMonth() + 1}, ${start.getFullYear()}`;
    };

    const changeWeek = (direction) => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(currentWeekStart.getDate() + (direction * 7));
        setCurrentWeekStart(newDate);
    };

    const getShiftForDate = (date) => {
        const dateStr = formatLocalDate(date); // Dùng hàm format local để so sánh
        return workSchedule.find(s => {
            const workDateStr = formatLocalDate(new Date(s.WorkDate));
            return workDateStr === dateStr;
        });
    };

    return (
        <div className="doctor-layout">
            <aside className="doc-sidebar">
                <div className="brand">
                    <h2 className="footer-logo">TÂM ANH</h2>
                </div>

                <ul className="doc-menu">
                    <li className={!activeView ? "active" : ""} onClick={() => navigate('/dashboard')}>
                        <FaHome /> Tổng quan
                    </li>
                    <li className={activeView === 'appointments' ? "active" : ""} onClick={() => navigate('/doctor/appointments')}>
                        <FaCalendarCheck /> Lịch khám
                    </li>
                    <li className={activeView === 'online-consultation' ? "active" : ""} onClick={() => navigate('/online-consultation')}>
                        <FaComments /> Tư vấn
                    </li>
                    <li className={activeView === 'patients' ? "active" : ""} onClick={() => navigate('/doctor/patients')}>
                        <FaUserInjured /> Bệnh nhân
                    </li>
                    <li className={activeView === 'ai-summary' ? "active" : ""} onClick={() => navigate('/doctor/ai-summary')}>
                        <FaMagic /> AI Tóm tắt
                    </li>
                </ul>
            </aside>

            <main className="doc-main">
                <header className="doc-header">
                    <div className="welcome-text"></div> 
                    <div className="user-info">
                        <span>BS. {user?.FullName || 'Nguyễn Văn A'}</span>
                        <button onClick={handleLogout} className="btn-logout">
                            <FaSignOutAlt /> Đăng xuất
                        </button>
                    </div>
                </header>

                <div className="content-wrapper">
                    {activeView === 'appointments' ? (
                        <DoctorAppointments initialTab="appointments" doctorId={currentDoctorId} />
                    ) : activeView === 'patients' ? (
                        <DoctorAppointments initialTab="patients" doctorId={currentDoctorId} />
                    ) : activeView === 'patient-detail' ? (
                        <PatientProfile />
                    ) : activeView === 'online-consultation' ? (
                        <OnlineConsultation doctorId={currentDoctorId} />
                    ) : activeView === 'ai-summary' ? (
                        <AiSummary user={user} />
                    ) : (
                        <>
                            <h1 className="page-title">Bảng điều khiển</h1>
                            <p className="page-subtitle">Quản lý lịch khám và bệnh nhân của bạn</p>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-info"><p>Lịch hẹn hôm nay</p><h3>{appointmentsData.length}</h3></div>
                                    <div className="stat-icon blue"><FaCalendarCheck /></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info"><p>Tư vấn chờ xử lý</p><h3>3</h3></div>
                                    <div className="stat-icon teal"><FaComments /></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info"><p>Bệnh nhân đang điều trị</p><h3>12</h3></div>
                                    <div className="stat-icon green"><FaUserInjured /></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info"><p>Đơn thuốc tuần này</p><h3>24</h3></div>
                                    <div className="stat-icon red"><FaFilePrescription /></div>
                                </div>
                            </div>

                            <h2 className="section-header">Chức năng nhanh</h2>
                            <div className="actions-grid">
                                <div className="action-card" onClick={() => navigate('/doctor/appointments')}>
                                    <FaCalendarCheck className="action-icon blue" />
                                    <h4>Xem lịch khám</h4>
                                    <p>UC007</p>
                                </div>
                                <div className="action-card" onClick={() => navigate('/online-consultation')}>
                                    <FaComments className="action-icon teal" />
                                    <h4>Tư vấn trực tuyến</h4><p>UC008</p>
                                </div>
                                <div className="action-card" onClick={() => navigate('/doctor/patients')}>
                                    <FaUserInjured className="action-icon green" />
                                    <h4>Quản lý bệnh nhân</h4><p>UC012</p>
                                </div>
                                <div className="action-card highlight" onClick={() => navigate('/doctor/ai-summary')}>
                                    <FaMagic className="action-icon blue" />
                                    <h4>AI Tóm tắt</h4><p>UC018</p>
                                </div>
                            </div>

                            <div className="appointments-section">
                                <h2 className="section-header">Lịch hẹn hôm nay</h2>
                                <div className="appointment-list">
                                    {appointmentsData.map((app) => (
                                        <div key={app.id} className="appointment-item">
                                            <div className="app-left">
                                                <div className="avatar-circle">{app.avatar}</div>
                                                <div className="app-info">
                                                    <h4>{app.name}</h4>
                                                    <p>{app.type}</p>
                                                </div>
                                            </div>
                                            <div className="app-right">
                                                <span className="app-time">{app.time}</span>
                                                <button 
                                                    className="btn-detail" 
                                                    onClick={() => navigate(`/patient-profile/${app.patientId}`)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* --- [SỬA HOÀN CHỈNH] LỊCH LÀM VIỆC DẠNG BẢNG NGANG CÓ CHỌN NGÀY --- */}
                            <div className="schedule-section-horizontal" style={{ marginTop: '40px' }}>
                                <div className="schedule-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h2 className="section-header" style={{ margin: 0 }}>Lịch làm việc</h2>
                                    
                                    <div className="week-picker-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button className="picker-btn" onClick={() => changeWeek(-1)} style={{ padding: '5px 10px', cursor: 'pointer' }}><FaChevronLeft /></button>
                                        <div className="picker-display" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8f9fa', padding: '8px 15px', borderRadius: '8px', border: '1px solid #eee' }}>
                                            <FaRegCalendarAlt />
                                            <span>{getWeekRangeLabel()}</span>
                                        </div>
                                        <button className="picker-btn" onClick={() => changeWeek(1)} style={{ padding: '5px 10px', cursor: 'pointer' }}><FaChevronRight /></button>
                                    </div>
                                </div>

                                <div className="schedule-table-wrapper" style={{ overflowX: 'auto', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <table className="schedule-table-horizontal" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                        <thead>
                                            <tr>
                                                {dayNames.map((name, index) => (
                                                    <th key={index} style={{ background: '#94b2f1', padding: '12px', border: '1px solid #ddd', textAlign: 'left', color: (index === 0 || index === 6) ? '#f06292' : '#333' }}>
                                                        {name}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {weekDates.map((date, index) => {
                                                    const shift = getShiftForDate(date);
                                                    return (
                                                        <td key={index} style={{ border: '1px solid #ddd', height: '120px', verticalAlign: 'top', padding: '10px' }}>
                                                            {shift ? (
                                                                <div className="shift-cell-content">
                                                                    <p className="shift-text" style={{ fontSize: '13px', margin: 0, fontWeight: '500' }}>
                                                                        {shift.ShiftType === 'Morning' ? 'Trực ca 08:00 - 16:00' :
                                                                         shift.ShiftType === 'Afternoon' ? 'Trực ca 14:00 - 22:00' :
                                                                         shift.ShiftType === 'Night' ? 'Trực ca 22:00 - 06:00 hôm sau' : 
                                                                         `Trực ca ${shift.ShiftType}`}
                                                                    </p>
                                                                    {shift.Note && <p className="shift-note-text" style={{ fontSize: '11px', color: '#777', fontStyle: 'italic', marginTop: '5px' }}>{shift.Note}</p>}
                                                                </div>
                                                            ) : null}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;