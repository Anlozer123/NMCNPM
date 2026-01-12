// File: Server/test_gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ĐÂY LÀ KEY BẠN VỪA GỬI (Tôi đã dán sẵn giúp bạn)
const apiKey = "AIzaSyDl9St-_iVK2s0uhyMnz7LRiKSBkbTk1GU"; 

console.log("----------------------------------------");
console.log("🚀 Đang kiểm tra kết nối tới Google Gemini...");
console.log("🔑 Key đang dùng:", apiKey);
console.log("----------------------------------------");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function run() {
  try {
    const prompt = "Chào Gemini, bạn có khỏe không? Trả lời ngắn gọn.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("✅ THÀNH CÔNG! Gemini đã trả lời:");
    console.log(text);
  } catch (error) {
    console.error("❌ THẤT BẠI. Chi tiết lỗi:");
    console.error(error.message);
    
    // Phân tích lỗi giúp bạn
    if (error.message.includes("API_KEY_INVALID")) {
        console.log("\n⚠️  NGUYÊN NHÂN: Key này chưa được kích hoạt hoặc Project chưa bật API.");
    } else if (error.message.includes("fetch failed")) {
        console.log("\n⚠️  NGUYÊN NHÂN: Lỗi mạng hoặc DNS. Hãy thử tắt VPN hoặc đổi mạng.");
    }
  }
}

run();