import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { User, sanitizeUser } from '@/models/User';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

// Get current user from token
async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// GET - List all admin users (requires authentication)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get all users (excluding passwords)
    const users = await db.collection<User>('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      users: users.map(sanitizeUser),
      currentUser: {
        userId: currentUser.userId,
        username: currentUser.username,
        role: currentUser.role
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new admin user (requires super-admin role)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only super-admin can create new users
    if (currentUser.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Only super-admin can create new users' },
        { status: 403 }
      );
    }

    const { username, email, fullName, password, role } = await request.json();

    // Validate input
    if (!username || !email || !fullName || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (role && role !== 'admin' && role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin" or "super-admin"' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if username already exists
    const existingUser = await db.collection<User>('users').findOne({ username });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.collection<User>('users').findOne({ email });
    
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      username,
      email,
      fullName,
      password: hashedPassword,
      role: role || 'admin',
      isActive: true,
      createdAt: new Date(),
    };

    const result = await db.collection<User>('users').insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: sanitizeUser({ ...newUser, _id: result.insertedId })
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PATCH - Update user (change password, toggle active status, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, updates } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Users can update their own profile or super-admin can update anyone
    const canUpdate = 
      currentUser.userId === userId || 
      currentUser.role === 'super-admin';

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'You can only update your own profile' },
        { status: 403 }
      );
    }

    // Prepare update object
    const updateData: Partial<User> = {};

    // Allow password change
    if (updates.password) {
      updateData.password = await bcrypt.hash(updates.password, 10);
    }

    // Allow profile updates
    if (updates.email) updateData.email = updates.email;
    if (updates.fullName) updateData.fullName = updates.fullName;
    if (updates.mobile !== undefined) updateData.mobile = updates.mobile || undefined;

    // Only super-admin can change role and active status
    if (currentUser.role === 'super-admin') {
      if (updates.role) updateData.role = updates.role;
      if (typeof updates.isActive === 'boolean') updateData.isActive = updates.isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }

    // Perform update
    const result = await db.collection<User>('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: sanitizeUser(result)
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (super-admin only)
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only super-admin can delete users
    if (currentUser.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Only super-admin can delete users' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent deleting yourself
    if (currentUser.userId === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection<User>('users').deleteOne({
      _id: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

