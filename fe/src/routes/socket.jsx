// routes/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io('https://messaging-app-messaging-app-livee.up.railway.app', {
      autoConnect: true,         // connect immediately
      reconnection: true,        // keep retrying if server is down
      reconnectionAttempts: 20,  // how many times to try before giving up
      reconnectionDelay: 1000,   // wait 1s between attempts
      reconnectionDelayMax: 5000 // max wait = 5s
    });
    socket.connect(); // connect when you decide (e.g., after login)
  }
  return socket;
};

export const getSocket = () => socket;
