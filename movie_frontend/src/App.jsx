import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import UserLogin from './pages/UserLogin';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';

import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  const token = localStorage.getItem("access");

  return (
    <Router>

      <Navbar />

      <Routes>

        {/* AUTH */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED HOME */}
        <Route path="/" element={token ? <Home /> : <UserLogin />} />

        {/* FLOW */}
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movie/:id/book" element={<SeatSelection />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/booking/:bookingId" element={<BookingConfirmation />} />

        {/* BOOKINGS */}
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>

      <Footer />

    </Router>
  );
}

export default App;