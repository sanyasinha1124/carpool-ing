// src/socket/socket.ts
import { Server, Socket } from 'socket.io';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('join_ride', (rideId: string) => {
      socket.join(`ride:${rideId}`);
      console.log(`User joined ride room: ${rideId}`);
    });

    socket.on('send_message', (data: {
      rideId: string; userId: string; message: string
    }) => {
      io.to(`ride:${data.rideId}`).emit('new_message', {
        userId: data.userId,
        message: data.message,
        time: new Date()
      });
    });

    socket.on('seat_booked', (data: { rideId: string; seatsLeft: number }) => {
      io.to(`ride:${data.rideId}`).emit('seats_updated', data);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};