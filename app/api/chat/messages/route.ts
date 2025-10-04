import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Message, Conversation } from '@/models/Chat';
import { sendNewMessageNotifications } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const messages = await db
      .collection<Message>('messages')
      .find({ conversationId })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      messages 
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { conversationId, sender, senderName, message } = body;

    if (!conversationId || !sender || !senderName || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create new message
    const newMessage: Message = {
      conversationId,
      sender,
      senderName,
      message,
      timestamp: new Date(),
      read: false,
    };

    const result = await db
      .collection<Message>('messages')
      .insertOne(newMessage);

    const savedMessage = { ...newMessage, _id: result.insertedId };

    // Update conversation with last message
    await db.collection<Conversation>('conversations').updateOne(
      { visitorId: conversationId },
      {
        $set: {
          lastMessage: message,
          lastMessageTime: new Date(),
        },
        $inc: {
          unreadCount: sender === 'visitor' ? 1 : 0,
        },
      }
    );

    // Send notifications if message is from visitor (not admin)
    if (sender === 'visitor') {
      // Get conversation details for WhatsApp number
      const conversation = await db.collection<Conversation>('conversations').findOne({ visitorId: conversationId });
      
      // Send notifications in the background (don't wait for them)
      sendNewMessageNotifications({
        visitorName: senderName,
        message: message,
        conversationId: conversationId,
        visitorWhatsApp: conversation?.visitorWhatsApp,
      }).then((results) => {
        if (results.email) {
          console.log('📧 Email notification sent successfully');
        }
        if (results.whatsapp) {
          console.log('📱 WhatsApp notification sent successfully');
        }
      }).catch((error) => {
        console.error('❌ Error sending notifications:', error);
      });
    }

    return NextResponse.json({
      success: true,
      message: savedMessage,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Mark messages as read
    await db.collection<Message>('messages').updateMany(
      { conversationId, read: false },
      { $set: { read: true } }
    );

    // Reset unread count in conversation
    await db.collection<Conversation>('conversations').updateOne(
      { visitorId: conversationId },
      { $set: { unreadCount: 0 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}

