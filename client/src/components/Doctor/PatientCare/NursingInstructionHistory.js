import React from 'react';
import { LuClock3 } from "react-icons/lu";
import { FaUserNurse, FaCheckCircle, FaSpinner } from "react-icons/fa";
import './NursingInstruction.css';

const NursingInstructionHistory = ({ history }) => {
    
    // Hàm helper (Sửa tham số thành chữ thường 'priority')
    const getPriorityClass = (priority) => {
        if (priority === 'Khẩn cấp') return 'tag-khan-cap';
        if (priority === 'Ưu tiên') return 'tag-uu-tien';
        return 'tag-thuong-quy';
    };

    if (!history || history.length === 0) {
        return (
            <div className="ni-container" style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                <p>Chưa có lịch sử chỉ thị nào.</p>
            </div>
        );
    }

    return (
        <div className="ni-container" style={{ height: '100%', overflowY: 'auto' }}>
            <h4 className="ni-header" style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>
                <LuClock3 /> Lịch sử chỉ thị
            </h4>
            
            <div className="ni-history-list">
                {history.map((item, index) => (
                    <div key={index} className="ni-card">
                        <div className="ni-card-header">
                            {/* SỬA: Dùng 'priority' (chữ thường) theo SQL Alias */}
                            <span className={`ni-tag ${getPriorityClass(item.priority)}`}>
                                {(item.priority || "Thường quy").toUpperCase()}
                            </span>
                            
                            {/* SỬA: Dùng 'time' (chữ thường) vì SQL đã FORMAT sẵn */}
                            <span className="ni-time">
                                {item.time || 'N/A'}
                            </span>
                        </div>
                        
                        {/* SỬA: Dùng 'content' (chữ thường) */}
                        <p className="ni-card-content">
                            {item.content || "Không có nội dung"}
                        </p>
                        
                        <div className="ni-card-footer">
                            <div className="ni-nurse-info">
                                <FaUserNurse color="#0081c9" /> 
                                {/* SỬA: Dùng 'nurseName' theo SQL Alias */}
                                <strong>ĐD:</strong> {item.nurseName || "Hệ thống"}
                            </div>

                            <div className="ni-status">
                                {/* SỬA: Dùng 'status' (chữ thường) */}
                                {item.status === 'Hoàn thành' ? (
                                    <span className="status-done">
                                        <FaCheckCircle /> Đã xong
                                    </span>
                                ) : (
                                    <span className="status-pending">
                                        <FaSpinner className="spin" /> {item.status || 'Chờ xử lý'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NursingInstructionHistory;