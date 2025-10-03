import { io } from "socket.io-client";

const socket = io.connect('https://messaging-app-messaging-app-livee.up.railway.app');

export function joinUserRoom(userId) {
  if (!userId) return;
  socket.emit("login", userId); // ✅ client tells server to join room
}

export default socket;