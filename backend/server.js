const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Make broadcast available to routes
app.set('broadcast', broadcast);

// Routes
const fileRoutes = require('./routes/files');
const notificationRoutes = require('./routes/notifications');
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });