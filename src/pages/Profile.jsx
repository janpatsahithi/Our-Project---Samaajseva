// src/pages/Profile.jsx
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
    </div>
  );
};

export default Profile;
