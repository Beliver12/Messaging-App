import { useState, useEffect } from "react";

import { Link } from "react-router";
import { UserProfile } from "./routes/UserProfile";
import { AddFriends } from "./routes/AddFriends";
import { verifyToken } from "./routes/verifyToken";
import { EditProfile } from "./routes/EditProfile";
import { Notifications } from "./routes/Notification";
import { Chat } from "./routes/Chat";
import socket, { joinUserRoom } from "./routes/socket";

import "./App.css";

export const LogInForm = ({ user, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const profileImage = localStorage.getItem("image");
  const aboutUser = localStorage.getItem("about");
  const isOnline = localStorage.getItem("online");
  const [image, setImage] = useState(profileImage);
  const [about, setAbout] = useState(aboutUser);
  const [online, setOnline] = useState(isOnline);
  const [error, setError] = useState("");
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app');
  //UserProfile.jsx
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  //UserProfile.jsx

  //AddFriends.jsx
  const [addFriendsOpen, setAddFriendsOpen] = useState(false);
  const [otherUsers, setOtherUsers] = useState();
  //AddFriends.jsx

  //EditProfile.jsx
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  //EditProfile.jsx

  //Notifications.jsx
  const updatedNotificationLength = localStorage.getItem("notificationsLength");
  const [notificationsLength, setNotificationLength] = useState(
    updatedNotificationLength,
  );
  const [notifications, setNotifications] = useState();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  //Notifications.jsx

  //Chat.jsx
  const [usersInChat, setUsersInChat] = useState();
  const [chatId, setChatId] = useState();
  const [chatFormOpen, setChatFormOpen] = useState(false);
  //Chat.jsx

  //socket stuff

  function getNotificationLength() {
    const token = localStorage.getItem("accessToken");
    const data = {
      accessToken: token,
    };

    const url = `${path}/friends/notifications`;
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
        setNotifications(data);
        setNotificationLength(data.length);
        localStorage.setItem("notificationsLength", data.length);
      });
  }

  function getStatusOfAllUsersInChat() {
    const token = localStorage.getItem("accessToken");
    const data = {
      accessToken: token,
    };

    const url = `${path}/friends/openChat`;
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

        setUsersInChat(data);
      });
  }

  useEffect(() => {
    if (user) {
      getStatusOfAllUsersInChat();
      getNotificationLength();
    }
  }, [user]);

  useEffect(() => {
    socket.onAny((event, data) => {
      console.log("Client received event:", event, data);
    });

    socket.on("newFriendRequest", (user) => {
      alert(`${user.username} sent you a friend request!`);
      setOtherUsers(user.users);
      console.log(socket.listeners("newFriendRequest").length);
    });

    return () => socket.off("newFriendRequest");
  }, []);

  useEffect(() => {
    socket.on("removeUser", (user) => {
      getStatusOfAllUsersInChat();
      alert(`${user.username} removed you from friends`);
      console.log(socket.listeners("removeUser").length);
    });

    return () => socket.off("removeUser");
  }, []);

  useEffect(() => {
    joinUserRoom(user); // join YOUR room
  }, [user]);

  useEffect(() => {
    socket.on("newNotification", (user) => {
      setNotifications(user.users);
      setNotificationLength(user.users.length);
      localStorage.setItem("notificationsLength", user.users.length);
    });

    return () => socket.off("newNotification");
  }, []);

  useEffect(() => {
    socket.on("getStatusOfAllUsersInChat", (user) => {
      getStatusOfAllUsersInChat();
    });

    return () => socket.off("getStatusOfAllUsersInChat");
  }, []);
  

  //socket stuff

  const logOut = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");

    const data = {
      accessToken: token,
    };

    const url = `${path}/users/logOut`;
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
        console.log(data.message);
        socket.emit("loged-out", { message: "loged out" });
      });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("image");
    localStorage.removeItem("about");
    localStorage.removeItem("online");
    setUser("");
  };

  const openUserProfile = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("accessToken");

    verifyToken({ token, setUser, path });
    setUserProfileOpen(true);
  };

  const openAddFriends = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("accessToken");
    const data = {
      accessToken: token,
    };

    const url = `${path}/users`;
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
        setOtherUsers(data);
      });

    setAddFriendsOpen(true);
  };

  const openNotifications = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    const data = {
      accessToken: token,
    };

    const url = `${path}/friends/notifications`;
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
        setNotificationsOpen(true);
      });
  };

  const logIn = async (event) => {
    event.preventDefault();
    const data = {
      password: password,
      email: email,
    };

    const url = `${path}/users/login`;

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
        if (data.token) {
          localStorage.setItem("accessToken", data.token);
          localStorage.setItem("user", data.user.username);
          localStorage.setItem("image", data.user.image);
          localStorage.setItem("about", data.user.about);
          localStorage.setItem("online", data.user.isOnline);
          setUser(data.user.username);
          setImage(data.user.image);
          setAbout(data.user.about);
          setOnline(data.user.isOnline);
          getStatusOfAllUsersInChat();
          socket.on("connect", () => {
            socket.emit("login", data.user.username);
          });
        } else {
          setError(data.error);
        }
      });
  };

  const editProfile = (e) => {
    e.preventDefault();
    setEditProfileOpen(true);
  };

  if (!user) {
    return (
      <>
        <h1>Messaging App</h1>
        <img src="/smartphone.png" alt="" />
        <div className="logInPage">
          <form method="POST" onSubmit={logIn}>
            <h2>Log In</h2>
            {error ? (
              <p style={{ color: "red", backgroundColor: "black", padding: 4 }}>
                {error}!
              </p>
            ) : (
              ""
            )}
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              maxLength="20"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              maxLength="20"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Log In</button>
            <p>Dont have account?</p>
            <Link to="signup">Sign Up</Link>
          </form>
        </div>
      </>
    );
  }
  return (
    <div
      className="homepage"
      style={{ backgroundColor: "black", background: "none" }}
    >
      <div className="header">
        <div className="profile-picture-and-name-div" onClick={openUserProfile}>
          {online === "true" ? (
            <img
              className="profileImage"
              src={`${path}/images/${image}`}
              alt=""
              style={{
                borderColor: "green",
              }}
            />
          ) : (
            <img
              className="profileImage"
              src={`${path}/images/${image}`}
              alt=""
              style={{
                borderColor: "red",
              }}
            />
          )}

          <div>
            <h4>{user}</h4>
            {online === "true" ? (
              <p style={{ color: "green" }}>Online</p>
            ) : (
              <p style={{ color: "red" }}>Offline</p>
            )}
          </div>
        </div>
        <div className="buttons">
          <button className="notification-button" onClick={openNotifications}>
            Notifications <img src="/active.png" alt="" />{" "}
            <div>
              <span>
                {" "}
                {notificationsLength !== null ? notificationsLength : 0}{" "}
              </span>
            </div>
          </button>
          <button onClick={editProfile}>
            Edit Profile <img src="/edit-button.png" alt="" />
          </button>
          <button onClick={openAddFriends}>
            Add Friends <img src="/add-user.png" alt="" />
          </button>
          <button onClick={logOut}>
            Log Out <img src="logout.png" alt="" />
          </button>
        </div>
      </div>
      <AddFriends
        setUser={setUser}
        addFriendsOpen={addFriendsOpen}
        setAddFriendsOpen={setAddFriendsOpen}
        otherUsers={otherUsers}
        setOtherUsers={setOtherUsers}
      />
      <UserProfile
        about={about}
        user={user}
        image={image}
        userProfileOpen={userProfileOpen}
        setUserProfileOpen={setUserProfileOpen}
      />
      <EditProfile
        about={about}
        user={user}
        online={online}
        editProfileOpen={editProfileOpen}
        setEditProfileOpen={setEditProfileOpen}
        setUser={setUser}
        setAbout={setAbout}
        setImage={setImage}
        setOnline={setOnline}
        setChatFormOpen={setChatFormOpen}
      />
      <Notifications
        setUser={setUser}
        notificationsOpen={notificationsOpen}
        notifications={notifications}
        notificationsLength={notificationsLength}
        setNotificationLength={setNotificationLength}
        setNotificationsOpen={setNotificationsOpen}
        setNotifications={setNotifications}
        setUsersInChat={setUsersInChat}
        setChatId={setChatId}
      />
      <Chat
        chatId={chatId}
        usersInChat={usersInChat}
        setUser={setUser}
        user={user}
        setChatId={setChatId}
        setUsersInChat={setUsersInChat}
        setChatFormOpen={setChatFormOpen}
        chatFormOpen={chatFormOpen}
      />
    </div>
  );
};

export const App = () => {
  const userr = localStorage.getItem("user");
  const [user, setUser] = useState(userr);

  useEffect(() => {
    joinUserRoom(userr); // join YOUR room
  }, [userr]);

  return (
    <>
      <LogInForm user={user} setUser={setUser} />
    </>
  );
};
