import { Link, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { verifyToken } from "./verifyToken";
import { ChatForm } from "./ChatForm";

export const Chat = ({
  usersInChat,
  setUsersInChat,
  setUser,
  chatFormOpen,
  setChatFormOpen,
  setChatId,
  chatId,
  user,
}) => {
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app');
  const [chat, setChat] = useState();
  const [userInChat, setUserInChat] = useState();
  const [messagesInChat, setMessagesInChat] = useState();

  

  const removeUser = (e) => {
    e.preventDefault();
    let text = "Are you sure you want to remove this user from friends.";
    if (confirm(text) === false) {
      return false;
    }
    const token = localStorage.getItem("accessToken");

    const data = {
      friendId: e.target.id,
      accessToken: token,
    };
    const url = `${path}/friends/removeFriend`;
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "jwt expired") {
          verifyToken({ token, setUser, path });
        }
        setUsersInChat(data);
      });
  };

  const openChatForm = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const data = {
      friendId: e.target.id,
      accessToken: token,
    };
    const url = `${path}/chat`;
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        if(data.error === "This user is not your friend anymore") {
          location.reload();
          return false
        }
        setChat(data.chat);
        setUserInChat(data.userInChat);
        setChatFormOpen(true);
        setMessagesInChat(data.messages);
      });

    document.querySelector(".sidebar").style.display = "none";
    document.querySelector(".welcome").style.display = "none";
  };



  return (
    <div className="main">
      <div className="sidebar">
        <ul>
          {usersInChat !== undefined &&
            usersInChat.map((user) => (
              <li key={user.id} id={user.id}>
                {user.isOnline === "true" ? (
                  <img
                    id={user.id}
                    className="profileImage"
                    src={`${path}/images/${user.image}`}
                    alt=""
                    style={{
                      borderColor: "green",
                    }}
                  />
                ) : (
                  <img
                    id={user.id}
                    className="profileImage"
                    src={`${path}/images/${user.image}`}
                    alt=""
                    style={{
                      borderColor: "red",
                    }}
                  />
                )}
                <div>{user.username}</div>
                <img
                  id={user.id}
                  onClick={removeUser}
                  className="icon"
                  src="/remove-user.png"
                  alt=""
                />
                <img
                  id={user.id}
                  onClick={openChatForm}
                  className="icon"
                  src="/send-message.png"
                  alt=""
                />
              </li>
            ))}
        </ul>
      </div>
      <ChatForm
        chatFormOpen={chatFormOpen}
        setChatFormOpen={setChatFormOpen}
        chat={chat}
        userInChat={userInChat}
        setMessagesInChat={setMessagesInChat}
        messagesInChat={messagesInChat}
        user={user}
      />
      <div className="welcome">
        <div className="flex flex-col items-center justify-center h-full text-white text-center p-6">
          <div className="max-w-md border border-yellow-500 rounded-2xl p-6 bg-[#1e1e1e] shadow-md">
            <h2 className="text-3xl font-semibold mb-4">👋 Welcome, {user}!</h2>
            <p className="mb-2">
              Start chatting with your friends using the sidebar.
            </p>
            <ul className="text-left mt-4 space-y-2">
              <li>
                ➤ Click <strong style={{ color: "lightblue" }}>“➤”</strong> to
                view your messages
              </li>
              <li>➤ Add friends to expand your network</li>
              <li>➤ Stay connected and chat in real time!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
