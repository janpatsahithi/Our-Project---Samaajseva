// src/components/NeedCard.jsx
import React from 'react';

const NeedCard = ({ need }) => {
  const { title, category, description, location, quantityNeeded, quantityCommitted, status } = need;
  const progress = Math.round((quantityCommitted / quantityNeeded) * 100);

  const getStatusClass = (currentStatus) => {
      if (currentStatus === 'fulfilled') return 'status-fulfilled';
      if (progress >= 75) return 'status-high';
      return 'status-pending';
  };

  return (
    <div className={`card need-card ${getStatusClass(status)}`}>
      <h3>{title}</h3>
      <p className="meta-info">
        <b>Category:</b> {category} | <b>Location:</b> {location}
      </p>
      <p>{description.substring(0, 100)}...</p>
      
      <div className="progress-bar-container">
          <div className="progress-bar-text">
              <b>Progress:</b> {quantityCommitted} of {quantityNeeded}
          </div>
          <div className="progress-bar">
              <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}>
              </div>
          </div>
          <span className={`status-tag ${getStatusClass(status)}`}>{status.toUpperCase()}</span>
      </div>

      <button className="primary-button">View Details / Commit</button>
    </div>
  );
};

export default NeedCard;