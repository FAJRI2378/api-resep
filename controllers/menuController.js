const Menu = require("../models/menu");

// Get all menus
exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Add new menu
exports.addMenu = async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    await newMenu.save();
    res.status(201).json({ msg: "Menu berhasil ditambahkan", menu: newMenu });
  } catch (error) {
    res.status(500).json({ msg: "Gagal menambahkan menu" });
  }
};

// Edit menu
exports.editMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menu) return res.status(404).json({ msg: "Menu tidak ditemukan" });
    res.json({ msg: "Menu berhasil diperbarui", menu });
  } catch (error) {
    res.status(500).json({ msg: "Gagal memperbarui menu" });
  }
};

// Delete menu
exports.deleteMenu = async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Menu tidak ditemukan" });
    res.json({ msg: "Menu berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal menghapus menu" });
  }
};
