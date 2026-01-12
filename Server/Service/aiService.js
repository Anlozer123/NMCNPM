// File: Server/Service/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Sử dụng Key đã test thành công (Hardcode để đảm bảo chạy 100%)
const apiKey = "AIzaSyDl9St-_iVK2s0uhyMnz7LRiKSBkbTk1GU"; 

const genAI = new GoogleGenerativeAI(apiKey);

// QUAN TRỌNG: Sử dụng đúng model bạn vừa test thành công
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

exports.generateSummary = async (medicalRecordText) => {
    try {
        // Prompt yêu cầu trả về JSON để Frontend hiển thị đẹp
        const prompt = `Phân tích bệnh án sau và trả về DUY NHẤT một đối tượng JSON (không markdown, không giải thích thêm).
        
        Nội dung bệnh án: "${medicalRecordText}"
        
        Cấu trúc JSON yêu cầu (Giữ nguyên tên key):
        {
          "important_info": "Tóm tắt chẩn đoán, dị ứng và tiền sử bệnh quan trọng",
          "current_status": "Mô tả ngắn gọn tình trạng sức khỏe hiện tại",
          "recent_tests": "Liệt kê các xét nghiệm và kết quả nổi bật",
          "current_medications": "Danh sách thuốc đang sử dụng",
          "nursing_notes": "Ghi chú theo dõi của điều dưỡng"
        }`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Làm sạch chuỗi JSON (phòng trường hợp AI thêm ```json ở đầu)
        const cleanJson = text.replace(/```json|```/g, "").trim();
        
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Lỗi tại AI Service:", error.message);
        // Trả về dữ liệu rỗng để Frontend không bị crash
        return {
            important_info: "Không thể phân tích dữ liệu lúc này.",
            current_status: "Lỗi kết nối AI.",
            recent_tests: "",
            current_medications: "",
            nursing_notes: error.message
        };
    }
};