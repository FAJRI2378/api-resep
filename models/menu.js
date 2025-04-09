const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  nama: String,
  harga: Number,
  deskripsi: String,
  videoUrl: String,
  image: String,
  kategori: {
    type: String,
    enum: ["Sarapan", "Utama", "Dessert", "Snacks"],
    required: true,
  },
});

module.exports = mongoose.model("Menu", menuSchema);
