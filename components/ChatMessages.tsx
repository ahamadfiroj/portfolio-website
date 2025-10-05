'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import type { Message } from '@/models/Chat';

export default function ChatMessages({ visitorId, sentMessage, isAdmin, isOpen }: { visitorId: string, sentMessage?: boolean, isAdmin?: boolean, isOpen?: boolean }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLanding, setIsPageLanding] = useState(false);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/chat/messages?conversationId=${id}`);
            const data = await response.json();
            if (data.success) {
                setMessages(data.messages);
                setTimeout(scrollToBottom, 100);
                setIsPageLanding(true);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
           setTimeout(() => {
            setIsLoading(false);
           }, 3000);
        }
    }, []);

    useEffect(() => {
        if (sentMessage || isOpen || visitorId) {
            loadMessages(visitorId);
        }
    }, [sentMessage, isOpen, visitorId]);


    useEffect(() => {
        const interval = setInterval(() => {
            loadMessages(visitorId);
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            {/* Floating Chat Button */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {isLoading && !isPageLanding && messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                    <Loader2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                </div>
            ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>{isAdmin ? "No messages yet. Wait for the visitor to start the conversation!" : "No messages yet. Start the conversation!"}</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${(msg.sender === 'visitor' && !isAdmin) || (msg.sender === 'admin' && isAdmin )? 'justify-end' : 'justify-start'
                                }`}
                        >
                            <div
                                className={`max-w-[80%] sm:max-w-[75%] rounded-lg px-4 py-2 ${(msg.sender === 'visitor' && !isAdmin) || (msg.sender === 'admin' && isAdmin )
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-white text-gray-800 border border-gray-200'
                                    }`}
                            >
                                <p className="text-sm break-words">{msg.message}</p>
                                <p
                                    className={`text-xs mt-1 ${(msg.sender === 'visitor' && !isAdmin) || (msg.sender === 'admin' && isAdmin )
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
        </>
    );
}
