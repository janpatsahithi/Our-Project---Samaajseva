// src/pages/Profile.jsx
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchFullProfile, updateProfileData } from '../services/ProfileService';
import '../styles/profile.css';

// ---------------------------------------------
// Form Component
// ---------------------------------------------
const ProfileQAForm = ({ currentProfile, onSave }) => {
  const [formData, setFormData] = useState({
    bio: currentProfile.bio || '',
    city: currentProfile.city || '',
    phone: currentProfile.phone || '',
    languages: currentProfile.languages ? currentProfile.languages.join(', ') : '',
    skills: currentProfile.skills ? currentProfile.skills.join(', ') : '',
    interests: currentProfile.interests ? currentProfile.interests.join(', ') : '',
    availability: currentProfile.availability || '',
    experience: currentProfile.experience || '',
    linkedin: currentProfile.linkedin || '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSave = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
      languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
    };

    onSave(dataToSave);
  };

  return (
    <div className="qa-form-container">
      <h3>Update Your Samaajseva Profile</h3>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <h4 className="section-title">Basic Information</h4>
        <label>Bio:</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself and your journey..."
          required
        />

        <label>City / Region:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g., Hyderabad"
          required
        />

        <label>Phone / WhatsApp (optional):</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 9876543210"
        />

        <label>Languages (comma-separated):</label>
        <input
          type="text"
          name="languages"
          value={formData.languages}
          onChange={handleChange}
          placeholder="English, Hindi, Telugu"
        />

        {/* Skills & Interests */}
        <h4 className="section-title">Skills & Causes</h4>
        <label>Skills (comma-separated):</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Teaching, Organizing, Fundraising"
        />

        <label>Interests / Causes:</label>
        <input
          type="text"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          placeholder="Environment, Education, Health"
        />

        {/* Volunteering Details */}
        <h4 className="section-title">Volunteering Details</h4>
        <label>Availability (hours/week):</label>
        <input
          type="number"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          placeholder="5"
        />

        <label>Past Volunteering Experience:</label>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Share your volunteering journey or notable contributions"
        />

        {/* Social Links */}
        <h4 className="section-title">Social Links</h4>
        <label>LinkedIn Profile (optional):</label>
        <input
          type="url"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/yourname"
        />

        <button type="submit" className="btn btn-primary">Save Profile Details</button>
      </form>
    </div>
  );
};

// ---------------------------------------------
// Profile Page Component
// ---------------------------------------------
const Profile = () => {
  const { user, isLoggedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setIsLoading(true);

      const result = await fetchFullProfile(user.id);
      if (result.success) {
        setProfile(result.profile);
        if (!result.profile.bio || !result.profile.city) {
          setIsEditing(true);
        }
      } else {
        setError(result.message);
      }

      setIsLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSaveDetails = async (formData) => {
    setIsLoading(true);
    const result = await updateProfileData(user.id, formData);

    if (result.success) {
      setProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  if (!isLoggedIn || !user) return <p>Please log in.</p>;
  if (isLoading) return <div className="container" style={{ padding: '50px' }}>Loading Profile...</div>;
  if (error) return <div className="container" style={{ padding: '50px', color: 'red' }}>Error: {error}</div>;
  if (!profile) return <div className="container" style={{ padding: '50px' }}>Profile data unavailable.</div>;

  return (
    <div className="container profile-page-layout">
      {/* Header */}
      <header className="profile-header-card">
        <h1 className="profile-name">{profile.name || 'User'}'s Profile</h1>
        <p className="profile-role">Role: {profile.role || 'Member'}</p>
      </header>

      {/* Edit Button */}
      <button
        className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
        onClick={() => setIsEditing(!isEditing)}
        style={{ marginBottom: '20px' }}
      >
        {isEditing ? 'Cancel Edit' : 'Edit Details'}
      </button>

      {isEditing ? (
        <ProfileQAForm currentProfile={profile} onSave={handleSaveDetails} />
      ) : (
        <>
          <section className="personal-details-display" style={{ marginBottom: '20px' }}>
            <h2>Personal Details</h2>
            <p><strong>Bio:</strong> {profile.bio || "No bio added yet."}</p>
            <p><strong>City:</strong> {profile.city || "N/A"}</p>
            <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
            <p><strong>Languages:</strong> {(profile.languages && profile.languages.join(', ')) || "N/A"}</p>

            <h3>Skills & Causes</h3>
            <p><strong>Skills:</strong> {(profile.skills && profile.skills.join(', ')) || "N/A"}</p>
            <p><strong>Interests:</strong> {(profile.interests && profile.interests.join(', ')) || "N/A"}</p>

            <h3>Volunteering</h3>
            <p><strong>Availability:</strong> {profile.availability ? `${profile.availability} hrs/week` : "N/A"}</p>
            <p><strong>Experience:</strong> {profile.experience || "N/A"}</p>

            <h3>Social</h3>
            {profile.linkedin ? (
              <p><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn Profile</a></p>
            ) : (
              <p>No LinkedIn linked.</p>
            )}

            <h3>Account Info</h3>
            <p><strong>Email:</strong> {profile.email}</p>
            {profile.current_badge && <p><strong>Badge:</strong> {profile.current_badge}</p>}
          </section>
        </>
      )}
=======
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

>>>>>>> 478495b01bc8df75b4d600baa735740b0747ed5a
    </div>
  );
};

export default Profile;
