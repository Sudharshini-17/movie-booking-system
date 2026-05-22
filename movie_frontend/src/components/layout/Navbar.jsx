import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={{ padding:"10px", background:"#111", color:"white", display:"flex", justifyContent:"space-between" }}>
      <Link to="/">🎬 ShowTime</Link>

      <div>
        {token && (
          <button onClick={() => navigate("/my-bookings")}>
            My Bookings
          </button>
        )}

        {!token ? (
          <button onClick={() => navigate("/login")}>Login</button>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;