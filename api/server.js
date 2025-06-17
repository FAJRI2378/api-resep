const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ JANGAN pakai /api/config/db
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
const favoriteRoutes = require("./routes/favoriteRoutes"); // ✅ FIXED
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");

app.use("/api/favorite", favoriteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);

// ✅ Connect DB
connectDB();

// ✅ Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server berjalan di http://0.0.0.0:${PORT}`);
});
