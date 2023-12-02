import React, { useState } from "react";
import "./index.css";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(true);
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    if (username != "" && password != "") {
      if (password.length < 8) {
        toast("Password should be of at least 8 characters");
        return;
      }
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        body: JSON.stringify({
          username,
          password,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);

      if (res.status == 200) {
        toast("Logged in successfully");
        localStorage.setItem("jwt_token", JSON.stringify(data.data));
        navigate("/");
      } else if (res.status == 401) {
        toast("Invalid credentials");
      }
    } else {
      toast("Please fill all the field");
    }
  };
  return (
    <div className="login-container">
      <h1 className="loging-header">Venue Admin Login</h1>
      <form onSubmit={onSubmit} className="login-form">
        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          type="text"
          className="input-container"
          placeholder="Username"
        />
        <div className="password-container">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={visibility ? "password" : "text"}
            placeholder="Password"
            className="password-input"
          />
          {visibility ? (
            <MdVisibility onClick={() => setVisibility(!visibility)} />
          ) : (
            <MdVisibilityOff onClick={() => setVisibility(!visibility)} />
          )}
        </div>
        <button type="submit" className="save-button">
          Sign In
        </button>
      </form>
      <a>New Registration?</a>
    </div>
  );
};

export default Login;
