import nodemailer from "nodemailer";
console.log("REGISTER ROUTE HIT");
console.log(process.env.SMTP_PASSWORD);
console.log(process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: 'a9b16f001@smtp-brevo.com',
    pass: 'bsk8Bf36AmKCtP8'
  },
});

transporter.verify((err, success) => {
  if (err) console.log("SMTP ERROR:", err);
  else console.log("SMTP READY");
});

export default transporter;
