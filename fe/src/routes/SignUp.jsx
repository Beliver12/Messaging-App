import { Link, Navigate} from "react-router";
import { useState } from "react";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");
  const [isSignedIn, setIsSignedIn] = useState("");
  const  [image, setImage] = useState({preview: '', data: ''})

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("password2", password2);
    formData.append("email", email);
    formData.append("about", about);
  
    if (image.data) {
      formData.append("myfile", image.data); 
    }
  
    fetch("https://messaging-app-messaging-app-livee.up.railway.app/users/signup", {
      method: "POST",
      body: formData, 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setIsSignedIn("true");
        } else {
          setError(data.error);
        }
      });
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
  }

  if (isSignedIn) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <h1>Messaging App</h1>
      <Link to="/">Home</Link>
      <img src="/smartphone.png" alt="" />
      <div className="signup">
        <form onSubmit={handleSubmit} method="POST" >
          <h2>Sign Up</h2>
          {error? <p  style={{ color: 'red', backgroundColor: 'black', padding: 4}}>{error } ! </p> : ''}
          <label htmlFor="email">E-mail </label>
         
          <input
            placeholder="email"
            name="email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          
          <input
            placeholder="password"
            name="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            placeholder="confirm-password"
            name="confirm-password"
            type="password"
            required
            onChange={(e) => setPassword2(e.target.value)}
          />
          <label htmlFor="username">Username</label>
          <input
            placeholder="username"
            name="username"
            type="text"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="about">About you</label>
          <textarea
            name="about"
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
          <label htmlFor="myfile">Upload a profile image:</label>
          <input type="file" accept="image/*" id="myfile" name="myfile" onChange={handleFileChange}/>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
};
