import { sendEmailViaResend } from './email-alternative';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
}

export async function sendNotificationEmail(formData: ContactFormData): Promise<{ success: boolean; message: string; error?: string; messageId?: string; configUsed?: string }> {
  console.log('📧 Sending email via Resend API...');
  console.log('From: Portfolio Contact <onboarding@resend.dev>');
  console.log('To:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not configured. Please set up Resend API for email delivery.');
    return { 
      success: false, 
      message: 'Email service not configured. Please set RESEND_API_KEY environment variable.', 
      error: 'RESEND_API_KEY not configured' 
    };
  }

  try {
    const result = await sendEmailViaResend(formData);
    
    if (result.success) {
      console.log('✅ Email sent successfully via Resend:', result.messageId);
      return {
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
        configUsed: 'Resend API'
      };
    } else {
      console.error('❌ Resend API failed:', result.message);
      return {
        success: false,
        message: result.message,
        error: result.error
      };
    }
  } catch (error) {
    console.error('❌ Unexpected error sending email:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}