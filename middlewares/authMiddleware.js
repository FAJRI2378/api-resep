const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Pastikan token tersedia
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Akses ditolak, token tidak ditemukan" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token tidak valid" });
  }
};

exports.isAdmin = (req, res, next) => {
  // Pastikan user sudah terotentikasi
  if (!req.user) {
    return res.status(401).json({ msg: "Akses ditolak, pengguna tidak ditemukan" });
  }

  // Pastikan user adalah admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Akses terbatas untuk admin" });
  }

  next();
};
