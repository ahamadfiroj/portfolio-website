import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { PasswordReset } from '@/models/PasswordReset';
import { generateOTP, sendOTPEmail } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Find user by username
    const user = await db.collection<User>('users').findOne({ 
      username,
      isActive: true 
    });

    // Always return success (security: don't reveal if username exists)
    if (!user) {
      // Wait a bit to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this username, an OTP has been sent to the registered email.'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const passwordReset: PasswordReset = {
      userId: user._id!,
      email: user.email,
      otp,
      expiresAt,
      createdAt: new Date(),
      verified: false,
    };

    await db.collection<PasswordReset>('password_resets').insertOne(passwordReset);

    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, otp, user.fullName);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    // Mask email for display (show first 2 chars and domain)
    const maskedEmail = user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

    return NextResponse.json({
      success: true,
      message: 'OTP has been sent to your registered email address.',
      email: maskedEmail,
      resetId: passwordReset._id?.toString()
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

