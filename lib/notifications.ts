import nodemailer from 'nodemailer';

// WhatsApp: We use FREE direct links in email instead of paid Twilio API!
// No configuration needed - completely free forever!

interface NotificationData {
  visitorName: string;
  message: string;
  conversationId: string;
  visitorWhatsApp?: string;
}

/**
 * Send email notification when a visitor sends a message
 */
export async function sendEmailNotification(data: NotificationData): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('❌ Email credentials not configured. Email notifications disabled.');
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('❌ ADMIN_EMAIL not configured');
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const chatLink = `${siteUrl}/admin/chat?conversation=${data.conversationId}`;
  
  // Create WhatsApp link if visitor provided number
  const whatsappLink = data.visitorWhatsApp 
    ? `https://wa.me/${data.visitorWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${data.visitorName}, thanks for contacting me!`)}`
    : null;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `💬 New Chat Message from ${data.visitorName}${data.visitorWhatsApp ? ' 📱' : ''}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>💬 New Chat Message</h2>
          </div>
          <div class="content">
            <p><strong>From:</strong> ${data.visitorName}</p>
            ${data.visitorWhatsApp ? `<p><strong>WhatsApp:</strong> <a href="${whatsappLink}">${data.visitorWhatsApp}</a></p>` : ''}
            <div class="message-box">
              <p><strong>Message:</strong></p>
              <p>${data.message}</p>
            </div>
            <p>A visitor has sent you a message through your portfolio website!</p>
            <div style="margin: 20px 0;">
              <a href="${chatLink}" class="button" style="margin-right: 10px;">💬 Reply in Chat</a>
              ${data.visitorWhatsApp ? `<a href="${whatsappLink}" class="button" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);">📱 Message on WhatsApp</a>` : ''}
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              Chat Dashboard: <a href="${chatLink}">${chatLink}</a>
              ${data.visitorWhatsApp ? `<br>WhatsApp Direct: <a href="${whatsappLink}">${whatsappLink}</a>` : ''}
            </p>
          </div>
          <div class="footer">
            <p>This is an automated notification from your portfolio chat system.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Chat Message from ${data.visitorName}
${data.visitorWhatsApp ? `WhatsApp: ${data.visitorWhatsApp}` : ''}

Message: ${data.message}

Reply in Chat: ${chatLink}
${data.visitorWhatsApp ? `Message on WhatsApp: ${whatsappLink}` : ''}
    `,
  };

  // Try each SMTP configuration until one works
  for (let i = 0; i < smtpConfigs.length; i++) {
    const config = smtpConfigs[i];
    console.log(`📧 Attempting to send chat notification with config ${i + 1}/${smtpConfigs.length}...`);
    console.log(`Host: ${config.host}, Port: ${config.port}, Secure: ${config.secure}`);
    console.log('To:', adminEmail);
    
    try {
      const transporter = nodemailer.createTransport(config);
      
      // Test connection first
      await transporter.verify();
      console.log('✅ SMTP connection verified for chat notification');
      
      // Send email
      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Email notification sent for conversation: ${data.conversationId}`, result.messageId);
      return true;
    } catch (error) {
      console.error(`❌ Chat Config ${i + 1} failed:`, error);
      
      // If this is the last config, try alternative email service
      if (i === smtpConfigs.length - 1) {
        console.log('🔄 All SMTP configs failed for chat notification, trying alternative email service...');
        
        // Try Resend API as fallback
        if (process.env.RESEND_API_KEY) {
          console.log('📧 Attempting to send chat notification via Resend API...');
          const resendResult = await sendChatNotificationViaResend(data);
          if (resendResult.success) {
            return true;
          }
        }
        
        console.error('❌ All chat notification email methods failed');
        return false;
      }
      
      // Try next configuration
      console.log(`🔄 Trying next chat notification configuration...`);
    }
  }

  return false;
}

// Resend API implementation for chat notifications
async function sendChatNotificationViaResend(data: NotificationData): Promise<{ success: boolean; message: string; error?: string; messageId?: string }> {
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

