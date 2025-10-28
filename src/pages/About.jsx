// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About SamaajSeva</h1>
       
      </div>
      
      <div className="mission-card">
        <h2>Our Mission</h2>
        <p>
          SamaajSeva is a platform designed to bridge the gap between communities in need and non-governmental organizations (NGOs) that can help. We understand that effective communication and resource allocation are crucial for social impact.
        </p>
        <p style={{marginTop: '10px'}}>
          Our **AI-powered urgency prediction system** helps NGOs prioritize requests, ensuring that critical needs are addressed promptly. The integrated chat system facilitates seamless communication between users and organizations.
        </p>
        <p style={{marginTop: '10px'}}>
          We believe in empowering communities by making it easier for them to connect with the resources they need, when they need them.
        </p>
      </div>

      <h2 className="text-center" style={{color: '#4CAF50'}}>How We Help</h2>
      <div className="features-section">
        <div className="feature-card" style={{borderTopColor: '#4CAF50'}}>
            <span className="icon" style={{color: '#4CAF50', background: '#e8f5e9'}}>&#128221;</span>
            <h3>Community Requests</h3>
            <p>Submit and track requests from your community with ease. Stay updated on progress and completion.</p>
        </div>
        <div className="feature-card" style={{borderTopColor: '#FF9800'}}>
            <span className="icon" style={{color: '#FF9800', background: '#fff8e1'}}>&#128200;</span>
            <h3>Smart Prediction</h3>
            <p>AI-powered urgency prediction helps prioritize requests and allocate resources efficiently.</p>
        </div>
        <div className="feature-card" style={{borderTopColor: '#f48fb1'}}>
            <span className="icon" style={{color: '#f48fb1', background: '#fce4ec'}}>&#128488;</span>
            <h3>Seamless Communication</h3>
            <p>Built-in chat system keeps NGOs and communities connected in real-time.</p>
        </div>
      </div>

      <footer>Empowering communities through connection.</footer>
    </div>
  );
};

export default About;