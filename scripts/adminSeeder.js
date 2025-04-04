require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User"); // Sesuaikan dengan path model User

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Terhubung ke MongoDB");

    // Hapus admin lama jika ada
    await User.deleteOne({ email: "admin@example.com" });
    console.log("🧹 Admin lama dihapus (jika ada)");

    // Buat akun admin baru
    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123", // Akan di-hash otomatis
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Admin berhasil dibuat ulang!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

// Jalankan fungsi seeding
seedAdmin();
