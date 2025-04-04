require("dotenv").config();
console.log("JWT_SECRET dari .env:", process.env.JWT_SECRET); // Debugging

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Koneksi ke Database
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");

app.use("/api/auth", authRoutes);
console.log("✅ Routes di-load: /api/auth");

app.use("/api/menu", menuRoutes);
console.log("✅ Routes di-load: /api/menu");

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
