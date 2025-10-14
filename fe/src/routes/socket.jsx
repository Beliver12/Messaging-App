import { io } from "socket.io-client";

const socket = io.connect('https://messaging-app-messaging-app-livee.up.railway.app', {
  withCredentials: true,
});

export function joinUserRoom(userId) {
  if (!userId) return;
  socket.emit("login", userId); // ✅ client tells server to join room
}

socket.on("connect", () => {
  console.log("recovered?", socket.recovered);

  if (socket.recovered) {
    console.log(
      "any event missed during the disconnection period will be received now",
    ); //
  } else {
    console.log("new or unrecoverable session"); //
  }
});
export default socket;
