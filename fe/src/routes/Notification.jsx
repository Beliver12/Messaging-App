import { Link, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { verifyToken } from "./verifyToken";

export const Notifications = ({
  setUser,
  notificationsOpen,
  notifications,
  setNotificationsOpen,
  setNotifications,
  setUsersInChat,
  setChatId,
  notificationsLength,
  setNotificationLength,
}) => {
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app');

  const closeNotifications = (e) => {
    debugger;
    e.preventDefault();
    setNotificationsOpen(false);
  };

  const declineFriendRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const data = {
      accessToken: token,
      id: e.target.id,
    };

    const url = `${path}/friends/declineFriendRequest`;
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
        console.log(data);
        if (data.message === "jwt expired") {
          verifyToken({ token, setUser, path });
        }
        setNotifications(data);
        setNotificationLength(data.length);
        localStorage.setItem("notificationsLength", data.length);
        alert("friend request declined");
      });
  };

  const acceptFriendRequest = async (e) => {
    debugger;
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const data = {
      accessToken: token,
      id: e.target.id,
    };

    const url = `${path}/friends/acceptFriendRequest`;
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
        console.log(data);
        if (data.message === "jwt expired") {
          verifyToken({ token, setUser });
        }
        setNotifications(data.users);
        setNotificationLength(data.users.length);
        localStorage.setItem("notificationsLength", data.users.length);
        setUsersInChat(data.users2);
        setChatId(data.chatId);
        alert("friend request accepted");
      });
  };

  if (notificationsOpen) {
    return (
      <div
        className="modal"
        style={{ position: "absolute", width: "100vw", height: "100vh" }}
      >
        <div>
          <ul className="list-of-user-to-be-added-as-friends">
            {notifications !== undefined &&
              notifications.map((user) => (
                <li key={user.id} id={user.id}>
                  <img
                    id={user.id}
                    className="profileImage"
                    src={`${path}/images/${user.image}`}
                    alt=""
                  />
                  {user.username}

                  <img
                    onClick={acceptFriendRequest}
                    id={user.id}
                    className="accept-friend-request"
                    src="/accept.png"
                    alt=""
                  />

                  <img
                    onClick={declineFriendRequest}
                    id={user.id}
                    className="decline-friend-request"
                    src="/remove.png"
                    alt=""
                  />
                </li>
              ))}
          </ul>
          <button onClick={closeNotifications}>Close</button>
        </div>
      </div>
    );
  } else {
    return;
  }
};
