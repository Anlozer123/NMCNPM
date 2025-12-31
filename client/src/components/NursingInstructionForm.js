import React, { useState, useEffect } from 'react';
import { IoSendOutline } from "react-icons/io5";
import './NursingInstruction.css'; // Import file CSS

const NursingInstructionForm = ({ patientId, doctorId, onInstructionSent }) => {
    const [nurses, setNurses] = useState([]);
    const [instruction, setInstruction] = useState({
        type: 'Chăm sóc cơ bản',
        priority: 'Thường quy',
        nurseId: '',
        content: ''
    });

    useEffect(() => {
        const fetchNurses = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/doctor/nurses');
                const data = await res.json();
                setNurses(data);
            } catch (error) {
                console.error("Lỗi tải danh sách điều dưỡng:", error);
            }
        };
        fetchNurses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!instruction.content.trim() || !instruction.nurseId) {
            alert("Vui lòng nhập nội dung và chọn điều dưỡng thực hiện.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/doctor/send-instruction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    doctorId,
                    nurseId: instruction.nurseId,
                    type: instruction.type,
                    priority: instruction.priority,
                    content: instruction.content
                })
            });

            if (response.ok) {
                alert("✅ Gửi chỉ thị thành công!");
                setInstruction({ ...instruction, content: '', nurseId: '' });
                if (onInstructionSent) onInstructionSent();
            } else {
                alert("❌ Lỗi khi gửi chỉ thị.");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối tới Server.");
        }
    };

    return (
        <div className="ni-container">
            <div className="ni-header">
                <IoSendOutline size={24} color="#0081c9" />
                <div>
                    <h3 className="ni-title">Gửi chỉ thị điều dưỡng</h3>
                    <p className="ni-subtitle">UC006: Đưa ra hướng dẫn chăm sóc cho ĐD</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="ni-form-grid">
                    <div>
                        <label className="ni-label">Điều dưỡng thực hiện (*)</label>
                        <select 
                            className="ni-select"
                            value={instruction.nurseId}
                            onChange={(e) => setInstruction({...instruction, nurseId: e.target.value})}
                        >
                            <option value="">-- Chọn ĐD --</option>
                            {nurses.map(nurse => (
                                <option key={nurse.StaffID} value={nurse.StaffID}>
                                    {nurse.FullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="ni-label">Loại chỉ thị</label>
                        <select 
                            className="ni-select"
                            value={instruction.type}
                            onChange={(e) => setInstruction({...instruction, type: e.target.value})}
                        >
                            <option>Chăm sóc cơ bản</option>
                            <option>Theo dõi y tế</option>
                            <option>Vật lý trị liệu</option>
                            <option>Dinh dưỡng</option>
                        </select>
                    </div>

                    <div>
                        <label className="ni-label">Mức độ ưu tiên</label>
                        <select 
                            className="ni-select"
                            value={instruction.priority}
                            onChange={(e) => setInstruction({...instruction, priority: e.target.value})}
                        >
                            <option>Thường quy</option>
                            <option>Ưu tiên</option>
                            <option>Khẩn cấp</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label className="ni-label">Nội dung chi tiết (*)</label>
                    <textarea 
                        className="ni-textarea"
                        placeholder="VD: Theo dõi mạch, huyết áp mỗi 2 giờ. Báo ngay nếu sốt trên 39 độ..."
                        value={instruction.content}
                        onChange={(e) => setInstruction({...instruction, content: e.target.value})}
                    />
                </div>

                <button type="submit" className="ni-btn-submit">
                    <IoSendOutline /> Gửi chỉ thị
                </button>
            </form>
        </div>
    );
};

export default NursingInstructionForm;