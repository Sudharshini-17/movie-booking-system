import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: ""
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("https://movie-booking-system-jzt2.onrender.com/api/auth/register/", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password
      })
    });

    if (res.ok) {
      alert("Registered!");
      navigate("/login");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ color:"white", padding:"40px" }}>
      <h2>Register</h2>

      <input placeholder="Username" onChange={e => setForm({...form, username:e.target.value})}/>
      <br/><br/>

      <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})}/>
      <br/><br/>

      <input type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})}/>
      <br/><br/>

      <input type="password" placeholder="Confirm Password" onChange={e => setForm({...form, confirm:e.target.value})}/>
      <br/><br/>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;