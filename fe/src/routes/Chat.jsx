import { Link, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { verifyToken } from "./verifyToken";

export const Chat = ({ chatOpen, setChatOpen, usersInChat }) => {
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app')
debugger
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
                    </li>
                ))
                }
            </ul>
        </div>
      </div>
    );
  } else {
    return ;
  }
};
