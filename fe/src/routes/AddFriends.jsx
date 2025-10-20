import { Link, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { verifyToken } from "./verifyToken";
import { OtherUserProfile } from "./OtherUserProfile";

export const AddFriends = ({
  setUser,
  addFriendsOpen,
  setAddFriendsOpen,
  setOtherUsers,
  otherUsers,
}) => {
  const [otherUser, setOtherUser] = useState();
  const [otherUserProfileOpen, setOtherUserProfileOpen] = useState();
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app');
  const closeAddFriends = (event) => {
    event.preventDefault();
    setAddFriendsOpen(false);
  };

  const checkOtherUserProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const data = {
      userId: e.target.id,
      accessToken: token,
    };
    const url = `${path}/users/checkUserProfile`;
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
        setOtherUser(data);
        setOtherUserProfileOpen(true);
      });
  };

  const addFriend = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const data = {
      friendId: e.target.id,
      accessToken: token,
    };
    const url = `${path}/friends/addFriend`;
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
        if (data.message === "Friend invite sent") {      
          alert(data.message);
          setOtherUsers(data.users);
          
        }

        if (data.message === "jwt expired") {
          verifyToken({ token, setUser, path });
        }
      });
      
  };

  if (addFriendsOpen) {
    return (
      <div
        className="modal"
        style={{ position: "absolute", width: "100vw", height: "100vh" }}
      >
        <div>
          <ul className="list-of-user-to-be-added-as-friends">
            {otherUsers !== undefined &&
              otherUsers.map((user) => (
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

                  {user.username}
                  <button id={user.id} onClick={checkOtherUserProfile}>
                    Inspect
                  </button>
                  <button id={user.id} onClick={addFriend}>
                    Add
                  </button>
                </li>
              ))}
          </ul>
          <button onClick={closeAddFriends}>Close</button>
        </div>
        <OtherUserProfile
          otherUser={otherUser}
          otherUserProfileOpen={otherUserProfileOpen}
          setOtherUserProfileOpen={setOtherUserProfileOpen}
        />
      </div>
    );
  } else {
    return;
  }
};
