import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Disable scrolling on body when login page is rendered
    document.body.style.overflow = "hidden";

    // Clean up to enable scrolling again when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the username and password are correct
    if (username === "manu" && password === "123") {
      console.log("Login successful!");
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
