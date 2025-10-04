import nodemailer from 'nodemailer';
import { sendOTPViaResend } from './email-alternative';

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email with robust configuration
export async function sendOTPEmail(email: string, otp: string, userName: string): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('❌ Email credentials not configured');
    return false;
  }

  // Try multiple SMTP configurations
  const smtpConfigs = [
    // Configuration 1: Gmail with STARTTLS (port 587)
    {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 20000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      tls: {
        rejectUnauthorized: false,
      },
    },
    // Configuration 2: Gmail with SSL (port 465)
    {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 20000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      tls: {
        rejectUnauthorized: false,
      },
    },
  ];

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

  // Try each SMTP configuration until one works
  for (let i = 0; i < smtpConfigs.length; i++) {
    const config = smtpConfigs[i];
    console.log(`📧 Attempting to send OTP email with config ${i + 1}/${smtpConfigs.length}...`);
    console.log(`Host: ${config.host}, Port: ${config.port}, Secure: ${config.secure}`);
    console.log('To:', email);
    
    try {
      const transporter = nodemailer.createTransport(config);
      
      // Test connection first
      await transporter.verify();
      console.log('✅ SMTP connection verified for OTP');
      
      // Send email
      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent to: ${email}`, result.messageId);
      return true;
    } catch (error) {
      console.error(`❌ OTP Config ${i + 1} failed:`, error);
      
      // If this is the last config, try alternative email service
      if (i === smtpConfigs.length - 1) {
        console.log('🔄 All SMTP configs failed for OTP, trying alternative email service...');
        
        // Try Resend API as fallback
        console.log('🔍 Checking Resend API configuration for OTP...');
        console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
        
        if (process.env.RESEND_API_KEY) {
          console.log('📧 Attempting to send OTP via Resend API...');
          const resendResult = await sendOTPViaResend(email, otp, userName);
          if (resendResult.success) {
            return true;
          } else {
            console.error('❌ Resend API failed for OTP:', resendResult.message);
          }
        } else {
          console.log('❌ RESEND_API_KEY not configured. Please set up Resend API for email delivery.');
          console.log('📝 Setup instructions:');
          console.log('1. Go to https://resend.com and create account');
          console.log('2. Get your API key from dashboard');
          console.log('3. Add RESEND_API_KEY to Render environment variables');
          
          // Return false since OTP cannot be sent
          return false;
        }
        
        console.error('❌ All OTP email methods failed');
        return false;
      }
      
      // Try next configuration
      console.log(`🔄 Trying next OTP configuration...`);
    }
  }

  return false;
}


