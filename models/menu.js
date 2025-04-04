const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String, // bisa URL gambar
}, { timestamps: true });

module.exports = mongoose.model("Menu", MenuSchema);
