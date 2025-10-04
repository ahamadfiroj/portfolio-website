import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Get the socket URL based on environment
const getSocketUrl = (): string => {
  // If running on the client side, use window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback to environment variable or localhost for SSR
  return process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
};

export const getSocket = (): Socket => {
  if (!socket) {
    const socketUrl = getSocketUrl();
    console.log('Connecting to Socket.io server:', socketUrl);
    
    socket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

