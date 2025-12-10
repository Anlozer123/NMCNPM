// client/src/components/PrescriptionHistory.js
import React, { useState, useEffect } from 'react';

const PrescriptionHistory = ({ patientId }) => {
    const [history, setHistory] = useState(null);

    useEffect(() => {
        if (!patientId) return;
        const fetchHistory = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/doctor/history/${patientId}`);
                const data = await res.json();
                setHistory(data);
            } catch (error) {
                console.error("Lỗi tải lịch sử:", error);
            }
        };
        fetchHistory();
    }, [patientId]);

    if (!history || Object.keys(history).length === 0) {
        return <p style={{ color: '#888', fontStyle: 'italic', padding: '10px' }}>Chưa có lịch sử đơn thuốc.</p>;
    }

    return (
        <div className="history-container" style={{ height: '100%', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '15px', borderBottom: '2px solid #008CBA', paddingBottom: '5px' }}>
                📜 Lịch sử dùng thuốc
            </h3>
            
            {Object.keys(history).map(prescriptionId => {
                const item = history[prescriptionId];
                return (
                    <div key={prescriptionId} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        {/* Header: Ngày & Bác sĩ */}
                        <div style={{ padding: '10px 15px', background: '#f8f9fa', borderBottom: '1px solid #eee', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ color: '#008CBA' }}>📅 {new Date(item.date).toLocaleDateString('vi-VN')}</strong>
                                <span style={{ fontSize: '12px', color: '#666', background: '#e9ecef', padding: '3px 8px', borderRadius: '10px' }}>BS: {item.doctor}</span>
                            </div>
                        </div>

                        {/* Chẩn đoán & Ghi chú */}
                        <div style={{ padding: '10px 15px', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                            <div style={{ marginBottom: '5px' }}><span style={{ fontWeight: 'bold', color: '#555' }}>Chẩn đoán: </span><span>{item.diagnosis || 'Không có'}</span></div>
                            <div><span style={{ fontWeight: 'bold', color: '#555' }}>Ghi chú: </span><span style={{ fontStyle: 'italic', color: '#777' }}>{item.notes || 'Không có'}</span></div>
                        </div>
                        
                        {/* Bảng danh sách thuốc */}
                        <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f1f1f1', color: '#444' }}>
                                <tr>
                                    <th style={{ padding: '8px', textAlign: 'left', width: '45%' }}>Tên thuốc</th>
                                    <th style={{ padding: '8px', textAlign: 'center', width: '20%' }}>SL</th>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>Cách dùng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.drugs.map((drug, index) => (
                                    <tr key={index} style={{ borderBottom: index < item.drugs.length - 1 ? '1px solid #f9f9f9' : 'none' }}>
                                        <td style={{ padding: '8px', fontWeight: '500' }}>{drug.name}</td>
                                        
                                        {/* --- Cột SL: Giữ nguyên logic thêm chữ 'viên' --- */}
                                        <td style={{ padding: '8px', textAlign: 'center', color: '#d63384', fontWeight: 'bold' }}>
                                            {drug.quantity} viên
                                        </td>
                                        
                                        {/* --- ĐÃ SỬA: Thêm chữ 'viên' vào trước '/ 1 lần' --- */}
                                        <td style={{ padding: '8px', color: '#555' }}>
                                            {drug.dosage} viên/ 1 lần, {drug.frequency} <br/>
                                            <span style={{ fontSize: '11px', color: '#888' }}>({drug.duration})</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
};

export default PrescriptionHistory;