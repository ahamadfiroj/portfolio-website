'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '@/lib/socket';
import type { Message } from '@/models/Chat';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [visitorId, setVisitorId] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorWhatsApp, setVisitorWhatsApp] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  // Generate or retrieve visitor ID
  useEffect(() => {
    let id = localStorage.getItem('visitorId');
    if (!id) {
      id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitorId', id);
    }
    setVisitorId(id);

    const savedName = localStorage.getItem('visitorName');
    const savedWhatsApp = localStorage.getItem('visitorWhatsApp');
    if (savedName) {
      setVisitorName(savedName);
      if (savedWhatsApp) {
        setVisitorWhatsApp(savedWhatsApp);
      }
      setIsNameSet(true);
      loadMessages(id);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (isNameSet && visitorId) {
      socketRef.current = getSocket();
      const socket = socketRef.current;

      socket.emit('join-conversation', visitorId);

      socket.on('new-message', (message: Message) => {
        setMessages((prev) => [...prev, message]);
        if (message.sender === 'admin' && !isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
        scrollToBottom();
      });

      return () => {
        socket.off('new-message');
        socket.emit('leave-conversation', visitorId);
      };
    }
  }, [isNameSet, visitorId, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (id: string) => {
    try {
      const response = await fetch(`/api/chat/messages?conversationId=${id}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSetName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    setIsLoading(true);
    try {
      // Create conversation
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          visitorName: visitorName.trim(),
          visitorWhatsApp: visitorWhatsApp.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('visitorName', visitorName.trim());
        if (visitorWhatsApp.trim()) {
          localStorage.setItem('visitorWhatsApp', visitorWhatsApp.trim());
        }
        setIsNameSet(true);
        await loadMessages(visitorId);
      }
    } catch (error) {
      console.error('Error setting name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !visitorId) return;

    const messageData = {
      conversationId: visitorId,
      sender: 'visitor' as const,
      senderName: visitorName,
      message: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    };

    setNewMessage('');

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();
      if (data.success && socketRef.current) {
        socketRef.current.emit('send-message', {
          conversationId: visitorId,
          message: data.message,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-[28px] right-[48px] z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
        
        {/* Tooltip */}
        {!isOpen && isHovered && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-xl z-50 min-w-max">
            Start Chat
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
          </div>
        )}
      </button>

      {/* Chat Window with Animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleChat}
            />
            
            {/* Chat Modal */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl h-[85vh] flex flex-col overflow-hidden
                        md:inset-auto md:bottom-[100px] md:right-[48px] md:w-96 md:h-[500px] md:rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile drag handle */}
              <div
                className="md:hidden flex justify-center py-3 cursor-pointer bg-white rounded-t-2xl"
                onClick={toggleChat}
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Chat with Firoj</h3>
                  <p className="text-sm opacity-90">I'll reply as soon as I can!</p>
                </div>
                <button
                  onClick={toggleChat}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isNameSet ? (
                /* Name Form */
                <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                  <form onSubmit={handleSetName} className="w-full max-w-sm space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What's your name? <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp Number <span className="text-gray-400 text-xs">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={visitorWhatsApp}
                        onChange={(e) => setVisitorWhatsApp(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        📱 Include country code (e.g., +91 for India)
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
                    >
                      {isLoading ? 'Starting chat...' : 'Start Chat'}
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            msg.sender === 'visitor' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] sm:max-w-[75%] rounded-lg px-4 py-2 ${
                              msg.sender === 'visitor'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.sender === 'visitor'
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString([], {
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
                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t safe-bottom">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
