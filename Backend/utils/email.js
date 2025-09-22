const nodemailer = require("nodemailer");

// Use environment variables for security
const transporter = nodemailer.createTransport({
  service: "gmail", // or any email service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password if using Gmail
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = sendEmail;
