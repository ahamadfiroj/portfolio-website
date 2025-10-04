import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { PasswordReset } from '@/models/PasswordReset';

export async function POST(request: NextRequest) {
  try {
    const { username, otp } = await request.json();

    if (!username || !otp) {
      return NextResponse.json(
        { error: 'Username and OTP are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Find user by username to get email
    const user = await db.collection<User>('users').findOne({ 
      username,
      isActive: true 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username' },
        { status: 400 }
      );
    }

    // Find the most recent OTP for this user's email
    const passwordReset = await db.collection<PasswordReset>('password_resets')
      .findOne(
        {
          email: user.email,
          verified: false,
          expiresAt: { $gt: new Date() }
        },
        { sort: { createdAt: -1 } }
      );

    if (!passwordReset) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (passwordReset.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await db.collection<PasswordReset>('password_resets').updateOne(
      { _id: passwordReset._id },
      { $set: { verified: true } }
    );

    // Generate a temporary token for password reset
    const resetToken = passwordReset._id?.toString();

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

