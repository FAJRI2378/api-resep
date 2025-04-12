const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.post("/", favoriteController.addFavorite);
router.delete("/", favoriteController.removeFavorite);
router.get("/user/:userId", favoriteController.getUserFavorites);

module.exports = router;
