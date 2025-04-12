const Favorite = require("../models/Favorite");
const Menu = require("../models/menu");

exports.addFavorite = async (req, res) => {
  const { userId, menuId } = req.body;
  try {
    const existing = await Favorite.findOne({ userId, menuId });
    if (existing) {
      return res.status(400).json({ message: "Sudah difavoritkan" });
    }
    const favorite = new Favorite({ userId, menuId });
    await favorite.save();
    res.status(201).json({ message: "Berhasil ditambahkan ke favorit" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  const { userId, menuId } = req.body;
  try {
    await Favorite.findOneAndDelete({ userId, menuId });
    res.json({ message: "Berhasil dihapus dari favorit" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserFavorites = async (req, res) => {
  const { userId } = req.params;
  try {
    const favorites = await Favorite.find({ userId }).populate("menuId");
    const menuList = favorites.map((f) => f.menuId);
    res.json(menuList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
