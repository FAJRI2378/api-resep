const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../utils/sendEmail");

// 🔹 REGISTER USER
exports.register = async (req, res) => {
  try {
    console.log("Data dari Postman:", req.body);

    const { name, email, password, role } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: cleanEmail });
    if (user) return res.status(400).json({ msg: "User sudah terdaftar" });

    user = new User({ name, email: cleanEmail, password, role });
    await user.save();
    console.log("✅ User tersimpan:", user.email);

    res.status(201).json({ msg: "Registrasi berhasil" });
  } catch (error) {
    console.error("❌ Error di register:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🔹 LOGIN USER
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    console.log("Login dengan email:", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User tidak ditemukan" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Password salah" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login berhasil",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error di login:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🔹 SEND RESET CODE
exports.sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) return res.status(404).json({ msg: "Email tidak ditemukan" });

    const code = Math.floor(100000 + Math.random() * 900000); // 6 digit
    user.verifyCode = code;
    user.verifyCodeExpires = Date.now() + 10 * 60 * 1000; // 10 menit
    await user.save();

    await sendVerificationEmail(user.email, code);
    res.json({ msg: "Kode verifikasi telah dikirim ke email" });
  } catch (error) {
    console.error("❌ Error di sendResetCode:", error);
    res.status(500).json({ msg: "Gagal mengirim kode" });
  }
};

// 🔹 RESET PASSWORD WITH CODE
exports.resetPasswordWithCode = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Pengguna tidak ditemukan" });

    if (
      !user.verifyCode ||
      !user.verifyCodeExpires ||
      user.verifyCode !== code ||
      new Date() > user.verifyCodeExpires
    ) {
      return res.status(400).json({ msg: "Kode tidak valid atau sudah kedaluwarsa" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Hapus kode agar tidak bisa dipakai ulang
    user.verifyCode = undefined;
    user.verifyCodeExpires = undefined;

    await user.save();
    res.json({ msg: "Password berhasil direset" });
  } catch (error) {
    console.error("❌ Error reset password:", error);
    res.status(500).json({ msg: "Kesalahan server" });
  }
};
