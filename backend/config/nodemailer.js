import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
console.log("SMTP_USER =", process.env.SMTP_USER,'---------------');
console.log("SMTP_PASSWORD =", process.env.SMTP_PASSWORD);
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) console.log("SMTP ERROR:", err);
  else console.log("SMTP READY ✅");
});

export default transporter;