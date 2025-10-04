import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Conversation } from '@/models/Chat';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'active';

    const conversations = await db
      .collection<Conversation>('conversations')
      .find({ status })
      .sort({ lastMessageTime: -1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      conversations 
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { visitorId, visitorName, visitorEmail, visitorWhatsApp } = body;

    if (!visitorId || !visitorName) {
      return NextResponse.json(
        { success: false, error: 'Visitor ID and name are required' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await db
      .collection<Conversation>('conversations')
      .findOne({ visitorId });

    if (existingConversation) {
      // Update WhatsApp if provided
      if (visitorWhatsApp) {
        await db.collection<Conversation>('conversations').updateOne(
          { visitorId },
          { $set: { visitorWhatsApp } }
        );
      }
      return NextResponse.json({
        success: true,
        conversation: existingConversation,
      });
    }

    // Create new conversation
    const newConversation: Conversation = {
      visitorId,
      visitorName,
      visitorEmail: visitorEmail || undefined,
      visitorWhatsApp: visitorWhatsApp || undefined,
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0,
      status: 'active',
      createdAt: new Date(),
    };

    const result = await db
      .collection<Conversation>('conversations')
      .insertOne(newConversation);

    return NextResponse.json({
      success: true,
      conversation: { ...newConversation, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

