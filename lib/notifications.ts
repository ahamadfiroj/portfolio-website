import { sendChatNotificationViaResend } from './email-alternative';

// WhatsApp: We use FREE direct links in email instead of paid Twilio API!
// No configuration needed - completely free forever!

interface NotificationData {
  visitorName: string;
  message: string;
  conversationId: string;
  visitorWhatsApp?: string;
}

/**
 * Send email notification when a visitor sends a message via Resend API only
 */
export async function sendEmailNotification(data: NotificationData): Promise<boolean> {
  console.log('📧 Sending chat notification via Resend API...');
  console.log('From: Portfolio Chat <onboarding@resend.dev>');
  console.log('To:', process.env.ADMIN_EMAIL);

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not configured. Please set up Resend API for email delivery.');
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('❌ ADMIN_EMAIL not configured');
    return false;
  }

  try {
    const result = await sendChatNotificationViaResend(data);
    
    if (result.success) {
      console.log('✅ Chat notification sent successfully via Resend:', result.messageId);
      return true;
    } else {
      console.error('❌ Resend API failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Unexpected error sending chat notification:', error);
    return false;
  }
}

/**
 * WhatsApp links are included in email - FREE forever!
 * No API calls needed, no Twilio required!
 * 
 * If visitor provides WhatsApp number:
 * - Email includes clickable WhatsApp link
 * - Opens WhatsApp Web/App directly
 * - Admin can message visitor with one click
 * - 100% FREE, no costs ever!
 */

/**
 * Send email notification with FREE WhatsApp link
 */
export async function sendNewMessageNotifications(data: NotificationData): Promise<{
  email: boolean;
  whatsapp: boolean;
}> {
  const emailResult = await sendEmailNotification(data);

  return {
    email: emailResult,
    whatsapp: !!data.visitorWhatsApp, // True if WhatsApp link included in email
  };
}

