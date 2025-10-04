import { ObjectId } from 'mongodb';

export interface PasswordReset {
  _id?: ObjectId;
  userId: ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  verified: boolean;
}

