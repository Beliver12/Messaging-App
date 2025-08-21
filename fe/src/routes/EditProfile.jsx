import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router";
export const EditProfile = ({
  about,
  user,
  online,
  editProfileOpen,
  setEditProfileOpen,
  setUser,
  setAbout,
  setImage,
  setOnline,
}) => {
  const [username, setUsername] = useState(user);
  const [editedAbout, setEditedAbout] = useState(about);
  const [editedImage, setEditedImage] = useState({ preview: "", data: "" });
  const [isOnline, setIsOnline] = useState(online);
  const [isEdited, setIsEdited] = useState("");
  const [error, setError] = useState("");
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app')
  const handleEdit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("about", editedAbout);
    formData.append("accessToken", accessToken);
    formData.append("username", username);
    formData.append("online", isOnline);
    if (editedImage.data) {
      formData.append("myfile", editedImage.data);
    }

    fetch(`${path}/users/edit`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "jwt expired") {
          verifyToken({ accessToken, setUser, path });
        }
        if (data.message) {
          setIsEdited("true");
          localStorage.setItem("user", data.user.username);
          localStorage.setItem("image", data.user.image);
          localStorage.setItem("about", data.user.about);
          localStorage.setItem("online", data.user.isOnline);
          setUser(data.user.username);
          setAbout(data.user.about);
          setImage(data.user.image);
          setOnline(data.user.isOnline);
          setEditProfileOpen(false);
          setError("");
        } else {
          setError(data.error);
        }
      });
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setEditedImage(img);
  };

  const closeEditProfile = (event) => {
    event.preventDefault();
    setEditProfileOpen(false);
    setEditedAbout(about);
    setUsername(user);
    setError("");
  };

  if (editProfileOpen) {
    return (
      <div
        className="modal"
        style={{ position: "absolute", width: "100vw", height: "100vh" }}
      >
        <div>
          <form
            style={{
              height: 350,
              borderWidth: 2,
              borderColor: "goldenrod",
              borderStyle: "solid",
            }}
            method="POST"
            onSubmit={handleEdit}
          >
            {error ? (
              <p style={{ color: "red", backgroundColor: "black", padding: 4 }}>
                {error} !{" "}
              </p>
            ) : (
              ""
            )}
            <label htmlFor="username">Change Username</label>
            <input
              placeholder="username"
              name="username"
              type="text"
              maxLength="20"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="about">Change About you</label>
            <textarea
              value={editedAbout}
              name="about"
              onChange={(e) => setEditedAbout(e.target.value)}
            ></textarea>
            <label htmlFor="myfile">Change Profile Image</label>
            <input
              type="file"
              accept="image/*"
              id="myfile"
              name="myfile"
              onChange={handleFileChange}
            />
            <label> Change Status</label>
            <select
              name="status"
              id="status"
              onChange={(e) => setIsOnline(e.target.value)}
            >
              <option value="true">Online</option>
              <option value="false">Offline</option>
            </select>
            <button type="submit">Submit Changes</button>
          </form>
          <button onClick={closeEditProfile}>Cancel</button>
        </div>
      </div>
    );
  } else {
    return;
  }
};
