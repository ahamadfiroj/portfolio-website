import { sendOTPViaResend } from './email-alternative';

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email via Resend API only
export async function sendOTPEmail(email: string, otp: string, userName: string): Promise<boolean> {
  console.log('📧 Sending OTP email via Resend API...');
  console.log('To:', email);

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not configured. Please set up Resend API for email delivery.');
    return false;
  }

  try {
    const result = await sendOTPViaResend(email, otp, userName);
    
    if (result.success) {
      console.log('✅ OTP email sent successfully via Resend:', result.messageId);
      return true;
    } else {
      console.error('❌ Resend API failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Unexpected error sending OTP email:', error);
    return false;
  }
}


