import { Link, Navigate } from "react-router";
import { useState } from "react";

export const OtherUserProfile = ({
  otherUser,
  otherUserProfileOpen,
  setOtherUserProfileOpen,
}) => {
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app');
  const closeUserProfile = (event) => {
    event.preventDefault();
    setOtherUserProfileOpen(false);
  };

  const zoomInProfile = (e) => {
    if (e.target.className === "profileImage-modal") {
      document
        .querySelector(".profileImage-modal")
        .classList.add("profileImageZoomed");
    } else {
      document
        .querySelector(".profileImage-modal")
        .classList.remove("profileImageZoomed");
    }
  };

  if (otherUserProfileOpen) {
    return (
      <div
        className="modal-modal"
        style={{ position: "absolute", width: "100vw", height: "100vh" }}
      >
        <div>
          {otherUser.isOnline === "true" ? (
            <img
              onClick={zoomInProfile}
              className="profileImage-modal"
              src={`${path}/images/${otherUser[0].image}`}
              alt=""
              style={{
                borderWidth: 4,
                borderColor: "green",
                borderStyle: "solid",
              }}
            />
          ) : (
            <img
              onClick={zoomInProfile}
              className="profileImage-modal"
              src={`${path}/images/${otherUser[0].image}`}
              alt=""
              style={{
                borderWidth: 4,
                borderColor: "red",
                borderStyle: "solid",
              }}
            />
          )}

          <h2>{otherUser[0].username}</h2>
          <p>{otherUser[0].about}</p>
          <button onClick={closeUserProfile}>Close</button>
        </div>
      </div>
    );
  } else {
    return;
  }
};
