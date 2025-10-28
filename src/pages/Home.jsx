// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page-layout container text-center">
      
      {/* 1. Full-Screen Hero Area - Uses the background image class */}
      <div className="hero-background"> 
        
        {/* New Flex Container for Content + Image */}
        <div className="hero-content-grid"> 
          
          <div className="hero-text-content">
            {/* TEXT COLORS CHANGED TO WHITE FOR READABILITY AGAINST DARK BACKGROUND */}
            <h1 style={{fontSize: '5em', color: 'white', marginBottom: '30px', fontWeight: 800, textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
              SamaajSeva
            </h1>
            <h2 style={{fontSize: '2em', color: 'white', maxWidth: '800px', margin: '0 auto', marginBottom: '20px', textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>
              The Web Platform to Bridge NGOs and Community Donors
            </h2>
            <p style={{fontSize: '1.2em', color: '#f0f0f0', fontStyle: 'italic', textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>
              Connecting needs with resources, efficiently and transparently.
            </p>

            {/* Call to Action Button */}
            <button 
              className="primary-button" 
              style={{marginTop: '40px', padding: '18px 50px', fontSize: '1.2em', boxShadow: '0 4px 10px rgba(56, 142, 60, 0.4)'}}
              onClick={() => navigate('/auth')}
            >
              Get Started Today
            </button>
          </div>
          
          {/* Image Placeholder container (kept for centering) */}
          <div className="hero-image-container">
            {/* Image element removed, relying on background image */}
          </div>

        </div> {/* End hero-content-grid */}
      </div> {/* End hero-background */}

      {/* --- 2. Secondary Content Section --- */}
      {/* This wraps the rest of the page content */}
      <div className="secondary-content"> 
        <h2 style={{fontSize: '2.5em', color: 'var(--primary-color)', marginBottom: '50px', fontWeight: 700, textAlign: 'center'}}>
          Why SamaajSeva?
        </h2>
        
        {/* Feature Cards Section */}
        <div className="features-section" style={{marginBottom: '80px'}}>
            
            {/* Feature 1: Visibility for NGOs */}
            <div className="feature-card">
                <span className="icon">📝</span>
                <h3 style={{fontSize: '1.4em', fontWeight: 600, color: 'var(--text-color)', marginTop: '10px'}}>Visibility for NGOs</h3>
                <p style={{marginTop: '10px', color: 'var(--text-light)'}}>
                  List your urgent resource and volunteer needs to a wider network of donors.
                </p>
            </div>

            {/* Feature 2: Verified Contributions */}
            <div className="feature-card">
                <span className="icon">🤝</span>
                <h3 style={{fontSize: '1.4em', fontWeight: 600, color: 'var(--text-color)', marginTop: '10px'}}>Verified Contributions</h3>
                <p style={{marginTop: '10px', color: 'var(--text-light)'}}>
                  Donors find trustworthy causes and track their commitments to ensure fulfillment.
                </p>
            </div>

            {/* Feature 3: Future AI Insights */}
            <div className="feature-card">
                <span className="icon">💡</span>
                <h3 style={{fontSize: '1.4em', fontWeight: 600, color: 'var(--text-color)', marginTop: '10px'}}>Future AI Insights</h3>
                <p style={{marginTop: '10px', color: 'var(--text-light)'}}>
                  Ready for integration with ML models for seasonal prediction and urgency prioritization.
                </p>
            </div>
        </div>
      
        {/* --- 3. Testimonial Section --- */}
        <div className="testimonial-section">
            <div className="testimonial-card">
                <p className="quote-text">
                    "SamaajSeva transformed our donation drive. The transparency and efficiency meant we got the right resources to the right people, faster than ever before."
                </p>
                <p className="quote-author">- Priya Sharma, Director, Hope Foundation</p>
            </div>
        </div>

        {/* --- 4. How It Works Section --- */}
        <div className="how-it-works-section">
            <h2 className="how-it-works-header">
                The 3-Step Journey to Service
            </h2>
            <div className="steps-grid">
                {/* Step 1 */}
                <div className="step-card">
                    <div className="step-icon">1️⃣</div>
                    <h3 className="step-title">NGO Posts Need</h3>
                    <p className="step-description">A verified NGO lists their immediate needs for goods, funds, or volunteer hours.</p>
                </div>

                {/* Step 2 */}
                <div className="step-arrow">⟶</div>

                {/* Step 3 */}
                <div className="step-card">
                    <div className="step-icon">2️⃣</div>
                    <h3 className="step-title">Donor Commits</h3>
                    <p className="step-description">Community members browse requests and commit to fulfilling a specific need.</p>
                </div>

                {/* Step 4 */}
                <div className="step-arrow">⟶</div>

                {/* Step 5 */}
                <div className="step-card">
                    <div className="step-icon">3️⃣</div>
                    <h3 className="step-title">Impact Verified</h3>
                    <p className="step-description">The NGO confirms delivery, providing closure and building trust with the donor.</p>
                </div>
            </div>
        </div>

        <footer>Empowering communities through connection.</footer>
      </div>

    </div>
  );
};

export default Home;
