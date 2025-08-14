import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// This function does the actual work
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"Kanxa Safari" <no-reply@kanxasafari.com>',
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  return transporter.sendMail(mailOptions);
};

// Listen for messages from the main process
process.on('message', async (emailOptions) => {
  try {
    await sendEmail(emailOptions);
    // Send a success message back
    process.send({ success: true });
  } catch (error) {
    // Send an error message back
    process.send({ success: false, error: error.message });
  }
  // Exit the worker process
  process.exit();
});