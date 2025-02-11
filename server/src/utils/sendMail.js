import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config({
  path: "./.env"
}); // Load environment variables

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER, // sender email
    pass: process.env.EMAIL_PASS, // app password from Google
  },
});

// function to send an email
const sendMail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: to, // Recipient email
      subject: subject, // Email subject
      text: text, // Plain text body 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

export { sendMail }
