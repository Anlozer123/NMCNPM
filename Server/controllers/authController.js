const authService = require('../services/authService');

class AuthController {
    async login(req, res) {
        try {
            console.log("👉 Đang đăng nhập:", req.body);
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ success: false, message: "Thiếu username hoặc password" });
            }

            const result = await authService.login(username, password);
            console.log("✅ Đăng nhập thành công:", result.account.Username);
            
            res.json({ success: true, data: result });

        } catch (err) {
            console.error("❌ Lỗi đăng nhập:", err.message);
            // Trả về mã lỗi 401 (Unauthorized)
            res.status(401).json({ success: false, message: err.message });
        }
    }

    async register(req, res) {
        try {
            console.log("👉 Đang đăng ký:", req.body);
            const result = await authService.register(req.body);
            res.json({ success: true, message: "Đăng ký thành công", data: result });
        } catch (err) {
            console.error("❌ Lỗi đăng ký:", err.message);
            res.status(400).json({ success: false, message: err.message });
        }
    }
}
module.exports = new AuthController();