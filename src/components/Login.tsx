import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Disable scrolling on body when login page is rendered
    document.body.style.overflow = "hidden";

    // Check if user is already logged in
    if (sessionStorage.getItem("isLoggedIn") === "true") {
      navigate("/home");  // Redirect to Home page if already logged in
    }

    // Clean up to enable scrolling again when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple form validation
    if (!username || !password) {
      setError("Both username and password are required.");
      return;
    }

    setError("");  // Clear any previous error message
    setIsLoading(true);  // Show loading indicator

    // Simulate a network request for login (replace with actual API in real-world app)
    setTimeout(() => {
      if (username === "manu" && password === "123") {
        console.log("Login successful!");
        sessionStorage.setItem("isLoggedIn", "true");
        setIsLoading(false);
        navigate("/home");  // Navigate to the Home page
      } else {
        setIsLoading(false);
        setError("Invalid username or password.");
      }
    }, 1000); // Simulating network delay (1 second)
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="textbox">
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="textbox">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
