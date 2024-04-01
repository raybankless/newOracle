// server/server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import mongoose from 'mongoose';
import dbConnect from '../utils/dbConnect'; // Adjust the path as necessary

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  await dbConnect();

  const db = mongoose.connection;
  const changeStream = db.collection('events').watch();

  changeStream.on('change', (change) => {
    console.log('Detected Change:', change);
    io.emit('dataChange', { data: change.fullDocument });
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
