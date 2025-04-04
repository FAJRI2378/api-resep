const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const authMiddleware = require("../middlewares/authMiddleware"); // Middleware autentikasi

// Mendapatkan semua menu
router.get("/", menuController.getMenus);

// Menambahkan menu (hanya admin)
router.post("/", authMiddleware, menuController.addMenu);

// Mengedit menu berdasarkan ID (hanya admin)
router.put("/:id", authMiddleware, menuController.editMenu);

// Menghapus menu berdasarkan ID (hanya admin)
router.delete("/:id", authMiddleware, menuController.deleteMenu);

module.exports = router;
