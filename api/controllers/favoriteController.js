const Favorite = require("../models/Favorite");
const Menu = require("../models/menu");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.addFavorite = async (req, res) => {
  const { userId, menuId } = req.body;

  // Cek apakah userId dan menuId ada di request body
  if (!userId || !menuId) {
    return res.status(400).json({ message: "userId atau menuId harus disertakan" });
  }

  // Validasi ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(menuId)) {
    return res.status(400).json({ message: "userId atau menuId tidak valid" });
  }

  try {
    // Pastikan user dan menu benar-benar ada
    const user = await User.findById(userId);
    const menu = await Menu.findById(menuId);

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    if (!menu) return res.status(404).json({ message: "Menu tidak ditemukan" });

    // Pastikan favorit belum ada
    const existing = await Favorite.findOne({ userId, menuId });
    if (existing) {
      return res.status(400).json({ message: "Menu sudah difavoritkan" });
    }

    // Membuat favorit baru
    const favorite = new Favorite({ userId, menuId });
    await favorite.save();
    res.status(201).json({ message: "Berhasil ditambahkan ke favorit" });
  } catch (err) {
    console.error(err); // Menambahkan log error untuk debugging
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan favorit" });
  }
};

exports.removeFavorite = async (req, res) => {
  const { userId, menuId } = req.body;

  // Cek apakah userId dan menuId ada di request body
  if (!userId || !menuId) {
    return res.status(400).json({ message: "userId atau menuId harus disertakan" });
  }

  // Validasi ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(menuId)) {
    return res.status(400).json({ message: "userId atau menuId tidak valid" });
  }

  try {
    // Menghapus favorit
    const result = await Favorite.findOneAndDelete({ userId, menuId });

    if (!result) {
      return res.status(404).json({ message: "Favorit tidak ditemukan" });
    }

    res.json({ message: "Berhasil dihapus dari favorit" });
  } catch (err) {
    console.error(err); // Menambahkan log error untuk debugging
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus favorit" });
  }
};

exports.getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  // Validasi userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "userId tidak valid" });
  }

  try {
    // Pastikan user ada
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // Ambil daftar favorit
    const favorites = await Favorite.find({ userId }).populate("menuId");
    const menuList = favorites.map((f) => f.menuId);
    res.json(menuList);
  } catch (err) {
    console.error(err); // Menambahkan log error untuk debugging
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil daftar favorit" });
  }
};
