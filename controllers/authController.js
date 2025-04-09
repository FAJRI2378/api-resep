const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 🔹 REGISTER USER
exports.register = async (req, res) => {
  try {
    console.log("Data dari Postman:", req.body);

    const { name, email, password, role } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: cleanEmail });
    if (user) return res.status(400).json({ msg: "User sudah terdaftar" });

    // gunakan cleanEmail saat menyimpan
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
    if (!user) {
      console.log("🔍 Semua user:", await User.find().lean());
      return res.status(400).json({ msg: "User tidak ditemukan" });
    }

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

// 🔹 RESET PASSWORD
exports.resetPassword = async (req, res) => {
  console.log("🚀 Request masuk ke resetPassword");

  try {
    const { email, newPassword } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    console.log("Reset Password untuk:", cleanEmail);

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(400).json({ msg: "User tidak ditemukan" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    console.log("✅ Password berhasil direset untuk:", cleanEmail);

    res.json({ msg: "Password berhasil direset" });
  } catch (error) {
    console.error("❌ Error di resetPassword:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
