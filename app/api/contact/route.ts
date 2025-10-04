import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { sendNotificationEmail, ContactFormData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Contact form submission started');
    
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('✅ Form validation passed');

    // Create contact form data with timestamp
    const contactData: ContactFormData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date(),
    };

    // Save to MongoDB
    console.log('💾 Saving to MongoDB...');
    const { db } = await connectToDatabase();
    const collection = db.collection('contacts');
    const result = await collection.insertOne(contactData);
    console.log('✅ Saved to MongoDB:', result.insertedId);

    // Send email notification
    console.log('📧 Sending email notification...');
    const emailResult = await sendNotificationEmail(contactData);

    if (!emailResult.success) {
      console.error('❌ Email sending failed:', emailResult.error);
      // Still return success for database save, but log email failure
    } else {
      console.log('✅ Email sent successfully');
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      id: result.insertedId,
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.message,
    });

  } catch (error) {
    console.error('❌ Contact form submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}