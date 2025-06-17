const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Akses ditolak, token tidak ditemukan" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token tidak valid" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Akses ditolak, pengguna tidak ditemukan" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Akses terbatas untuk admin" });
  }

  next();
};

module.exports = {
  protect,
  isAdmin,
};
