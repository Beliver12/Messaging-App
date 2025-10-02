// routes/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io('https://messaging-app-messaging-app-livee.up.railway.app', {
      autoConnect: false, // don’t connect immediately
    });
    socket.connect(); // connect when you decide (e.g., after login)
  }
  return socket;
};

export const getSocket = () => socket;
