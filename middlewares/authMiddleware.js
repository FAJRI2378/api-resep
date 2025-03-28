const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "Akses ditolak" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token tidak valid" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Akses terbatas untuk admin" });
  next();
};
