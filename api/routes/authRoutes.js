const express = require("express");
const { register, login, sendResetCode, resetPasswordWithCode } = require("../controllers/favoriteController")

const router = express.Router();

console.log("🔹 Route di-load: /register");
router.post("/register", register);

console.log("🔹 Route di-load: /login");
router.post("/login", login);

console.log("🔹 Route di-load: /send-reset-code");
router.post("/send-reset-code", sendResetCode);

console.log("🔹 Route di-load: /reset-password");
router.put("/reset-password", resetPasswordWithCode); // Pastikan ini mengarah ke fungsi resetPasswordWithCode

module.exports = router;
