import { Link, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { verifyToken } from "./verifyToken";
import { ChatForm } from "./ChatForm";

export const Chat = ({
  chatOpen,
  setChatOpen,
  usersInChat,
  setUsersInChat,
  setUser,
  chatFormOpen,
  setChatFormOpen,
}) => {
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app');

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
    setChatFormOpen(true);
    document.querySelector(".sidebar").style.display = "none";
  };

  if (chatOpen) {
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
                        borderWidth: 4,
                        borderColor: "green",
                        borderStyle: "solid",
                      }}
                    />
                  ) : (
                    <img
                      id={user.id}
                      className="profileImage"
                      src={`${path}/images/${user.image}`}
                      alt=""
                      style={{
                        borderWidth: 4,
                        borderColor: "red",
                        borderStyle: "solid",
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
        />
      </div>
    );
  } else {
    return;
  }
};
