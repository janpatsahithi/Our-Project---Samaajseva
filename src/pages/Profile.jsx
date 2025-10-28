// src/pages/Profile.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth
import mockUsers from '../data/users.json'; // Import your full user profile data

const Profile = () => {
  // 1. Get the authenticated user object from the global state
  const { user, isLoggedIn } = useAuth(); 

  // Since App.jsx uses ProtectedRoute, user should always be valid here, 
  // but we keep the check for safety.
  if (!user || !isLoggedIn) {
    return (
        <div className="container" style={{padding: '50px', textAlign: 'center'}}>
            Error: Please log in to view your profile.
        </div>
    );
  }
  
  // 2. Find the full personalized profile using the ID from the Auth Context
  // (In a real app, 'user' would already be the full profile, but this simulates API lookup)
  const profile = mockUsers.find(p => p.id === user.id); 

  if (!profile) {
    return (
        <div className="container" style={{padding: '50px', textAlign: 'center'}}>
            Profile data not found for user ID: {user.id}
        </div>
    );
  }

  return (
    <div className="container profile-page-layout">
      
      {/* Profile Header Card - Displaying personalized data */}
      <div className="profile-header-card">
        <h1 className="profile-name">{profile.name}</h1>
        <p className="profile-role">Role: {profile.role}</p>
        <p className="profile-bio">{profile.bio}</p>
        <p className="profile-email" style={{fontSize: '0.9em', color: 'var(--text-light)'}}>
            Contact: {profile.email}
        </p>
      </div>

      {/* CIS and Badges Section - Displaying personalized data */}
      <div className="profile-stats-grid">
        
        {/* Community Impact Score (CIS) */}
        <div className="stat-card cis-card">
          <p className="stat-label">Community Impact Score</p>
          {/* Dynamically display the CIS */}
          <p className="stat-value">{profile.cis}</p>
          <p className="stat-detail">Higher score = Greater Trust & Impact</p>
        </div>

        {/* Current Badge */}
        <div className="stat-card badge-card">
          <p className="stat-label">Top Trust Badge</p>
          <div className="badge-display">
             <span className="badge-icon">🏅</span> 
             {/* Dynamically display the badge */}
             <span className="badge-name">{profile.current_badge}</span>
          </div>
          <p className="stat-detail">Achieved for consistent fulfillment</p>
        </div>
      </div>
      
      {/* Full Badge Collection */}
      <div className="full-badges-section">
        <h2>Full Badge Collection</h2>
        <div className="badges-list">
          {profile.badges.map((badge, index) => (
            <div key={index} className="badge-item">
                <span className="badge-icon-small">⭐</span>
                <span className="badge-item-name">{badge}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;
