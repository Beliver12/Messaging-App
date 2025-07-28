import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Link } from "react-router";

import "./App.css";

const LogInForm = ({ user, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const profileImage = localStorage.getItem('image')
  const aboutUser = localStorage.getItem('about')
  const [image, setImage] = useState(profileImage)
  const [about, setAbout] = useState(aboutUser)
  const [error, setError] = useState('');

  const logOut = (event) => {
    event.preventDefault();
    localStorage.removeItem
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('image');
    localStorage.removeItem('about');
    setUser('')
  }
   
  const logIn = async (event) => {
    event.preventDefault();
    const data = {
       password: password,
       email: email
    }

    const url = 'https://messaging-app-messaging-app-livee.up.railway.app//users/login';

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
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('user', data.user.username);
        localStorage.setItem('image', data.user.image);
        localStorage.setItem('about', data.user.about)
        setUser(data.user.username)
        setImage(data.user.image)
        setAbout(data.user.about)
      } else {
        setError(data.error);
      }
    })
  }

  if (!user) {
    return (
      <div className="homepage">
        <form method="POST" onSubmit={logIn}>
          <h2>Log In</h2>
          {error? <p style={{ color: 'red', backgroundColor: 'black', padding: 4}}>{error}!</p> : ''}
          <label htmlFor="email">E-mail</label>
          <input type="email" name="email"  onChange={(e) => setEmail(e.target.value)}/>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">Log In</button>
          <p>Dont have account?</p>
          <Link to="signup">Sign Up</Link>
        </form>
      </div>
    );
  }
  return (
    <div
      className="homepage"
      style={{ backgroundColor: "black", background: "none" }}
    >
      <img className="profileImage" src={`https://messaging-app-messaging-app-livee.up.railway.app/images/${image}`} alt="" />
      <h1>Loged in! {user}</h1> 
      <p>{about}</p>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};

export const App = () => {
  const userr = localStorage.getItem("user");
  debugger
  const [user, setUser] = useState(userr);

  return (
    <>
      <h1>Messaging App</h1>
      <img src="/smartphone.png" alt="" />
      <LogInForm user={user} setUser={setUser} />

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
    </>
  );
};
