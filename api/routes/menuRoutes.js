const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController")

// Route GET semua menu
router.get("/", menuController.getAllMenus);

// Route POST tambah menu
router.post("/", menuController.addMenu);

// Route PUT edit menu
router.put("/:id", menuController.updateMenu);

// Route DELETE hapus menu
router.delete("/:id", menuController.deleteMenu);

module.exports = router;
