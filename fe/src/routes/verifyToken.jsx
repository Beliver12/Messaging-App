import { useState, useEffect } from "react"; 

export const verifyToken = ({ token, setUser, setAddFriendsOpen }) => {
   const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app')
  const data = {
    accessToken: token,
  };
  const url = `${path}/users/verifyToken`;
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
        alert("Your Token is expired pls log-in again");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("image");
        localStorage.removeItem("about");
        setUser("");
      }
    });
};
