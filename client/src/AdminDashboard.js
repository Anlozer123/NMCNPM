import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [adminProfile, setAdminProfile] = useState(null);

    // State cho Lịch làm việc
    const [scheduleData, setScheduleData] = useState([]); 
    const [staffList, setStaffList] = useState([]);       
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date()); 

    // State cho Bệnh nhân
    const [patientList, setPatientList] = useState([]);
    const [patientSearch, setPatientSearch] = useState(''); 

    // Lấy thông tin user từ LocalStorage
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Admin', StaffID: 1 };

    // State lưu danh sách Y tá (để chọn trong Modal)
    const [nurseList, setNurseList] = useState([]);

    // State kiểm soát chế độ Sửa/Thêm
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // --- STATE FORM DỮ LIỆU (Dùng chung cho Thêm và Sửa) ---
    const initialFormState = {
        fullName: '',
        gender: 'Nam',
        dob: '',
        phone: '',
        address: '',
        email: '',          // Mới
        password: '',       // Mới
        currentRoom: '',    // Mới
        nurseId: ''         // Mới
    };
    const [formData, setFormData] = useState(initialFormState);

    // State lọc & tìm kiếm nhân viên
    // Mặc định hiển thị Bác sĩ
    const [staffFilter, setStaffFilter] = useState('Doctor'); 
    // Tìm kiếm nhân viên
    const [staffSearch, setStaffSearch] = useState('');
    // State quản lý hiển thị Modal Nhân viên
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [isEditingStaff, setIsEditingStaff] = useState(false);
    const [editingStaffId, setEditingStaffId] = useState(null);
    // State lưu dữ liệu form nhập liệu Nhân viên
    const initialStaffForm = {
        fullName: '',
        role: 'Doctor',      // Mặc định là Bác sĩ
        specialization: '',  // Chuyên khoa
        phone: '',
        email: '',
        password: ''
    };
    const [staffFormData, setStaffFormData] = useState(initialStaffForm);

    // --- EFFECT: Nạp Font Awesome cho icons
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
        document.head.appendChild(link);
    }, []);

    // --- EFFECT: Lấy dữ liệu Profile & Danh sách Y tá ---
    useEffect(() => {
        const adminId = user.StaffID || 1; 
        
        // 1. Lấy Profile Admin
        fetch(`http://localhost:5000/api/admin/profile?id=${adminId}`)
            .then(res => res.json())
            .then(data => setAdminProfile(data))
            .catch(err => console.error("Lỗi lấy profile:", err));

        // 2. Lấy danh sách Y tá (Để nạp vào dropdown chọn y tá phụ trách)
        fetch('http://localhost:5000/api/admin/staff?role=Nurse') 
            .then(res => res.json())
            .then(data => setNurseList(data))
            .catch(() => {
                // Mock data nếu chưa có API
                console.log("Chưa lấy được DS Y tá, dùng dữ liệu giả định.");
                setNurseList([{ StaffID: 101, FullName: 'Y tá A' }, { StaffID: 102, FullName: 'Y tá B' }]);
            });

    }, [user.StaffID]);

    // --- EFFECT: Lấy dữ liệu khi chuyển tab ---
    useEffect(() => {
        if (activeTab === 'schedule') {
            fetch('http://localhost:5000/api/admin/work-schedule')
                .then(res => res.json())
                .then(data => {
                    setScheduleData(data.schedule);
                    setStaffList(data.staff);
                })
                .catch(console.error);
            
            // Set về thứ 2 của tuần hiện tại
            const today = new Date();
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
            const monday = new Date(today.setDate(diff));
            setCurrentWeekStart(monday);
        }

        if (activeTab === 'patients') {
            fetchPatients();
        }
    }, [activeTab]);

    const fetchPatients = () => {
        fetch('http://localhost:5000/api/admin/patients')
            .then(res => res.json())
            .then(data => setPatientList(data))
            .catch(console.error);
    };

    const handleLogout = () => { localStorage.clear(); navigate('/login'); };

    // --- CÁC HÀM XỬ LÝ MODAL (THÊM / SỬA) ---

    // 1. Mở Modal để THÊM MỚI
    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData(initialFormState); // Reset form về rỗng
        setShowModal(true);
    };

    // 2. Mở Modal để CHỈNH SỬA (Điền dữ liệu cũ vào form)
    const handleOpenEditModal = (p) => {
        setIsEditing(true);
        setEditingId(p.PatientID);
        setFormData({
            fullName: p.FullName,
            gender: p.Gender === 'Male' ? 'Nam' : 'Nữ',
            dob: p.DoB ? p.DoB.split('T')[0] : '', // Chuyển đổi ngày cho input type="date"
            phone: p.Phone,
            address: p.Address,
            email: p.Email || '',           // Lấy email từ DB (ẩn trên thẻ)
            password: '',                   // Mật khẩu luôn reset trống
            currentRoom: p.CurrentRoom || '',
            nurseId: p.NurseID || ''        // Lấy ID y tá từ DB
        });
        setShowModal(true);
    };

    // --- XỬ LÝ SỰ KIỆN NÚT LƯU / CẬP NHẬT ---
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn trình duyệt reload trang

        // === TRƯỜNG HỢP 1: ĐANG CHỈNH SỬA (UPDATE) ===
        if (isEditing) {
            // Kiểm tra xem có ID cần sửa không
            if (!editingId) {
                alert("Lỗi: Không tìm thấy ID bệnh nhân cần sửa!");
                return;
            }

            // Gọi API Cập nhật (PUT)
            fetch(`http://localhost:5000/api/admin/update-patient/${editingId}`, {
                method: 'PUT', // Dùng phương thức PUT để cập nhật
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData) // Gửi dữ liệu từ form lên
            })
            .then(res => res.json())
            .then(data => {
                if (data.success || data.message) {
                    alert("✅ Đã cập nhật thông tin thành công!");
                    setShowModal(false); // Đóng modal
                    fetchPatients();     // Tải lại danh sách để thấy thay đổi
                } else {
                    alert("❌ Lỗi cập nhật: " + (data.error || data.message));
                }
            })
            .catch(err => {
                console.error("Lỗi mạng:", err);
                alert("Lỗi kết nối đến Server!");
            });
        } 
        // === TRƯỜNG HỢP 2: THÊM MỚI (ADD) ===
        else {
            // Gọi API Thêm mới (POST)
            fetch('http://localhost:5000/api/admin/add-patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success || data.message) {
                    alert("✅ Thêm bệnh nhân mới thành công!");
                    setShowModal(false);
                    fetchPatients();
                } else {
                    alert("❌ Lỗi thêm mới: " + (data.error || data.message));
                }
            })
            .catch(err => console.log(err));
        }
    };

    const fetchStaffList = () => {
        fetch('http://localhost:5000/api/admin/staff')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Không thể kết nối đến server');
                }
                return res.json();
            })
            .then(data => {
                // Cập nhật dữ liệu thật từ Database vào State
                setStaffList(data);
            })
            .catch(err => {
                console.error("Lỗi tải danh sách nhân viên:", err);
                // Không set dữ liệu giả nữa, có thể alert lỗi nếu cần
                alert("Không thể tải dữ liệu nhân viên từ Server!");
            });
    };

    //Nhân viên
    // 1. Hàm mở Modal để THÊM Nhân viên
    const handleOpenAddStaffModal = () => {
        setIsEditingStaff(false);
        setEditingStaffId(null);
        setStaffFormData(initialStaffForm); // Reset form về rỗng
        setShowStaffModal(true);
    };

    // 2. Hàm mở Modal để SỬA Nhân viên
    const handleOpenEditStaffModal = (staff) => {
        setIsEditingStaff(true);
        setEditingStaffId(staff.StaffID);
        // Đổ dữ liệu cũ của nhân viên đó vào form
        setStaffFormData({
            fullName: staff.FullName,
            role: staff.Role,
            specialization: staff.Specialization || '',
            phone: staff.Phone,
            email: staff.Email || '',
            password: '' // Mật khẩu luôn reset trống
        });
        setShowStaffModal(true);
    };

    // 3. Hàm Gửi dữ liệu (Submit) lên Server
    const handleStaffSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra xem là Đang sửa hay Đang thêm để chọn URL phù hợp
        const url = isEditingStaff 
            ? `http://localhost:5000/api/admin/update-staff/${editingStaffId}`
            : 'http://localhost:5000/api/admin/add-staff';
        
        const method = isEditingStaff ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staffFormData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success || data.message) {
                alert(isEditingStaff ? "Cập nhật thành công!" : "Thêm mới thành công!");
                setShowStaffModal(false); // Đóng modal
                
                // Gọi hàm lấy lại danh sách nhân viên (Bạn cần đảm bảo hàm này đã có)
                // Nếu chưa có hàm riêng, bạn có thể reload trang hoặc gọi fetch lại ở đây
                 if (typeof fetchStaffList === 'function') fetchStaffList(); 
                 else window.location.reload(); 
            } else {
                alert("Lỗi: " + (data.error || data.message));
            }
        })
        .catch(err => {
            console.error(err);
            alert("Lỗi kết nối server!");
        });
    };

    // --- HELPERS CHO LỊCH ---
    const getDaysInWeek = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(currentWeekStart.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const changeWeek = (direction) => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(currentWeekStart.getDate() + (direction * 7));
        setCurrentWeekStart(newDate);
    };

    const renderShift = (staffId, date) => {
        const dateStr = date.toISOString().split('T')[0];
        const shifts = scheduleData.filter(s => 
            s.StaffID === staffId && 
            s.WorkDate.split('T')[0] === dateStr
        );

        if (shifts.length === 0) return null;

        return shifts.map(s => {
            let className = 'shift-morning';
            let timeText = '08:00 - 16:00';
            let label = 'Ca Sáng';

            if (s.ShiftType === 'Afternoon' || s.ShiftType === 'Chiều') { className = 'shift-afternoon'; timeText = '14:00 - 22:00'; label = 'Ca Chiều'; }
            if (s.ShiftType === 'Night' || s.ShiftType === 'Đêm') { className = 'shift-night'; timeText = '22:00 - 06:00'; label = 'Ca Đêm'; }

            return (
                <div key={s.ScheduleID} className={`shift-box ${className}`}>
                    <span className="shift-time">{timeText}</span>
                    <span>{label}</span>
                </div>
            );
        });
    };

    // --- HELPERS CHO BỆNH NHÂN ---
    const renderPatientStatus = (room) => {
        if (room) return <span className="status-badge status-active">P.{room}</span>;
        return <span className="status-badge status-wait">Chờ khám</span>;
    };

    const filteredPatients = patientList.filter(p => 
        p.FullName.toLowerCase().includes(patientSearch.toLowerCase()) || 
        p.Phone.includes(patientSearch)
    );

    // --- RENDER CONTENT ---
    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="home-wrapper">
                         <h2 style={{marginBottom: '25px', color: '#111827'}}>Tổng quan tài khoản</h2>
                        {adminProfile ? (
                            <div className="profile-full-card">
                                {/* CỘT TRÁI */}
                                <div className="profile-left-col">
                                    <div style={{
                                        width: '120px', height: '120px', backgroundColor: 'white', 
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', 
                                        justifyContent: 'center', fontSize: '50px', color: '#0090e7', 
                                        marginBottom: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                    }}>
                                        <i className="fas fa-user-shield"></i>
                                    </div>
                                    <h2 style={{margin: 0, fontSize: '24px', fontWeight: '700'}}>{adminProfile.FullName}</h2>
                                    <p style={{opacity: 0.9, marginTop: '5px'}}>Quản trị viên</p>
                                    <div style={{
                                        marginTop: '15px', backgroundColor: 'rgba(255,255,255,0.25)', 
                                        padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold'
                                    }}>
                                        ID: {adminProfile.StaffID}
                                    </div>
                                </div>

                                {/* CỘT PHẢI */}
                                <div className="profile-right-col" style={{flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                    <h3 style={{borderBottom: '1px solid #e5e7eb', paddingBottom: '15px', marginBottom: '25px', color: '#374151'}}>
                                        Thông tin liên hệ
                                    </h3>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                                        {/* Ngày sinh */}
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <div style={{width: '40px', height: '40px', backgroundColor: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: '#0090e7'}}>
                                                <i className="fas fa-birthday-cake"></i>
                                            </div>
                                            <div>
                                                <div style={{fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase'}}>Ngày sinh</div>
                                                <div style={{fontSize: '16px', fontWeight: '500', color: '#111827'}}>
                                                    {new Date(adminProfile.DoB).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Email */}
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <div style={{width: '40px', height: '40px', backgroundColor: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: '#0090e7'}}>
                                                <i className="fas fa-envelope"></i>
                                            </div>
                                            <div>
                                                <div style={{fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase'}}>Email</div>
                                                <div style={{fontSize: '16px', fontWeight: '500', color: '#111827'}}>
                                                    {adminProfile.Email}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Phone */}
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <div style={{width: '40px', height: '40px', backgroundColor: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: '#0090e7'}}>
                                                <i className="fas fa-phone"></i>
                                            </div>
                                            <div>
                                                <div style={{fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase'}}>Số điện thoại</div>
                                                <div style={{fontSize: '16px', fontWeight: '500', color: '#111827'}}>
                                                    {adminProfile.Phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>Đang tải dữ liệu...</p>
                        )}
                    </div>
                );

            case 'patients':
                return (
                    <div className="patient-manager-container">
                        <div className="patient-header-row">
                            <div>
                                <h1 style={{fontSize:'26px', margin:0, color:'#111827'}}>Quản lý bệnh nhân</h1>
                                <p style={{color:'#6b7280', marginTop:'5px'}}>UC009: Manage Patient & Staff Info</p>
                            </div>
                            {/* NÚT THÊM MỚI -> Gọi handleOpenAddModal */}
                            <button className="btn-add-patient" onClick={handleOpenAddModal}>
                                <i className="fas fa-plus"></i> Thêm bệnh nhân
                            </button>
                        </div>

                        <div style={{marginBottom: '15px', fontWeight: '600', color: '#374151'}}>
                            <i className="fas fa-user-injured" style={{marginRight:'8px', color:'#0090e7'}}></i>
                            Danh sách bệnh nhân ({patientList.length})
                        </div>

                        <div className="search-container">
                            <i className="fas fa-search" style={{color:'#9ca3af'}}></i>
                            <input 
                                type="text" className="search-input" 
                                placeholder="Tìm kiếm theo tên hoặc sđt..." 
                                value={patientSearch}
                                onChange={(e) => setPatientSearch(e.target.value)}
                            />
                        </div>

                        <div className="patient-list">
                            {filteredPatients.length === 0 ? <p style={{textAlign:'center', color:'#999'}}>Không tìm thấy kết quả.</p> : 
                            filteredPatients.map(p => (
                                <div key={p.PatientID} className="patient-item-card">
                                    <div className="p-card-info">
                                        <h4>{p.FullName}</h4>
                                        <div className="p-card-meta">
                                            <span>{p.Age} tuổi</span>
                                            <span>{p.Gender === 'Male' ? 'Nam' : 'Nữ'}</span>
                                            <span>{p.Phone}</span>
                                        </div>
                                    </div>
                                    <div className="p-card-actions">
                                        {renderPatientStatus(p.CurrentRoom)}
                                        <button className="action-icon-btn"><i className="far fa-eye"></i></button>
                                        {/* NÚT SỬA -> Gọi handleOpenEditModal */}
                                        <button className="action-icon-btn" onClick={() => handleOpenEditModal(p)}>
                                            <i className="far fa-edit"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'staff':
                // 1. Kiểm tra an toàn: Đảm bảo staffList là một mảng
                const safeStaffList = Array.isArray(staffList) ? staffList : [];

                // 2. Lọc dữ liệu (Xử lý an toàn với null/undefined)
                const filteredStaff = safeStaffList.filter(s => {
                    // Lấy giá trị an toàn (nếu null thì coi là chuỗi rỗng '')
                    const role = s.Role || ''; 
                    const name = s.FullName || '';
                    const phone = s.Phone || '';
                    const search = staffSearch.toLowerCase();

                    // Logic lọc: Khớp chức vụ VÀ (Khớp tên HOẶC Khớp SĐT)
                    return role === staffFilter && 
                           (name.toLowerCase().includes(search) || phone.includes(search));
                });

                // 3. Đếm số lượng (Dùng safeStaffList để tránh lỗi)
                const countDoctors = safeStaffList.filter(s => s.Role === 'Doctor').length;
                const countNurses = safeStaffList.filter(s => s.Role === 'Nurse').length;

                return (
                    <div className="staff-manager-container">
                        {/* HEADER */}
                        <div className="patient-header-row">
                            <div>
                                <h1 style={{fontSize:'26px', margin:0, color:'#111827'}}>Quản lý nhân viên</h1>
                                <p style={{color:'#6b7280', marginTop:'5px'}}>UC009: Quản lý thông tin nhân viên y tế</p>
                            </div>
                            <button className="btn-add-patient" onClick={handleOpenAddStaffModal}>
                                <i className="fas fa-plus"></i> Thêm nhân viên
                            </button>
                        </div>

                        {/* THANH TAB */}
                        <div className="staff-tabs-container">
                            <button 
                                className={`staff-tab-btn ${staffFilter === 'Doctor' ? 'active' : ''}`}
                                onClick={() => setStaffFilter('Doctor')}
                            >
                                Bác sĩ ({countDoctors})
                            </button>
                            <button 
                                className={`staff-tab-btn ${staffFilter === 'Nurse' ? 'active' : ''}`}
                                onClick={() => setStaffFilter('Nurse')}
                            >
                                Điều dưỡng ({countNurses})
                            </button>
                        </div>

                        {/* DANH SÁCH */}
                        <div className="staff-list-box">
                            {/* Tiêu đề & Ô tìm kiếm */}
                            <div style={{marginBottom: '20px', fontWeight: '600', color: '#374151', display:'flex', alignItems:'center', gap:'10px'}}>
                                <i className={`fas ${staffFilter === 'Doctor' ? 'fa-user-md' : 'fa-user-nurse'}`} style={{color:'#0090e7', fontSize:'18px'}}></i>
                                <span>Danh sách {staffFilter === 'Doctor' ? 'bác sĩ' : 'điều dưỡng'}</span>
                            </div>

                            <div className="search-container">
                                <i className="fas fa-search" style={{color:'#9ca3af'}}></i>
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder={`Tìm kiếm ${staffFilter === 'Doctor' ? 'bác sĩ' : 'điều dưỡng'}...`}
                                    value={staffSearch}
                                    onChange={(e) => setStaffSearch(e.target.value)}
                                />
                            </div>

                            {/* Render thẻ nhân viên */}
                            <div className="patient-list">
                                {filteredStaff.length === 0 ? (
                                    <div style={{textAlign:'center', padding:'40px', color:'#9ca3af'}}>
                                        <i className="far fa-folder-open" style={{fontSize:'40px', marginBottom:'10px'}}></i>
                                        <p>Không tìm thấy nhân viên nào.</p>
                                    </div>
                                ) : (
                                    filteredStaff.map(s => (
                                        <div key={s.StaffID} className="patient-item-card">
                                            {/* Thông tin */}
                                            <div className="p-card-info">
                                                <h4 style={{fontSize:'16px', marginBottom:'4px', color:'#111827'}}>
                                                    {/* Xử lý hiển thị chức danh */}
                                                    <span style={{color:'#0090e7', marginRight:'5px'}}>
                                                        {s.Role === 'Doctor' ? 'BS.' : 'ĐD.'}
                                                    </span>
                                                    {s.FullName}
                                                </h4>
                                                <div className="p-card-meta">
                                                    {/* Nếu không có chuyên khoa thì hiện mặc định */}
                                                    <span style={{color:'#6b7280'}}>
                                                        <i className="fas fa-stethoscope" style={{fontSize:'12px', marginRight:'5px'}}></i>
                                                        {s.Specialization || (s.Role === 'Doctor' ? 'Đa khoa' : 'Điều dưỡng viên')}
                                                    </span>
                                                    
                                                    {/* Nếu có SĐT thì hiện, không thì ẩn */}
                                                    {s.Phone && (
                                                        <span style={{marginLeft:'15px'}}>
                                                            <i className="fas fa-phone-alt" style={{fontSize:'12px', marginRight:'5px'}}></i>
                                                            {s.Phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Hành động */}
                                            <div className="p-card-actions">
                                                {/* Badge trạng thái (Giả định Active nếu DB chưa có cột Status) */}
                                                <span className="status-badge status-active">Đang làm việc</span>
                                                
                                                <button className="action-icon-btn" onClick={() => handleOpenEditStaffModal(s)} title="Sửa thông tin">
                                                    <i className="far fa-edit"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'schedule':
                const daysOfWeek = getDaysInWeek();
                const weekRange = `${daysOfWeek[0].toLocaleDateString('vi-VN')} - ${daysOfWeek[6].toLocaleDateString('vi-VN')}`;

                return (
                    <div className="schedule-container">
                        <div className="schedule-header-row">
                            <div>
                                <h2 style={{margin: 0}}>Quản lý lịch làm việc</h2>
                                <p style={{color: '#666', marginTop: '5px'}}>Phân công ca trực (UC017)</p>
                            </div>
                            <button className="btn-add-shift">+ Thêm ca làm việc</button>
                        </div>

                        <div className="filter-bar">
                            <div className="date-nav">
                                <button className="btn-nav-arrow" onClick={() => changeWeek(-1)}>&lt;</button>
                                <i className="far fa-calendar-alt"></i> {weekRange}
                                <button className="btn-nav-arrow" onClick={() => changeWeek(1)}>&gt;</button>
                            </div>
                        </div>

                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th className="col-staff">Nhân viên</th>
                                    {daysOfWeek.map((day, index) => (
                                        <th key={index}>
                                            <div style={{textTransform: 'uppercase', fontSize: '12px', color: '#888'}}>Thứ {index === 6 ? 'CN' : index + 2}</div>
                                            <div style={{fontSize: '18px', marginTop: '5px'}}>{day.getDate()}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map(staff => (
                                    <tr key={staff.StaffID}>
                                        <td>
                                            <div className="staff-cell">
                                                <div className="staff-avatar-small">
                                                    <i className="fas fa-user"></i>
                                                </div>
                                                <div>
                                                    <div style={{fontWeight: 'bold'}}>{staff.FullName}</div>
                                                    <div style={{fontSize: '12px', color: '#666'}}>{staff.Role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {daysOfWeek.map((day, index) => (
                                            <td key={index} style={{height: '80px', verticalAlign: 'top'}}>
                                                {renderShift(staff.StaffID, day)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            default: return <h2>Chọn chức năng từ menu bên trái</h2>;
        }
    };

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand"><i className="fas fa-heartbeat logo-icon"></i> MediCare Admin</div>
                <nav className="sidebar-menu">
                    <div className={`menu-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><i className="fas fa-home"></i> Trang chủ</div>
                    <div className={`menu-link ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}><i className="fas fa-user-injured"></i> Bệnh nhân</div>
                    <div className={`menu-link ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}><i className="fas fa-users"></i> Nhân viên</div>
                    <div className={`menu-link ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}><i className="fas fa-calendar-alt"></i> Lịch làm việc</div>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-profile">
                        <span style={{color: '#374151'}}>Xin chào, <b>{user.FullName}</b></span>
                        <button className="btn-logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Đăng xuất</button>
                    </div>
                </header>

                <div className="admin-content-body">{renderContent()}</div>

                {/* MODAL THÊM / SỬA BỆNH NHÂN - FULL THÔNG TIN */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{width: '650px'}}>
                            <div className="modal-header">
                                <h3>{isEditing ? 'Chỉnh sửa hồ sơ' : 'Thêm bệnh nhân mới'}</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                {/* Hàng 1: Tên + Giới tính */}
                                <div style={{display:'flex', gap:'15px'}}>
                                    <div className="form-group" style={{flex:2}}>
                                        <label>Họ và Tên</label>
                                        <input type="text" className="form-input" required 
                                            value={formData.fullName} 
                                            onChange={e => setFormData({...formData, fullName: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Giới tính</label>
                                        <select className="form-select" 
                                            value={formData.gender}
                                            onChange={e => setFormData({...formData, gender: e.target.value})}
                                        >
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Hàng 2: Ngày sinh + SĐT */}
                                <div style={{display:'flex', gap:'15px'}}>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Ngày sinh</label>
                                        <input type="date" className="form-input" required 
                                            value={formData.dob} 
                                            onChange={e => setFormData({...formData, dob: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Số điện thoại</label>
                                        <input type="text" className="form-input" required 
                                            value={formData.phone} 
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {/* Hàng 3: Địa chỉ + Số phòng */}
                                <div style={{display:'flex', gap:'15px'}}>
                                    <div className="form-group" style={{flex:2}}>
                                        <label>Địa chỉ</label>
                                        <input type="text" className="form-input" required 
                                            value={formData.address} 
                                            onChange={e => setFormData({...formData, address: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Số phòng</label>
                                        <input type="text" className="form-input" placeholder="VD: 101"
                                            value={formData.currentRoom} 
                                            onChange={e => setFormData({...formData, currentRoom: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <hr style={{margin:'15px 0', border:'0', borderTop:'1px solid #eee'}} />

                                {/* Hàng 4: Email + Mật khẩu */}
                                <div style={{display:'flex', gap:'15px'}}>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Email</label>
                                        <input type="email" className="form-input" 
                                            value={formData.email} 
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Mật khẩu {isEditing && <small>(Để trống nếu không đổi)</small>}</label>
                                        <input type="password" className="form-input" placeholder={isEditing ? "******" : "Nhập mật khẩu"}
                                            value={formData.password} 
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {/* Hàng 5: Y tá phụ trách */}
                                <div className="form-group">
                                    <label>Y tá phụ trách</label>
                                    <select className="form-select" 
                                        value={formData.nurseId}
                                        onChange={e => setFormData({...formData, nurseId: e.target.value})}
                                    >
                                        <option value="">-- Chưa phân công --</option>
                                        {nurseList.map(nurse => (
                                            <option key={nurse.StaffID} value={nurse.StaffID}>
                                                {nurse.FullName} (ID: {nurse.StaffID})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className="btn-submit">
                                        {isEditing ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* MODAL THÊM / SỬA NHÂN VIÊN */}
                {showStaffModal && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{width: '600px'}}>
                            <div className="modal-header">
                                <h3>{isEditingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</h3>
                                <button className="close-btn" onClick={() => setShowStaffModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleStaffSubmit}>
                                <div className="form-group">
                                    <label>Họ và Tên</label>
                                    <input type="text" className="form-input" required 
                                        value={staffFormData.fullName} 
                                        onChange={e => setStaffFormData({...staffFormData, fullName: e.target.value})} 
                                    />
                                </div>
                                <div style={{display:'flex', gap:'15px'}}>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Chức vụ</label>
                                        <select className="form-select" value={staffFormData.role} onChange={e => setStaffFormData({...staffFormData, role: e.target.value})}>
                                            <option value="Doctor">Bác sĩ</option>
                                            <option value="Nurse">Điều dưỡng</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Chuyên khoa / Khoa</label>
                                        <input type="text" className="form-input" placeholder="VD: Tim mạch"
                                            value={staffFormData.specialization} 
                                            onChange={e => setStaffFormData({...staffFormData, specialization: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div style={{display:'flex', gap:'15px'}}>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Số điện thoại</label>
                                        <input type="text" className="form-input" required
                                            value={staffFormData.phone} 
                                            onChange={e => setStaffFormData({...staffFormData, phone: e.target.value})} 
                                        />
                                    </div>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Email</label>
                                        <input type="email" className="form-input"
                                            value={staffFormData.email} 
                                            onChange={e => setStaffFormData({...staffFormData, email: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Mật khẩu {isEditingStaff && <small>(Để trống nếu không đổi)</small>}</label>
                                    <input type="password" className="form-input" placeholder="******"
                                        value={staffFormData.password} 
                                        onChange={e => setStaffFormData({...staffFormData, password: e.target.value})} 
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowStaffModal(false)}>Hủy</button>
                                    <button type="submit" className="btn-submit">{isEditingStaff ? 'Cập nhật' : 'Thêm mới'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
export default AdminDashboard;