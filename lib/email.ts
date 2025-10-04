import nodemailer from 'nodemailer';
import { sendEmailViaResend } from './email-alternative';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
}

export async function sendNotificationEmail(formData: ContactFormData): Promise<{ success: boolean; message: string; error?: string; messageId?: string; configUsed?: string }> {
  const { name, email, subject, message, timestamp } = formData;

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

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return { 
      success: false, 
      message: 'Email service not configured. Please check environment variables.',
      error: 'Missing email credentials'
    };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Submitted:</strong> ${timestamp.toLocaleString()}</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
        </div>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px;">
          <p>This email was sent from your portfolio website contact form.</p>
        </div>
      </div>
    `,
  };

  // Try each SMTP configuration until one works
  for (let i = 0; i < smtpConfigs.length; i++) {
    const config = smtpConfigs[i];
    console.log(`📧 Attempting to send email with config ${i + 1}/${smtpConfigs.length}...`);
    console.log(`Host: ${config.host}, Port: ${config.port}, Secure: ${config.secure}`);
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
    
    try {
      const transporter = nodemailer.createTransport(config);
      
      // Test connection first
      await transporter.verify();
      console.log('✅ SMTP connection verified');
      
      // Send email
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      
      return { 
        success: true, 
        message: 'Email sent successfully',
        messageId: result.messageId,
        configUsed: `Config ${i + 1} (${config.host}:${config.port})`
      };
    } catch (error) {
      console.error(`❌ Config ${i + 1} failed:`, error);
      
      // If this is the last config, try alternative email service
      if (i === smtpConfigs.length - 1) {
        console.log('🔄 All SMTP configs failed, trying alternative email service...');
        
        // Try Resend API as fallback
        console.log('🔍 Checking Resend API configuration...');
        console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
        
        if (process.env.RESEND_API_KEY) {
          console.log('📧 Attempting to send via Resend API...');
          const resendResult = await sendEmailViaResend(formData);
          if (resendResult.success) {
            return resendResult;
          } else {
            console.error('❌ Resend API failed:', resendResult.message);
          }
        } else {
          console.log('❌ RESEND_API_KEY not configured. Please set up Resend API for email delivery.');
          console.log('📝 Setup instructions:');
          console.log('1. Go to https://resend.com and create account');
          console.log('2. Get your API key from dashboard');
          console.log('3. Add RESEND_API_KEY to Render environment variables');
          
          // Return error instead of console logging
          return {
            success: false,
            message: 'Email service not available. Please set up Resend API.',
            error: 'RESEND_API_KEY not configured'
          };
        }
        
        // If all methods fail, return error
        let errorMessage = 'All email methods failed';
        if (error instanceof Error) {
          if (error.message.includes('Invalid login')) {
            errorMessage = 'Invalid email credentials. Please check EMAIL_USER and EMAIL_PASS.';
          } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            errorMessage = 'Email service timeout. Render may be blocking SMTP connections. Consider using Resend API or similar service.';
          } else if (error.message.includes('network')) {
            errorMessage = 'Network error. Please check your internet connection.';
          } else {
            errorMessage = `Email error: ${error.message}`;
          }
        }
        
        return { 
          success: false, 
          message: errorMessage, 
          error: error instanceof Error ? error.message : String(error)
        };
      }
      
      // Try next configuration
      console.log(`🔄 Trying next configuration...`);
    }
  }

  // This should never be reached, but TypeScript requires it
  return {
    success: false,
    message: 'Unexpected error: No email configuration was attempted',
    error: 'No SMTP configurations available'
  };
}