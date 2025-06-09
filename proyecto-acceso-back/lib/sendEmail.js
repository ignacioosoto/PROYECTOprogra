const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html, attachments = []) => {
  const mailOptions = {
    from: `"Control de Acceso" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error detallado en sendEmail:", error);
    throw error;
  }
};

module.exports = sendEmail;
