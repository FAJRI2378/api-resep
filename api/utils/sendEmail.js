const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Gunakan sesuai layanan email Anda
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: `"SPP App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Kode Verifikasi Reset Password",
    html: `<p>Berikut adalah kode verifikasi Anda:</p><h2>${code}</h2>`,
  };

  await transporter.sendMail(mailOptions);
};
