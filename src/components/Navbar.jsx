// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Use the Auth Hook

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth(); // Destructure auth state and functions

  const dashboardPath = user?.role === 'NGO' ? '/ngo-dashboard' : '/donor-dashboard';

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  // Determine which link is active
  const isActive = (path) => location.pathname === path;
  const isDashboardActive = location.pathname.includes('dashboard');
  const isProfileActive = location.pathname === '/profile'; // <-- NEW: Check if Profile is active
  

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">SamaajSeva</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
            Home
        </Link>
        <Link to="/about" className={isActive('/about') ? 'active' : ''}>
            About
        </Link>
        
        
        {isLoggedIn ? (
          <>
            {/* 1. NEW LINK: Profile Page */}
            <Link to="/profile" className={isProfileActive ? 'active' : ''}>
                Profile
            </Link>

            {/* Logged in view: Show Dashboard Link */}
            <Link to={dashboardPath} className={isDashboardActive ? 'active' : ''}>
                Dashboard
            </Link>
            <a href="#" onClick={handleLogout} className="logout-link">
                Logout
            </a>
          </>
        ) : (
          // Logged out view: Show Login/Register Link
          <Link to="/auth" className={isActive('/auth') ? 'active' : ''}>
            Login/Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;