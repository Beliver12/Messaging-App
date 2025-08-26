import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Link } from "react-router";
import { UserProfile } from "./routes/UserProfile";
import { AddFriends } from "./routes/AddFriends";
import { verifyToken } from "./routes/verifyToken";
import { EditProfile } from "./routes/EditProfile";
import { Notifications } from "./routes/Notification";
import { Chat } from "./routes/Chat";

import "./App.css";

const LogInForm = ({ user, setUser }) => {
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
  const [notifications, setNotifications] = useState();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  //Notifications.jsx

  //Chat.jsx
  const [usersInChat, setUsersInChat] = useState();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFormOpen, setChatFormOpen] = useState(false);
  //Chat.jsx

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
      });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("image");
    localStorage.removeItem("about");
    localStorage.removeItem("online");
    setUser("");
    setChatOpen(false);
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

  const openChat = async (e) => {
    e.preventDefault();
    if (!chatOpen) {
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
          if (data.message === "jwt expired") {
            verifyToken({ token, setUser, path });
          }
          setUsersInChat(data);
          setChatOpen(true);
          document.querySelector(".welcome").style.display = "none";
        });
    } else if (chatOpen) {
      setChatOpen(false);
      setChatFormOpen(false);
      document.querySelector(".welcome").style.display = "flex";
    }
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
        <a
          href="https://www.flaticon.com/free-icons/mobile-app"
          title="mobile app icons"
        >
          Mobile app icons created by srip - Flaticon
        </a>
        <a href="https://imgsearch.com/image/modern-office-collaboration-with-digital-communication-icons-326788">
          Image by ImgSearch:
          https://imgsearch.com/image/modern-office-collaboration-with-digital-communication-icons-326788
        </a>
        <a
          href="https://www.flaticon.com/free-icons/writer"
          title="writer icons"
        >
          Writer icons created by SeyfDesigner - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/message"
          title="message icons"
        >
          Message icons created by Freepik - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/notification"
          title="notification icons"
        >
          Notification icons created by Pixel perfect - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/edit-info"
          title="edit info icons"
        >
          Edit info icons created by ZAK - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/add-user"
          title="add user icons"
        >
          Add user icons created by Freepik - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/logout"
          title="logout icons"
        >
          Logout icons created by Pixel perfect - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/reject"
          title="reject icons"
        >
          Reject icons created by Good Ware - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/message"
          title="message icons"
        >
          Message icons created by onlyhasbi - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/tick" title="tick icons">
          Tick icons created by kliwir art - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/unfriend"
          title="unfriend icons"
        >
          Unfriend icons created by kliwir art - Flaticon
        </a>
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
              src={`http://localhost:8080/images/${image}`}
              alt=""
              style={{
                borderWidth: 4,
                borderColor: "green",
                borderStyle: "solid",
              }}
            />
          ) : (
            <img
              className="profileImage"
              src={`http://localhost:8080/images/${image}`}
              alt=""
              style={{
                borderWidth: 4,
                borderColor: "red",
                borderStyle: "solid",
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
          <button onClick={openChat}>
            Open Chat <img src="/chat.png" alt="" />
          </button>
          <button onClick={openNotifications}>
            Notifications <img src="/active.png" alt="" />
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
      />
      <Notifications
        setUser={setUser}
        notificationsOpen={notificationsOpen}
        notifications={notifications}
        setNotificationsOpen={setNotificationsOpen}
        setNotifications={setNotifications}
        setUsersInChat={setUsersInChat}
      />
      <Chat
        usersInChat={usersInChat}
        setUser={setUser}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        setUsersInChat={setUsersInChat}
        setChatFormOpen={setChatFormOpen}
        chatFormOpen={chatFormOpen}
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
                ➤ Click <strong>“Open Chat”</strong> to view your messages
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

export const App = () => {
  const userr = localStorage.getItem("user");
  const [user, setUser] = useState(userr);

  return (
    <>
      <LogInForm user={user} setUser={setUser} />
    </>
  );
};
