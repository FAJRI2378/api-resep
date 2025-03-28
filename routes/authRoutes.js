const express = require("express");
const { register, login, resetPassword } = require("../controllers/authController");

const router = express.Router();

console.log("🔹 Route di-load: /register");
router.post("/register", register);

console.log("🔹 Route di-load: /login");
router.post("/login", login);

console.log("🔹 Route di-load: /reset-password");
router.put("/reset-password", resetPassword);

module.exports = router;
