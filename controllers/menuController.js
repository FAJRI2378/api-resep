const Menu = require("../models/menu");

// Ambil semua menu
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    console.error("❌ Error ambil menu:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Tambah menu baru
exports.addMenu = async (req, res) => {
  try {
    const { nama, harga, deskripsi, videoUrl, image } = req.body;

    if (!nama || !harga || !deskripsi || !videoUrl || !image) {
      return res.status(400).json({ msg: "Semua field wajib diisi!" });
    }

    const newMenu = new Menu({ nama, harga, deskripsi, videoUrl, image });
    await newMenu.save();

    res.status(201).json({ msg: "Menu berhasil ditambahkan", menu: newMenu });
  } catch (error) {
    console.error("❌ Gagal tambah menu:", error);
    res.status(500).json({ msg: "Terjadi kesalahan di server" });
  }
};


// Edit menu
exports.updateMenu = async (req, res) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMenu) return res.status(404).json({ msg: "Menu tidak ditemukan" });
    res.json({ msg: "Menu berhasil diperbarui", menu: updatedMenu });
  } catch (error) {
    console.error("❌ Error update menu:", error);
    res.status(500).json({ msg: "Gagal memperbarui menu" });
  }
};

// Hapus menu
exports.deleteMenu = async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Menu tidak ditemukan" });
    res.json({ msg: "Menu berhasil dihapus" });
  } catch (error) {
    console.error("❌ Error hapus menu:", error);
    res.status(500).json({ msg: "Gagal menghapus menu" });
  }
};
