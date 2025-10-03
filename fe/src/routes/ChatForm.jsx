import { Link, Navigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { verifyToken } from "./verifyToken";

export const ChatForm = ({ chatFormOpen, setChatFormOpen, chat, userInChat, messagesInChat, setMessagesInChat, user }) => {
  const [path, setPath] = useState('https://messaging-app-messaging-app-livee.up.railway.app');
  const [image, setImage] = useState({ preview: "", data: "" });
  const  [message, setMessage] = useState('');
  
   debugger
   const ref = useRef(null);
   
   
   useEffect(() => {     
    ref.current?.scrollIntoView({behavior: 'smooth'})
  }, [userInChat]);
  
  const closeChatForm = (e) => {
    e.preventDefault();
    setChatFormOpen(false);
    document.querySelector(".sidebar").style.display = "block";
    document.querySelector(".welcome").style.display = "flex";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target.id)
    const accessToken = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("accessToken", accessToken);
    formData.append("message", message);
    formData.append("chatId", e.target.id);
    if (image.data) {
      formData.append("myfile", image.data);
    }

    fetch(`${path}/chat/sendMessage`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setMessagesInChat(data)
          setMessage("");
        } 
        if(data.error === "cant send empty message"){
          return false
        }
        if(data.error === "this chat doesnt exist anymore because user removed you from friends"){
          setChatFormOpen(false)
          document.querySelector(".sidebar").style.display = "block";
          document.querySelector(".welcome").style.display = "flex";
          alert("this chat doesnt exist anymore because user removed you from friends")
        }
      });
     
      document.querySelector(".send-image").value = ''
      setImage({ preview: "", data: "" })
      setTimeout(() => {
        ref.current?.scrollIntoView({behavior: 'smooth'})
      }, 1000);
  };

  const zoomInProfile = (e) => {
    debugger
    if (e.target.className === "chatProfileImage") {
   document
        .getElementById(e.target.id)
        .classList.add("zoomed");
      
    } else {
      document
        .getElementById(e.target.id)
        .classList.remove("zoomed");
    }
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  };


  if (chatFormOpen) {
    return (
      <div className="chat-form">
        <div> <img onClick={closeChatForm} src="/left-arrow.png" alt="" />
           <ul>           
            {userInChat.isOnline === "true" ? (
              <img
                id={userInChat.id}
                className="profileImage"
                src={`${path}/images/${userInChat.image}`}
                alt=""
                style={{
                  borderWidth: 4,
                  borderColor: "green",
                  borderStyle: "solid",
                }}
              />
            ) : (
              <img
                id={userInChat.id}
                className="profileImage"
                src={`${path}/images/${userInChat.image}`}
                alt=""
                style={{
                  borderWidth: 4,
                  borderColor: "red",
                  borderStyle: "solid",
                }}
              />
            )}
           <h4>{userInChat.username}</h4>
           </ul>
        </div>

        <ul  className="displayForMessages">
          {messagesInChat !== undefined && 
          messagesInChat.map((message) => (
            message.username === user ? (
              <div key={message.id} style={{
                display: "flex",
                justifyContent: "flex-start",
               border: "none",
               background: "none",
               width: "90%",
               marginTop: "10px"
              }}>
               {message.image ? 
                <li ref={ref}  key={message.id}>
                <strong>{message.username}</strong>  <br />
               
               {message.message} <br />
               <img   onClick={zoomInProfile} id={message.id} className="chatProfileImage"  src={`${path}/images/${message.image}`} alt="" />
               <span>{message.date}</span>
              </li>
              : <li  ref={ref}  key={message.id}>
              <strong>{message.username}</strong>  <br />
             
             {message.message} <br />
             <span>{message.date}</span>
            </li>
              }
             
            </div>
           ) : 
           <div key={message.id} style={{
            display: "flex",
            justifyContent: "flex-end",
            border: "none",
            background: "none",
             width: "90%",
             marginTop: "10px"
          }}>
             {message.image ? 
                <li ref={ref}   key={message.id}>
                <strong>{message.username}</strong>  <br />
               
               {message.message} <br />
               <img  onClick={zoomInProfile} id={message.id}  className="chatProfileImage"   src={`${path}/images/${message.image}`} alt="" />
               <span>{message.date}</span>
              </li>
              : <li ref={ref}   key={message.id}>
              <strong>{message.username}</strong>  <br />
             
             {message.message} <br />
             <span>{message.date}</span>
            </li>
              }
            </div>
          ))
          }
        </ul>
       
        <form id={chat.chatId} className="chatForm" method="POST" onSubmit={handleSubmit}>
          <input
            className="send-image"
            type="file"
            accept="image/*"
            id="myfile"
            name="myfile" 
            onChange={handleFileChange}
          />
          <textarea onChange={(e) => setMessage(e.target.value)} className="chat" value={message} name="chat" id="chat"></textarea>
          <button
                   type="submit"
                    id={chat.chatId}
                    className="icon"
                   
                  >
                  </button>
        </form>
      </div>
    );
  } else {
    return;
  }
};
