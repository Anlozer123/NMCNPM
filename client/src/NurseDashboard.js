import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NurseDashboard.css';

function NurseDashboard() {
    // --- STATE QUẢN LÝ TAB & NAVIGATION ---
    const [activeTab, setActiveTab] = useState('patients'); // Mặc định vào tab Bệnh nhân
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'ĐD. Phạm Thị X', StaffID: 3 };

    // --- DATA STATES (CÁC BIẾN DỮ LIỆU TỪ SERVER) ---
    const [instructions, setInstructions] = useState([]);       // UC010: Chỉ thị
    const [patientRequests, setPatientRequests] = useState([]); // UC013: Yêu cầu BN
    const [equipList, setEquipList] = useState([]);             // UC011: DS Thiết bị
    const [equipRequests, setEquipRequests] = useState([]);     // UC011: Lịch sử thiết bị
    const [myPatients, setMyPatients] = useState([]);           // UC12: DS Bệnh nhân phụ trách (MỚI)

    // --- STATE CHO FORM YÊU CẦU VẬT TƯ (UC011) ---
    const [selectedEquip, setSelectedEquip] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [urgency, setUrgency] = useState('Normal');
    const [reason, setReason] = useState('');

    // --- STATE CHO XỬ LÝ YÊU CẦU BỆNH NHÂN (UC013) ---
    const [expandedReqId, setExpandedReqId] = useState(null); 
    const [processNote, setProcessNote] = useState(''); 

    // State thống kê cho dashboard
    const [nurseStats, setNurseStats] = useState({
        instructionCount: 0,
        requestCount: 0,
        patientCount: 0,
        equipApprovedCount: 0,
        equipPendingCount: 0
    });
    
    // --- EFFECT: Nạp Font Awesome --- cho icons
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
        document.head.appendChild(link);
    }, []);

    useEffect(() => {
        const nurseId = user.StaffID || 3;

        // 1. Tab Trang chủ (HOME)
        if (activeTab === 'home') {
            // Lấy thống kê
            fetch(`http://localhost:5000/api/nurse/stats?id=${nurseId}`)
                .then(res => res.json())
                .then(data => setNurseStats(data))
                .catch(err => console.error("Lỗi stats:", err));
            
            // Xóa fetch profile ở đây nếu không dùng tới nữa (để tránh warning)
        }

        // 2. Tab Chỉ thị (INSTRUCTIONS)
        if (activeTab === 'instructions') {
            fetch('http://localhost:5000/api/nurse/doctor-instructions')
                .then(res => res.json())
                .then(data => Array.isArray(data) && setInstructions(data))
                .catch(console.log);
        }

        // 3. Tab Thiết bị (EQUIPMENT)
        if (activeTab === 'equipment') {
            // Lấy danh sách thiết bị (để chọn trong form)
            fetch('http://localhost:5000/api/nurse/equipments')
                .then(res => res.json())
                .then(data => Array.isArray(data) && setEquipList(data))
                .catch(console.log);
            
            // Lấy lịch sử yêu cầu
            fetch('http://localhost:5000/api/nurse/equipment-requests')
                .then(res => res.json())
                .then(data => Array.isArray(data) && setEquipRequests(data))
                .catch(console.log);
        }

        // 4. Tab Yêu cầu (REQUESTS)
        if (activeTab === 'requests') {
            fetch('http://localhost:5000/api/nurse/patient-requests')
                .then(res => res.json())
                .then(data => Array.isArray(data) && setPatientRequests(data))
                .catch(console.log);
        }

        // 5. Tab Bệnh nhân (PATIENTS)
        if (activeTab === 'patients') {
            fetch(`http://localhost:5000/api/nurse/my-patients?nurseId=${nurseId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setMyPatients(data);
                })
                .catch(err => console.log("Lỗi lấy DS bệnh nhân:", err));
        }

    }, [activeTab, user.StaffID]);

    // ============================================================
    // CÁC HÀM XỬ LÝ SỰ KIỆN (HANDLERS)
    // ============================================================
    
    // UC010: Hoàn thành chỉ thị
    const handleCompleteInstruction = (id) => {
        if (!window.confirm("Xác nhận đã hoàn thành chỉ thị này?")) return;
        fetch('http://localhost:5000/api/nurse/complete-instruction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ instructionId: id })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            setInstructions(prev => prev.filter(item => item.InstructionID !== id));
        });
    };

    // UC011: Gửi yêu cầu vật tư
    const handleSendEquipmentRequest = (e) => {
        e.preventDefault();
        const selectedItem = equipList.find(item => item.EquipmentID.toString() === selectedEquip.toString());

        if (selectedItem) {
            if (selectedItem.Quantity === 0) {
                alert("Sản phẩm này đã HẾT HÀNG trong kho!");
                return;
            }
            if (parseInt(quantity) > selectedItem.Quantity) {
                alert(`Không đủ hàng! Kho chỉ còn ${selectedItem.Quantity} cái.`);
                return;
            }
        }

        const payload = {
            itemId: selectedEquip,
            quantity: quantity,
            urgency: urgency,
            reason: reason,
            nurseId: user.StaffID || 3,
            patientId: selectedPatient || null
        };

        fetch('http://localhost:5000/api/nurse/request-equipment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra");
            return data;
        })
        .then(data => {
            alert(data.message);
            setReason(''); setQuantity(''); setSelectedEquip(''); setSelectedPatient('');
            return fetch('http://localhost:5000/api/nurse/equipment-requests');
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setEquipRequests(data);
        })
        .catch(err => alert(err.message));
    };

    // UC013: Xử lý yêu cầu BN
    const handleExpandRequest = (id) => {
        setExpandedReqId(id);
        setProcessNote(''); 
    };

    const handleCancelProcess = () => {
        setExpandedReqId(null);
    };

    const handleConfirmRequest = (id) => {
    // Kiểm tra xem đã nhập ghi chú chưa (nếu cần)
    // if (!processNote.trim()) return alert("Vui lòng nhập ghi chú!");

    fetch('http://localhost:5000/api/nurse/handle-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            requestId: id, 
            status: 'Completed', 
            note: processNote // Đảm bảo biến này có giá trị
        })
    })
    .then(async (res) => {
        const data = await res.json();
        
        // --- ĐOẠN QUAN TRỌNG: CHECK LỖI ---
        if (!res.ok) {
            // Nếu server trả về lỗi (400, 500...), ném lỗi ra để nhảy xuống catch
            throw new Error(data.error || "Lỗi server không xác định");
        }
        return data;
    })
    .then(data => {
        // Chỉ chạy vào đây khi Backend báo thành công
        alert(data.message);
        setExpandedReqId(null);
        // Lúc này mới cập nhật giao diện xóa item đi
        setPatientRequests(prev => prev.filter(req => req.RequestID !== id));
    })
    .catch(err => {
        // Nếu có lỗi, hiện thông báo và KHÔNG xóa item khỏi giao diện
        console.error("Lỗi:", err);
        alert("Không thể xử lý yêu cầu: " + err.message);
    });
};

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    // Hàm render badge trạng thái thiết bị (Fix lỗi renderEquipStatus is not defined)
    const renderEquipStatus = (status) => {
        let className = 'tag-pending';
        if (status === 'Approved') className = 'tag-approved';
        if (status === 'Rejected') className = 'tag-rejected';
        if (status === 'Delivered') className = 'tag-delivered';
        return <span className={`status-tag ${className}`}>{status}</span>;
    };
    
    // ============================================================
    // RENDER GIAO DIỆN CHÍNH
    // ============================================================
    const renderContent = () => {
        switch (activeTab) {
            // --- TRANG CHỦ DASHBOARD ---
            case 'home':
                return (
                    <div className="home-container">
                        {/* Header Chào Mừng */}
                        <div className="welcome-section">
                            <h2 className="welcome-title">Xin chào,</h2>
                            <p className="welcome-sub">Chúc bạn một ngày mới tốt lành nhé !</p>
                        </div>

                        {/* Hàng 1: 3 Thẻ (Chỉ thị, Yêu cầu chưa xử lý, Bệnh nhân đảm nhận) */}
                        <div className="stats-grid-top">
                            {/* Card 1: Chỉ thị */}
                            <div className="stat-card">
                                <div className="card-header-row">
                                    <div className="stat-icon-box"><i className="fas fa-file-invoice"></i></div>
                                    <span className="stat-title">Chỉ thị</span>
                                </div>
                                <div className="stat-count">{nurseStats.instructionCount}</div>
                            </div>

                            {/* Card 2: Yêu cầu chưa xử lý */}
                            <div className="stat-card">
                                <div className="card-header-row">
                                    <div className="stat-icon-box"><i className="fas fa-code-branch"></i></div>
                                    <span className="stat-title">Yêu cầu chưa được xử lý</span>
                                </div>
                                <div className="stat-count">{nurseStats.requestCount}</div>
                            </div>

                            {/* Card 3: Bệnh nhân đảm nhận */}
                            <div className="stat-card">
                                <div className="card-header-row">
                                    <div className="stat-icon-box"><i className="fas fa-users"></i></div>
                                    <span className="stat-title">Bệnh nhân đảm nhận</span>
                                </div>
                                <div className="stat-count">{nurseStats.patientCount}</div>
                            </div>
                        </div>

                        {/* Hàng 2: 2 Thẻ (Thiết bị đã duyệt, Thiết bị chưa duyệt) */}
                        <div className="stats-grid-bottom">
                            {/* Card 4: Thiết bị đã duyệt */}
                            <div className="stat-card">
                                <div className="card-header-row">
                                    <div className="stat-icon-box"><i className="fas fa-check"></i></div>
                                    <span className="stat-title">Thiết bị đã duyệt</span>
                                </div>
                                <div className="stat-count">{nurseStats.equipApprovedCount}</div>
                            </div>

                            {/* Card 5: Thiết bị chưa duyệt (Có viền xanh) */}
                            <div className="stat-card stat-card-highlight">
                                <div className="card-header-row">
                                    <div className="stat-icon-box"><i className="fas fa-ellipsis-h"></i></div>
                                    <span className="stat-title">Thiết bị chưa duyệt</span>
                                </div>
                                <div className="stat-count">{nurseStats.equipPendingCount}</div>
                            </div>
                        </div>
                    </div>
                );

            // --- VIEW UC12: DANH SÁCH BỆNH NHÂN (HORIZONTAL ROW) ---
            case 'patients':
                return (
                    <div style={{width: '100%'}}>
                        <h1 className="dashboard-title">Danh sách bệnh nhân phụ trách</h1>
                        <p className="sub-title">UC012: Manage Patients - Theo dõi thông tin các bệnh nhân được phân công</p>
                        
                        <div className="patient-grid">
                            {myPatients.length === 0 ? (
                                <p style={{color: '#999', textAlign: 'center', padding: '20px'}}>
                                    Bạn chưa được phân công phụ trách bệnh nhân nào.
                                </p>
                            ) : (
                                myPatients.map(p => (
                                    <div key={p.PatientID} className="patient-card">
                                        {/* Avatar */}
                                        <div className={`patient-avatar ${p.Gender === 'Female' ? 'avatar-female' : 'avatar-male'}`}>
                                            <i className={`fas fa-${p.Gender === 'Female' ? 'female' : 'male'}`}></i>
                                        </div>
                                        
                                        {/* Nội dung chính */}
                                        <div className="patient-info">
                                            
                                            {/* Dòng 1: Tên - ID (Badge) - Phòng */}
                                            <div className="card-top-line">
                                                <h3 className="p-name">{p.FullName}</h3>
                                                
                                                {/* ID nằm trong thẻ riêng */}
                                                <span className="p-id-badge">ID: {p.PatientID}</span>

                                                {/* Phòng nằm mép phải */}
                                                <span className="p-room-badge">
                                                    {p.CurrentRoom || 'Chưa xếp phòng'}
                                                </span>
                                            </div>

                                            {/* Dòng 2: Các thông tin xếp hàng ngang */}
                                            <div className="card-details-line">
                                                {/* Ngày sinh */}
                                                <div className="info-group">
                                                    <span className="info-label">Ngày sinh:</span>
                                                    <span className="info-value">
                                                        {new Date(p.DoB).toLocaleDateString('vi-VN')} ({p.Age} tuổi)
                                                    </span>
                                                </div>

                                                {/* SĐT */}
                                                <div className="info-group">
                                                    <span className="info-label">SĐT:</span>
                                                    <span className="info-value">{p.Phone}</span>
                                                </div>

                                                {/* Địa chỉ */}
                                                <div className="info-group">
                                                    <span className="info-label">Địa chỉ:</span>
                                                    <span className="info-value">{p.Address}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );

            // --- VIEW UC010: CHỈ THỊ ---
            case 'instructions':
                return (
                    <div>
                        <h1 className="dashboard-title">Thực hiện chỉ thị bác sĩ</h1>
                        <p className="sub-title">UC010: Execute Doctor's Instructions - Nhận và thực hiện chỉ thị chuyên môn</p>
                        <div style={{ maxWidth: '900px' }}>
                            <div className="section-header">
                                <span className="section-icon"><i className="fas fa-clipboard-list"></i></span>
                                <span className="section-title">Chỉ thị cần thực hiện ({instructions.length})</span>
                            </div>
                            <div className="card-list-container">
                                {instructions.length === 0 ? <p style={{textAlign: 'center', color: '#999'}}>Không có chỉ thị nào.</p> : 
                                    instructions.map(ins => (
                                        <div key={ins.InstructionID} className="instruction-card">
                                            <div className="card-top-row">
                                                <span className="badge-pending">Chưa hoàn thành</span>
                                                <span className="time-text">{formatTime(ins.CreatedAt)}</span>
                                            </div>
                                            <div className="patient-row">{ins.PatientName} - {ins.CurrentRoom || 'Chưa xếp phòng'}</div>
                                            <div className="doctor-source">Từ: BS. {ins.DoctorName}</div>
                                            <div className="instruction-box">{ins.Instruction}</div>
                                            <button className="btn-complete-outline" onClick={() => handleCompleteInstruction(ins.InstructionID)}>
                                                Đánh dấu hoàn thành
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                );

            // --- VIEW UC011: YÊU CẦU VẬT TƯ ---
            case 'equipment':
                return (
                    <div>
                        <h1 className="dashboard-title">Yêu cầu thiết bị y tế</h1>
                        <p className="sub-title">UC011: Request Medical Equipment - Tạo yêu cầu cung cấp thiết bị và vật tư</p>
                        <div className="equipment-layout">
                            <div className="left-col">
                                <div className="form-card">
                                    <div className="equip-section-title"><i className="fas fa-cube icon-blue"></i> Tạo yêu cầu mới</div>
                                    <p className="equip-section-desc">Điền thông tin thiết bị cần yêu cầu</p>
                                    <form onSubmit={handleSendEquipmentRequest}>
                                        <label className="form-label">Loại thiết bị</label>
                                        <select className="custom-select" value={selectedEquip} onChange={(e) => setSelectedEquip(e.target.value)} required>
                                            <option value="">-- Chọn loại thiết bị --</option>
                                            {equipList.map(eq => <option key={eq.EquipmentID} value={eq.EquipmentID}>{eq.Name} (Tồn: {eq.Quantity})</option>)}
                                        </select>
                                        <label className="form-label">Số lượng</label>
                                        <input type="number" className="custom-input" placeholder="Nhập số lượng" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                                        <label className="form-label">Bệnh nhân (ID)</label>
                                        <input type="number" className="custom-input" placeholder="Nhập ID bệnh nhân cần sử dụng" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} />
                                        <label className="form-label">Mức độ khẩn cấp</label>
                                        <select className="custom-select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                                            <option value="Low">Thấp</option><option value="Normal">Bình thường</option><option value="High">Cao</option><option value="Critical">Khẩn cấp</option>
                                        </select>
                                        <label className="form-label">Lý do yêu cầu</label>
                                        <textarea className="custom-textarea" rows="3" placeholder="Mô tả lý do..." value={reason} onChange={(e) => setReason(e.target.value)} required></textarea>
                                        <button type="submit" className="btn-submit-request"><i className="fas fa-paper-plane"></i> Gửi yêu cầu</button>
                                    </form>
                                </div>
                            </div>
                            <div className="right-col">
                                <div className="equip-section-title"><i className="fas fa-history icon-orange"></i> Yêu cầu gần đây</div>
                                <p className="equip-section-desc">Lịch sử các yêu cầu thiết bị</p>
                                <div className="history-list">
                                    {equipRequests.length === 0 ? <p style={{color: '#999'}}>Chưa có yêu cầu nào.</p> : 
                                        equipRequests.map(req => (
                                            <div key={req.RequestID} className="history-card">
                                                <div className="history-info">
                                                    <h4>{req.EquipmentName}</h4>
                                                    <div style={{fontSize: '13px', color: '#555'}}>Số lượng: {req.Quantity}</div>
                                                    <div className="history-date">{new Date(req.RequestDate).toLocaleDateString('vi-VN')}</div>
                                                </div>
                                                {renderEquipStatus(req.Status)}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                );

            // --- VIEW UC013: YÊU CẦU BỆNH NHÂN ---
            case 'requests':
                return (
                    <div>
                        <h1 className="dashboard-title">Xử lý yêu cầu bệnh nhân</h1>
                        <p className="sub-title">UC013: Handle Patient Request - Tiếp nhận và xử lý yêu cầu từ bệnh nhân</p>
                        <div style={{ maxWidth: '900px' }}>
                            <div className="section-header">
                                <span className="section-icon"><i className="fas fa-bell" style={{color: '#ff5252'}}></i></span>
                                <span className="section-title">Yêu cầu chờ xử lý ({patientRequests.length})</span>
                            </div>
                            <div className="card-list-container">
                                {patientRequests.length === 0 ? <p style={{textAlign: 'center', color: '#999'}}>Không có yêu cầu nào.</p> : 
                                    patientRequests.map(req => (
                                        <div key={req.RequestID} className="instruction-card">
                                            <div className="card-top-row">
                                                <span className="badge-red-pending">Chưa xử lý</span>
                                                <span className="time-text">{formatTime(req.CreatedAt)}</span>
                                            </div>
                                            <div className="patient-row">{req.PatientName} - {req.CurrentRoom || 'Chưa xếp phòng'}</div>
                                            <div className="req-content-box">{req.Content}</div>
                                            {expandedReqId === req.RequestID ? (
                                                <div className="process-form">
                                                    <textarea className="process-note-input" rows="2" placeholder="Ghi chú xử lý..." value={processNote} onChange={(e) => setProcessNote(e.target.value)}></textarea>
                                                    <div className="action-row">
                                                        <button className="btn-confirm-blue" onClick={() => handleConfirmRequest(req.RequestID)}><i className="fas fa-check"></i> Xác nhận đã xử lý</button>
                                                        <button className="btn-cancel-white" onClick={handleCancelProcess}>Hủy</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button className="btn-process-start" onClick={() => handleExpandRequest(req.RequestID)}>Xử lý yêu cầu</button>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                );

            default: return <h2>Chức năng đang phát triển</h2>;
        }
    };

    return (
        <div className="dashboard-layout">
            <header className="top-header">
                <div className="header-logo"><i className="fas fa-heartbeat logo-icon"></i><span>MediCare Hospital</span></div>
                <div className="header-user"><span><strong>{user.FullName}</strong></span><button className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Đăng xuất</button></div>
            </header>

            <div className="body-container">
                <aside className="sidebar">
                    <div className={`menu-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                        <span className="menu-icon"><i className="fas fa-home"></i></span> Trang chủ
                    </div>
                    <div className={`menu-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
                        <span className="menu-icon"><i className="fas fa-user-injured"></i></span> Bệnh nhân
                    </div>
                    <div className={`menu-item ${activeTab === 'instructions' ? 'active' : ''}`} onClick={() => setActiveTab('instructions')}>
                        <span className="menu-icon"><i className="fas fa-clipboard-list"></i></span> Chỉ thị
                    </div>
                    <div className={`menu-item ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => setActiveTab('equipment')}>
                        <span className="menu-icon"><i className="fas fa-syringe"></i></span> Thiết bị
                    </div>
                    <div className={`menu-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
                        <span className="menu-icon"><i className="fas fa-bell"></i></span> Yêu cầu
                    </div>
                </aside>

                <main className="main-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default NurseDashboard;