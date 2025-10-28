// src/components/DashboardCard.jsx
import React from 'react';

// The icon prop is now expected to be a string (Unicode or text)
const DashboardCard = ({ title, value, icon, description }) => {
    return (
        <div className="stat-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                {/* Value */}
                <h3 className="stat-value">{value}</h3>
                
                {/* Icon: Render the string/Unicode character */}
                {icon && 
                    <span style={{fontSize: '1.5em', color: '#4CAF50'}}>{icon}</span>
                }
            </div>
            
            {/* Title and Description */}
            <p className="stat-title" style={{fontWeight: 500, marginTop: '5px'}}>{title}</p>
            <small className="stat-description" style={{color: '#777'}}>{description}</small>
        </div>
    );
};

export default DashboardCard;