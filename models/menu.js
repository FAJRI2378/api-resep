const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  nama: String,
  harga: Number,
  deskripsi: String,          // 🆕
  videoUrl: String,           // 🆕
  image: String,              // 🆕 (Base64 atau URL)
});

module.exports = mongoose.model("Menu", menuSchema);
