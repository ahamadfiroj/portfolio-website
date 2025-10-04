// Alternative email service using webhook/API approach
// This can be used as a fallback when SMTP fails on cloud providers

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
}

// Simple webhook-based email service
export async function sendEmailViaWebhook(formData: ContactFormData): Promise<{ success: boolean; message: string; error?: string }> {
  const { name, email, subject, message, timestamp } = formData;

  // You can use services like:
  // 1. EmailJS (client-side, free)
  // 2. Formspree (free tier available)
  // 3. Netlify Forms (if using Netlify)
  // 4. Resend API (modern email API)
  
  // For now, let's implement a simple logging approach
  console.log('📧 Email would be sent via webhook:');
  console.log('To:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
  console.log('Subject:', `New Contact Form Submission: ${subject}`);
  console.log('From:', email);
  console.log('Name:', name);
  console.log('Message:', message);
  console.log('Timestamp:', timestamp.toLocaleString());

  // In a real implementation, you would:
  // 1. Send to a webhook service
  // 2. Use an email API like Resend, SendGrid, etc.
  // 3. Store in database and process separately
  
  return {
    success: true,
    message: 'Email logged (webhook service not implemented)'
  };
}

// Resend API implementation (recommended)
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
