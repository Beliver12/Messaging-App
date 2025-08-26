import { Link, Navigate } from "react-router";
import { useState } from "react";

export const UserProfile = ({
  about,
  user,
  image,
  userProfileOpen,
  setUserProfileOpen,
}) => {
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app');

  const closeUserProfile = (event) => {
    event.preventDefault();
    setUserProfileOpen(false);
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

  if (userProfileOpen) {
    return (
      <div
        className="modal"
        style={{ position: "absolute", width: "100vw", height: "100vh" }}
      >
        <div>
          <img
            onClick={zoomInProfile}
            className="profileImage-modal"
            src={`${path}/images/${image}`}
            alt=""
          />
          <h2>{user}</h2>
          <p>{about}</p>
          <button onClick={closeUserProfile}>Close</button>
        </div>
      </div>
    );
  } else {
    return;
  }
};
