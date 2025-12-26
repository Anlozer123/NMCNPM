// client/src/components/PrescriptionForm.js
import React, { useState, useEffect } from 'react';
import './PrescriptionForm.css';

const PrescriptionForm = ({ patientId, doctorId }) => {
    const [drugList, setDrugList] = useState([]);
    
    // State lưu danh sách thuốc
    const [medications, setMedications] = useState([
        { medicineId: '', quantity: '', drugName: '', dosage: '', frequency: '', note: '' }
    ]);

    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/doctor/medicines');
                const data = await res.json();
                setDrugList(data);
            } catch (error) {
                console.error("Lỗi tải thuốc:", error);
            }
        };
        fetchMedicines();
    }, [patientId]);

    const handleDrugChange = (index, event) => {
        const values = [...medications];
        const selectedDrugId = event.target.value;
        const selectedDrug = drugList.find(d => d.MedicineID.toString() === selectedDrugId);

        values[index].medicineId = selectedDrugId;
        values[index].drugName = selectedDrug ? selectedDrug.Name : '';
        setMedications(values);
    };

    const handleChange = (index, event) => {
        const values = [...medications];
        let val = event.target.value;

        if (event.target.name === 'quantity') {
            if (val < 0) val = '';
        }

        values[index][event.target.name] = val;
        setMedications(values);
    };

    const handleAddDrug = () => {
        setMedications([...medications, { medicineId: '', quantity: '', drugName: '', dosage: '', frequency: '', note: '' }]);
    };

    const handleRemoveDrug = (index) => {
        const values = [...medications];
        values.splice(index, 1);
        setMedications(values);
    };

    const handleSubmit = async () => {
        // 1. Kiểm tra Chẩn đoán bắt buộc
        if (!diagnosis.trim()) {
            alert("Vui lòng nhập Chẩn đoán. Đây là thông tin bắt buộc.");
            return;
        }

        // 2. Kiểm tra chi tiết từng dòng thuốc
        for (let i = 0; i < medications.length; i++) {
            const m = medications[i];
            const drugNum = i + 1;

            if (!m.medicineId) {
                alert(`Lỗi ở Thuốc #${drugNum}: Vui lòng chọn tên thuốc.`);
                return;
            }
            if (!m.quantity || parseInt(m.quantity) <= 0) {
                alert(`Lỗi ở Thuốc #${drugNum}: Vui lòng nhập số lượng hợp lệ (> 0).`);
                return;
            }
            // Kiểm tra Liều dùng không được để trống
            if (!m.dosage || !m.dosage.trim()) {
                alert(`Lỗi ở Thuốc #${drugNum}: Vui lòng nhập liều dùng.`);
                return;
            }
            // Kiểm tra Cách sử dụng không được để trống
            if (!m.frequency) {
                alert(`Lỗi ở Thuốc #${drugNum}: Vui lòng chọn cách sử dụng (tần suất).`);
                return;
            }
        }

        try {
            const response = await fetch('http://localhost:5000/api/doctor/prescribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId, 
                    doctorId,
                    diagnosis,
                    notes,
                    medications
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Kê đơn thành công!");
                setMedications([{ medicineId: '', quantity: '', drugName: '', dosage: '', frequency: '', note: '' }]);
                setDiagnosis('');
                setNotes('');
            } else {
                alert("❌ Lỗi: " + data.msg);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Không thể kết nối tới Server");
        }
    };

    const commonInputStyle = { 
        width: '100%', 
        height: '40px',             
        padding: '0 10px',          
        boxSizing: 'border-box',    
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px',
        lineHeight: '40px',         
        display: 'block',
        textAlign: 'left' 
    };

    const labelStyle = {
        fontSize: '13px', 
        fontWeight: '600', 
        color: '#444',
        display: 'block',
        marginBottom: '8px',
        whiteSpace: 'nowrap',
        textAlign: 'left' 
    };

    return (
        <div className="prescription-container" style={{ background: '#fff', textAlign: 'left' }}>
            
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={labelStyle}>Chẩn đoán (*):</label>
                <input 
                    type="text" 
                    value={diagnosis} 
                    onChange={(e) => setDiagnosis(e.target.value)} 
                    placeholder="VD: Viêm họng cấp (Bắt buộc)" 
                    style={commonInputStyle} 
                />
            </div>
            
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={labelStyle}>Ghi chú:</label>
                <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="VD: Tái khám sau 7 ngày" 
                    style={{ ...commonInputStyle, height: '60px', lineHeight: 'normal', paddingTop: '10px' }} 
                />
            </div>

            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

            {medications.map((medication, index) => (
                <div key={index} className="drug-item" style={{ marginBottom: '15px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#008CBA' }}>Thuốc #{index + 1}</span>
                        {index > 0 && (
                            <button onClick={() => handleRemoveDrug(index)} style={{ background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>
                                Xóa dòng
                            </button>
                        )}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' }}>
                        <div>
                            <label style={labelStyle}>Tên thuốc (*)</label>
                            <select value={medication.medicineId} onChange={(e) => handleDrugChange(index, e)} style={commonInputStyle}>
                                <option value="">-- Chọn thuốc --</option>
                                {drugList.map(drug => (
                                    <option key={drug.MedicineID} value={drug.MedicineID}>
                                        {drug.Name} (Tồn: {drug.StockQuantity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Số lượng (*)</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                placeholder="Nhập số lượng" 
                                min="1"
                                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                value={medication.quantity} 
                                onChange={(e) => handleChange(index, e)} 
                                style={commonInputStyle} 
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Liều dùng (*)</label>
                            <input 
                                name="dosage" 
                                placeholder="VD: 1 viên/lần (Bắt buộc)" 
                                value={medication.dosage} 
                                onChange={(e) => handleChange(index, e)} 
                                style={commonInputStyle} 
                            />
                        </div>
                        
                        <div>
                            <label style={labelStyle}>Cách sử dụng (*)</label>
                            <select name="frequency" value={medication.frequency} onChange={(e) => handleChange(index, e)} style={commonInputStyle}>
                                <option value="">-- Chọn (Bắt buộc) --</option>
                                <option value="Sáng">Sáng</option>
                                <option value="Trưa">Trưa</option>
                                <option value="Tối">Tối</option>
                                <option value="Sáng - Trưa">Sáng - Trưa</option>
                                <option value="Sáng - Tối">Sáng - Tối</option>
                                <option value="Trưa - Tối">Trưa - Tối</option>
                                <option value="Sáng - Trưa - Tối">Sáng - Trưa - Tối</option>
                            </select>
                        </div>
                    </div>
                </div>
            ))}

            <div style={{ marginTop: '20px', textAlign: 'left' }}>
                <button onClick={handleAddDrug} style={{ marginRight: '10px', padding: '10px 20px', background: 'white', border: '1px solid #008CBA', color: '#008CBA', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                    + Thêm dòng
                </button>
                <button onClick={handleSubmit} style={{ padding: '10px 20px', background: '#008CBA', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                    Lưu đơn thuốc
                </button>
            </div>
        </div>
    );
};

export default PrescriptionForm;