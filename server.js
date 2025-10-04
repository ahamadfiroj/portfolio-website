const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_SITE_URL 
        : 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a conversation room
    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`Socket ${socket.id} left conversation: ${conversationId}`);
    });

    // Admin joins to receive all notifications
    socket.on('join-admin', () => {
      socket.join('admin-room');
      console.log(`Admin joined: ${socket.id}`);
    });

    // Handle new message
    socket.on('send-message', (data) => {
      const { conversationId, message } = data;
      // Broadcast to conversation room
      io.to(conversationId).emit('new-message', message);
      // Notify admin if message is from visitor
      if (message.sender === 'visitor') {
        io.to('admin-room').emit('admin-notification', {
          conversationId,
          message,
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      socket.to(data.conversationId).emit('user-typing', data);
    });

    socket.on('stop-typing', (data) => {
      socket.to(data.conversationId).emit('user-stop-typing', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log('> Socket.io server is running');
    });
});

