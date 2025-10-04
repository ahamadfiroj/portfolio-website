'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users, Archive, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '@/lib/socket';
import type { Message, Conversation } from '@/models/Chat';

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [adminName] = useState('Firoj Ahamad');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;

    socket.emit('join-admin');

    socket.on('admin-notification', ({ conversationId, message }) => {
      // Update conversations list
      loadConversations();
      
      // If viewing this conversation, add message
      if (selectedConversation?.visitorId === conversationId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    socket.on('new-message', (message: Message) => {
      if (selectedConversation?.visitorId === message.conversationId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    return () => {
      socket.off('admin-notification');
      socket.off('new-message');
    };
  }, [selectedConversation]);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-select conversation from URL parameter
  useEffect(() => {
    if (conversations.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const conversationId = params.get('conversation');
      if (conversationId) {
        const conversation = conversations.find(c => c.visitorId === conversationId);
        if (conversation) {
          handleSelectConversation(conversation);
        }
      }
    }
  }, [conversations]);

  // Load messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.visitorId);
      markAsRead(selectedConversation.visitorId);
      socketRef.current?.emit('join-conversation', selectedConversation.visitorId);
    }

    return () => {
      if (selectedConversation) {
        socketRef.current?.emit('leave-conversation', selectedConversation.visitorId);
      }
    };
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async (showLoader = false) => {
    if (showLoader) {
      setIsRefreshing(true);
    }
    try {
      const response = await fetch('/api/chat/conversations');
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      if (showLoader) {
        setIsRefreshing(false);
      }
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await fetch('/api/chat/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });
      loadConversations();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedConversation(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation.visitorId,
      sender: 'admin' as const,
      senderName: adminName,
      message: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    };

    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();
      if (data.success && socketRef.current) {
        socketRef.current.emit('send-message', {
          conversationId: selectedConversation.visitorId,
          message: data.message,
        });
        loadConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Simplified */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Chat Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Manage visitor conversations</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-100px)] sm:h-[calc(100vh-140px)]">
          {/* Conversations List */}
          <div className={`${showMobileChat ? 'hidden' : 'block'} lg:block lg:col-span-4 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col`}>
            {/* Conversations Header with Stats */}
            <div className="p-3 sm:p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Conversations</h2>
                <div className="flex items-center gap-2">
                  {/* Conversation Count */}
                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900 text-sm">{conversations.length}</span>
                  </div>
                  {/* Unread Badge */}
                  {totalUnread > 0 && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {totalUnread}
                    </div>
                  )}
                  {/* Refresh Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      loadConversations(true);
                    }}
                    disabled={isRefreshing}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh conversations"
                  >
                    <RefreshCw 
                      className={`w-4 h-4 text-gray-600 transition-transform ${
                        isRefreshing ? 'animate-spin' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center text-gray-500 mt-12 px-4">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Visitors will appear here when they start chatting</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.visitorId}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-3 sm:p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation?.visitorId === conversation.visitorId
                        ? 'bg-blue-50 border-l-4 border-l-blue-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-gray-900">
                          {conversation.visitorName}
                        </h3>
                        {conversation.visitorWhatsApp && (
                          <span className="text-green-500" title="Has WhatsApp">📱</span>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conversation.lastMessageTime).toLocaleString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area - Desktop */}
          <div className="hidden lg:flex lg:col-span-8 bg-white rounded-lg shadow-sm flex-col">
            {selectedConversation ? (
              <ChatArea
                selectedConversation={selectedConversation}
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Area - Mobile (Full Screen) */}
          <AnimatePresence>
            {showMobileChat && selectedConversation && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col"
              >
                {/* Mobile Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center gap-3">
                  <button
                    onClick={handleBackToList}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div className="flex-1">
                    <h2 className="font-semibold">{selectedConversation.visitorName}</h2>
                    {selectedConversation.visitorWhatsApp && (
                      <p className="text-sm opacity-90">📱 {selectedConversation.visitorWhatsApp}</p>
                    )}
                  </div>
                  {selectedConversation.visitorWhatsApp && (
                    <a
                      href={`https://wa.me/${selectedConversation.visitorWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedConversation.visitorName}, thanks for contacting me!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>💬</span>
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  )}
                </div>

                <ChatArea
                  selectedConversation={selectedConversation}
                  messages={messages}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  messagesEndRef={messagesEndRef}
                  isMobile={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Separate Chat Area Component
function ChatArea({
  selectedConversation,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isLoading,
  messagesEndRef,
  isMobile = false,
}: {
  selectedConversation: Conversation;
  messages: Message[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isMobile?: boolean;
}) {
  return (
    <>
      {/* Chat Header (Desktop only) */}
      {!isMobile && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">
                {selectedConversation.visitorName}
              </h2>
              {selectedConversation.visitorEmail && (
                <p className="text-sm text-gray-600">{selectedConversation.visitorEmail}</p>
              )}
              {selectedConversation.visitorWhatsApp && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">📱 {selectedConversation.visitorWhatsApp}</span>
                </div>
              )}
            </div>
            {selectedConversation.visitorWhatsApp && (
              <a
                href={`https://wa.me/${selectedConversation.visitorWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedConversation.visitorName}, thanks for contacting me!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <span>💬</span>
                Message on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No messages yet in this conversation</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === 'admin' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-3 sm:px-4 py-2 ${
                  msg.sender === 'admin'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-xs sm:text-sm font-medium mb-1">
                  {msg.sender === 'admin' ? 'You' : msg.senderName}
                </p>
                <p className="text-sm break-words">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </>
  );
}
