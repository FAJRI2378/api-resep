const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI tidak ditemukan di .env");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error MongoDB: ${error.message}`);
    process.exit(1); // Matikan server jika gagal koneksi
  } finally {
    console.log("🔄 Proses koneksi MongoDB selesai.");
  }
};

mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB Connection Error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB Disconnected. Mencoba menghubungkan ulang...");
});

module.exports = connectDB;
