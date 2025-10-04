import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  username: string;
  password: string; // Hashed password
  email: string;
  fullName: string;
  mobile?: string; // Optional mobile number
  role: 'admin' | 'super-admin';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  mobile?: string;
  role: 'admin' | 'super-admin';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

// Helper to convert User to UserResponse (without password)
export function sanitizeUser(user: User): UserResponse {
  const { password, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    _id: user._id?.toString() || '',
  };
}

