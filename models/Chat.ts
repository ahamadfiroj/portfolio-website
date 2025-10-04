import { ObjectId } from 'mongodb';

export interface Message {
  _id?: ObjectId;
  conversationId: string;
  sender: 'visitor' | 'admin';
  senderName: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  _id?: ObjectId;
  visitorId: string;
  visitorName: string;
  visitorEmail?: string;
  visitorWhatsApp?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'active' | 'archived';
  createdAt: Date;
}

