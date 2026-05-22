import UserLogin from "./pages/login";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ Login failed");
        console.log(data);
        return;
      }

      // ✅ STORE REAL TOKEN
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      alert("✅ Login success");

      navigate("/");

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ color: "white", padding: "50px" }}>
      <h2>User Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default UserLogin;