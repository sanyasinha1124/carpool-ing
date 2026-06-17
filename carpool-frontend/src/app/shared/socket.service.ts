// src/app/core/services/socket.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare const require: any;
const { io } = require('socket.io-client');

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  joinRide(rideId: string) {
    this.socket.emit('join_ride', rideId);
  }

  onSeatsUpdated(): Observable<{ rideId: string; seatsLeft: number }> {
    return new Observable(obs => {
      this.socket.on('seats_updated', (data: { rideId: string; seatsLeft: number; }) => obs.next(data));
    });
  }

  onNewMessage(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('new_message', (msg: any) => obs.next(msg));
    });
  }

  sendMessage(rideId: string, userId: string, message: string) {
    this.socket.emit('send_message', { rideId, userId, message });
  }
}