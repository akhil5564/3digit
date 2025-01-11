// src/components/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import the useNavigate hook
import './login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();  // Initialize the navigate function

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the username and password are correct
    if (username === "manu" && password === "123") {
      console.log("Login successful!");
      // Store the login state in localStorage
    sessionStorage.setItem("isLoggedIn", "true");
      setError("");
      navigate("/home");  // Navigate to the Home page
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="textbox">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="textbox">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  )
};

export default Login;
