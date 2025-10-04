// Email service using Resend API (recommended for cloud providers)
// This works when SMTP is blocked by hosting providers like Render

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
}

export interface NotificationData {
  visitorName: string;
  message: string;
  conversationId: string;
  visitorWhatsApp?: string;
}

// Resend API implementation for contact form emails
export async function sendEmailViaResend(formData: ContactFormData): Promise<{ success: boolean; message: string; error?: string; messageId?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      message: 'RESEND_API_KEY not configured'
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <noreply@yourdomain.com>',
        to: [process.env.ADMIN_EMAIL || process.env.EMAIL_USER],
        subject: `New Contact Form Submission: ${formData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
              <p><strong>Subject:</strong> ${formData.subject}</p>
              <p><strong>Submitted:</strong> ${formData.timestamp.toLocaleString()}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">Message</h3>
              <p style="line-height: 1.6; color: #555;">${formData.message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Email sent via Resend:', result.id);
    
    return {
      success: true,
      message: 'Email sent successfully via Resend',
      messageId: result.id
    };
  } catch (error) {
    console.error('❌ Resend API error:', error);
    return {
      success: false,
      message: 'Failed to send email via Resend',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Resend API implementation for OTP emails
export async function sendOTPViaResend(email: string, otp: string, userName: string): Promise<{ success: boolean; message: string; error?: string; messageId?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      message: 'RESEND_API_KEY not configured'
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Admin <noreply@yourdomain.com>',
        to: [email],
        subject: '🔐 Password Reset OTP - Portfolio Admin',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 30px; color: white;">
              <h1 style="margin: 0 0 20px 0;">🔐 Password Reset Request</h1>
              <p>Hello <strong>${userName}</strong>,</p>
              <p>We received a request to reset your password for the Admin Panel. Use the OTP code below to proceed:</p>
              <div style="background: white; color: #333; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your OTP Code</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
              </div>
              <div style="background: rgba(255, 255, 255, 0.1); border-left: 4px solid #fbbf24; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Never share this OTP with anyone</li>
                  <li>This code expires in 10 minutes</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
              </div>
              <p>Enter this OTP on the password reset page to continue.</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.3); font-size: 14px; opacity: 0.9;">
                <p style="margin: 0;">Best regards,<br><strong>Portfolio Admin Team</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 12px;">This is an automated email. Please do not reply to this message.</p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ OTP email sent via Resend:', result.id);
    
    return {
      success: true,
      message: 'OTP email sent successfully via Resend',
      messageId: result.id
    };
  } catch (error) {
    console.error('❌ Resend API error for OTP:', error);
    return {
      success: false,
      message: 'Failed to send OTP email via Resend',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Resend API implementation for chat notifications
export async function sendChatNotificationViaResend(data: NotificationData): Promise<{ success: boolean; message: string; error?: string; messageId?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      message: 'RESEND_API_KEY not configured'
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return { success: false, message: 'ADMIN_EMAIL not configured' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const chatLink = `${siteUrl}/admin/chat?conversation=${data.conversationId}`;
  
  // Create WhatsApp link if visitor provided number
  const whatsappLink = data.visitorWhatsApp 
    ? `https://wa.me/${data.visitorWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${data.visitorName}, thanks for contacting me!`)}`
    : null;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Chat <noreply@yourdomain.com>',
        to: [adminEmail],
        subject: `💬 New Chat Message from ${data.visitorName}${data.visitorWhatsApp ? ' 📱' : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="margin: 0;">💬 New Chat Message</h2>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p><strong>From:</strong> ${data.visitorName}</p>
              ${data.visitorWhatsApp ? `<p><strong>WhatsApp:</strong> <a href="${whatsappLink}">${data.visitorWhatsApp}</a></p>` : ''}
              <div style="background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p><strong>Message:</strong></p>
                <p>${data.message}</p>
              </div>
              <p>A visitor has sent you a message through your portfolio website!</p>
              <div style="margin: 20px 0;">
                <a href="${chatLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 10px 20px 0;">💬 Reply in Chat</a>
                ${data.visitorWhatsApp ? `<a href="${whatsappLink}" style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">📱 Message on WhatsApp</a>` : ''}
              </div>
              <p style="margin-top: 20px; font-size: 14px; color: #666;">
                Chat Dashboard: <a href="${chatLink}">${chatLink}</a>
                ${data.visitorWhatsApp ? `<br>WhatsApp Direct: <a href="${whatsappLink}">${whatsappLink}</a>` : ''}
              </p>
            </div>
            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
              <p>This is an automated notification from your portfolio chat system.</p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Chat notification sent via Resend:', result.id);
    
    return {
      success: true,
      message: 'Chat notification sent successfully via Resend',
      messageId: result.id
    };
  } catch (error) {
    console.error('❌ Resend API error for chat notification:', error);
    return {
      success: false,
      message: 'Failed to send chat notification via Resend',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
