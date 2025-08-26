import { Link, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { verifyToken } from "./verifyToken";

export const ChatForm = ({ chatFormOpen, setChatFormOpen }) => {
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app');

  const closeChatForm = (e) => {
    e.preventDefault();
    setChatFormOpen(false);
    document.querySelector(".sidebar").style.display = "block";
  };

  if (chatFormOpen) {
    return (
      <div className="chat-form">
        <button onClick={closeChatForm}>Close Chat</button>
        <h1>Lets chat</h1>
      </div>
    );
  } else {
    return;
  }
};
