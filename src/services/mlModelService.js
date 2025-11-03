// src/services/mlModelService.js

// CRITICAL: URL points to your Flask backend's /predict endpoint on port 5000
const API_URL = 'http://127.0.0.1:5000/predict'; 

/**
 * Calls the Flask ML backend API to get an urgency prediction for a new request.
 * @param {object} requestData - The full data object from the NGO form (newRequest state).
 * @returns {Promise<object>} The prediction result (urgency, confidence).
 */
const predictUrgency = async (requestData) => {
    // The data sent to Flask must match the keys it expects (e.g., peopleAffected, resourceType)
    const payload = {
        state: requestData.state,
        peopleAffected: requestData.peopleAffected,
        domain: requestData.domain,
        resourceType: requestData.resourceType, 
        urgencyReason: requestData.urgencyReason,
        timeline: requestData.timeline
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            // Throw error if HTTP status is not 2xx (e.g., 400 or 500)
            throw new Error(`ML API returned status ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'success' && result.urgency) {
            // Return the necessary prediction fields used by NGODashboard.jsx
            return {
                urgency: result.urgency, // e.g., 'HIGH'
                confidence: result.confidence,
                predictionMethod: 'Flask ML Model',
                backendUsed: true,
            };
        } else {
            // If Flask returns success but data structure is wrong
            throw new Error(result.error || "Invalid prediction response structure.");
        }
        
    } catch (error) {
        console.error("ML Service Error:", error);
        
        // Fallback for when the Python server is down or returns an error
        return {
            urgency: 'PENDING', // Default to PENDING if ML fails
            confidence: 0,
            predictionMethod: 'FrontendFallback',
            backendUsed: false,
        };
    }
};

export default {
    predictUrgency,
};
