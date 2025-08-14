import * as nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn(
        "⚠️  Email credentials not configured. Email sending will be disabled.",
      );
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      console.log("✅ Email service initialized");
    } catch (error) {
      console.error("❌ Failed to initialize email service:", error);
    }
  }

  async sendVerificationCode(
    email: string,
    code: string,
    type: "email-change" | "password-reset" = "email-change",
  ) {
    if (!this.transporter) {
      console.log(`📧 [DEMO] Verification code for ${email}: ${code}`);
      return { success: true, demo: true };
    }

    const subject =
      type === "email-change"
        ? "Kanxa Safari - Email Change Verification"
        : "Kanxa Safari - Password Reset";

    const html =
      type === "email-change"
        ? this.getEmailChangeTemplate(code)
        : this.getPasswordResetTemplate(code);

    const text =
      type === "email-change"
        ? `Your email change verification code is: ${code}. This code will expire in 15 minutes.`
        : `Your password reset code is: ${code}. This code will expire in 15 minutes.`;

    try {
      const info = await this.transporter.sendMail({
        from: `"Kanxa Safari" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text,
        html,
      });

      console.log("📧 Email sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw error;
    }
  }

  private getEmailChangeTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Email Change Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .code { background: #1e3a8a; color: white; padding: 15px 30px; font-size: 32px; font-weight: bold; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 3px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚌 Kanxa Safari</h1>
              <h2>Email Change Verification</h2>
            </div>
            <div class="content">
              <h3>Verify Your New Email Address</h3>
              <p>You recently requested to change your email address. To complete this process, please use the verification code below:</p>
              
              <div class="code">${code}</div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This code will expire in <strong>15 minutes</strong></li>
                  <li>If you didn't request this change, please ignore this email</li>
                  <li>Never share this code with anyone</li>
                </ul>
              </div>
              
              <p>If you have any questions, please contact our support team.</p>
              
              <p>Best regards,<br>The Kanxa Safari Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Kanxa Safari. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .code { background: #dc2626; color: white; padding: 15px 30px; font-size: 32px; font-weight: bold; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 3px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚌 Kanxa Safari</h1>
              <h2>Password Reset</h2>
            </div>
            <div class="content">
              <h3>Reset Your Password</h3>
              <p>You recently requested to reset your password. Use the verification code below to proceed:</p>
              
              <div class="code">${code}</div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>This code will expire in <strong>15 minutes</strong></li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Consider changing your password if you suspect unauthorized access</li>
                </ul>
              </div>
              
              <p>If you have any security concerns, please contact our support team immediately.</p>
              
              <p>Best regards,<br>The Kanxa Safari Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Kanxa Safari. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export default new EmailService();
