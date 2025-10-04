import nodemailer from 'nodemailer';

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string, userName: string): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured');
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '🔐 Password Reset OTP - Portfolio Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            padding: 30px;
            color: white;
          }
          .otp-box {
            background: white;
            color: #333;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #667eea;
            font-family: 'Courier New', monospace;
          }
          .warning {
            background: rgba(255, 255, 255, 0.1);
            border-left: 4px solid #fbbf24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            font-size: 14px;
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 style="margin: 0 0 20px 0;">🔐 Password Reset Request</h1>
          
          <p>Hello <strong>${userName}</strong>,</p>
          
          <p>We received a request to reset your password for the Admin Panel. Use the OTP code below to proceed:</p>
          
          <div class="otp-box">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
          </div>
          
          <div class="warning">
            <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Never share this OTP with anyone</li>
              <li>This code expires in 10 minutes</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          
          <p>Enter this OTP on the password reset page to continue.</p>
          
          <div class="footer">
            <p style="margin: 0;">Best regards,<br><strong>Portfolio Admin Team</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset OTP

Hello ${userName},

We received a request to reset your password for the Admin Panel.

Your OTP Code: ${otp}

This code is valid for 10 minutes.

SECURITY NOTICE:
- Never share this OTP with anyone
- This code expires in 10 minutes
- If you didn't request this, please ignore this email

Enter this OTP on the password reset page to continue.

Best regards,
Portfolio Admin Team

This is an automated email. Please do not reply to this message.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return false;
  }
}

