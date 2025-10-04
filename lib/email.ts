import nodemailer from 'nodemailer';

// Create transporter for Gmail with better error handling
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured!');
    console.error('Missing EMAIL_USER or EMAIL_PASS environment variables');
    return null;
  }

  try {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add timeout and retry settings
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000,     // 60 seconds
    });
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
    return null;
  }
};

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
}

export async function sendNotificationEmail(formData: ContactFormData) {
  const { name, email, subject, message, timestamp } = formData;

  // Create transporter with error handling
  const transporter = createTransporter();
  if (!transporter) {
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

  try {
    console.log('📧 Attempting to send email...');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    
    return { 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email';
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Invalid email credentials. Please check EMAIL_USER and EMAIL_PASS.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Email service timeout. Please try again.';
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
}