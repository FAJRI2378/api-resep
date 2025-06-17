const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    // Tambahkan field untuk verifikasi password reset
    verifyCode: { type: String, default: null },
    verifyCodeExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password sebelum menyimpan ke database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    if (this.password && !this.password.startsWith("$2a$")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method untuk membandingkan password saat login
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Error saat membandingkan password:", error);
    return false;
  }
};

module.exports = mongoose.model("User", UserSchema);
