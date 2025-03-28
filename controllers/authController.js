const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Tambahkan ini!
const sendEmail = require("../utils/sendEmail");

// 🔹 REGISTER USER
exports.register = async (req, res) => {
    try {
        console.log("Data dari Postman:", req.body);

        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User sudah terdaftar" });

        user = new User({ name, email, password, role });
        await user.save();
        console.log("User tersimpan di database:", user);

        res.status(201).json({ msg: "Registrasi berhasil" });
    } catch (error) {
        console.error("Error di register:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// 🔹 LOGIN USER
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Email dari Postman:", email);
        console.log("Password input dari Postman:", password);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User tidak ditemukan di database");
            return res.status(400).json({ msg: "User tidak ditemukan" });
        }

        console.log("Password hash dari database:", user.password);

        const isMatch = await user.comparePassword(password);
        console.log("Hasil bcrypt.compare:", isMatch);

        if (!isMatch) {
            console.log("Password tidak cocok!");
            return res.status(400).json({ msg: "Password salah" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ msg: "Login berhasil", token, role: user.role, userId: user._id });
    } catch (error) {
        console.error("Error di login:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// 🔹 RESET PASSWORD
exports.resetPassword = async (req, res) => {
    console.log("🚀 Request masuk ke resetPassword");

    try {
        const { email, newPassword } = req.body;
        console.log("Reset Password untuk:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User tidak ditemukan!");
            return res.status(400).json({ msg: "User tidak ditemukan" });
        }

        console.log("✅ User ditemukan:", user.email);
        res.json({ msg: "Debugging: Request reset password sampai ke controller" });
    } catch (error) {
        console.error("❌ Error di resetPassword:", error);
        res.status(500).json({ msg: "Server error" });
    }
};
