import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://movie-booking-system-jzt2.onrender.com/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        alert("Invalid username or password");
        return;
      }

      const data = await res.json();

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      alert("Login successful");

      window.location.href = "/";

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div style={{
      height: "100vh",
      background: "linear-gradient(135deg, #0a0a0a, #1a1a1a)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <div style={{
        background: "#111",
        padding: "40px",
        borderRadius: "12px",
        width: "350px",
        boxShadow: "0 0 20px rgba(255,0,0,0.3)",
        textAlign: "center"
      }}>

        <h2 style={{ color: "white", marginBottom: "20px" }}>
          🎬 Login to ShowTime
        </h2>

        <form onSubmit={handleLogin}>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "none",
              background: "#222",
              color: "white"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "none",
              background: "#222",
              color: "white"
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s"
            }}
            onMouseEnter={e => e.target.style.background = "#ff3333"}
            onMouseLeave={e => e.target.style.background = "red"}
          >
            Login
          </button>

        </form>

        <p style={{ marginTop: "20px", color: "#ccc" }}>
          New user?{" "}
          <span
            style={{ color: "yellow", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>

      </div>
    </div>
  );
};

export default UserLogin;