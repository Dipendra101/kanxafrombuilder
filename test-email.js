// test-email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log('--- Email Test Script Started ---');

async function runTest() {
  // Check if environment variables are loaded
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('ERROR: EMAIL_USER or EMAIL_PASS not found in .env file.');
    return;
  }

  console.log(`Attempting to connect to Gmail as: ${process.env.EMAIL_USER}`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Your 16-character App Password
    },
    // Enable detailed logging to see the conversation with the server
    debug: true, 
  });

  try {
    console.log('Verifying transporter configuration...');
    await transporter.verify();
    console.log('SUCCESS: Transporter configuration is correct. Ready to send mail.');

    console.log('Attempting to send a test email...');
    const info = await transporter.sendMail({
      from: '"Kanxa Test" <no-reply@kanxasafari.com>',
      to: 'test-recipient@example.com', // Sending to a dummy address is fine for this test
      subject: 'Nodemailer Test',
      text: 'This is a test email from the standalone script.',
    });

    console.log('--- TEST SUCCEEDED! ---');
    console.log('Message sent: %s', info.messageId);

  } catch (error) {
    console.error('\n--- TEST FAILED! ---');
    console.error('A critical error occurred during the test:');
    console.error(error);
  }
}

runTest();