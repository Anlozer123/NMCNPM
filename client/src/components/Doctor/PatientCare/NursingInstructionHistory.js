import React from 'react';
import { LuClock3 } from "react-icons/lu";
import { FaUserNurse, FaCheckCircle, FaSpinner } from "react-icons/fa";
import './NursingInstruction.css'; // Import file CSS

const NursingInstructionHistory = ({ history }) => {
    
    // Hàm helper để xác định class màu sắc cho tag ưu tiên
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
                        {/* Header Card */}
                        <div className="ni-card-header">
                            <span className={`ni-tag ${getPriorityClass(item.priority)}`}>
                                {item.priority.toUpperCase()}
                            </span>
                            <span className="ni-time">{item.time}</span>
                        </div>
                        
                        {/* Nội dung */}
                        <p className="ni-card-content">
                            {item.content}
                        </p>
                        
                        {/* Footer Card */}
                        <div className="ni-card-footer">
                            <div className="ni-nurse-info">
                                <FaUserNurse color="#0081c9" /> 
                                <strong>ĐD:</strong> {item.nurseName || <span style={{color: '#999', fontStyle: 'italic'}}>Chưa nhận</span>}
                            </div>

                            <div className="ni-status">
                                {item.status === 'Đã xong' ? (
                                    <span className="status-done">
                                        <FaCheckCircle /> Đã xong
                                    </span>
                                ) : (
                                    <span className="status-pending">
                                        <FaSpinner className="spin" /> Chờ xử lý
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