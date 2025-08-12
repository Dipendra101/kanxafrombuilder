import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'Kanxa Safari <no-reply@kanxasafari.com>',
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;