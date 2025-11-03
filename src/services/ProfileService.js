// src/services/ProfileService.js

// Use Vite proxy to backend on http://localhost:4000
const API_BASE_URL = '/api'; 

/**
 * Fetches the complete profile data (including new bio, skills, etc.) for the user.
 */
export const fetchFullProfile = async (userId) => {
    try {
        // NOTE: In a real app, include Authorization header (JWT token) here
        const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
        const data = await response.json();

        if (response.ok && data.success) {
            return { success: true, profile: data };
        } else {
            return { success: false, message: data.message || 'Failed to fetch profile.' };
        }
    } catch (error) {
        console.error('Network error during profile fetch:', error);
        return { success: false, message: 'Network error. Check if the backend is running.' };
    }
};

/**
 * Sends the Q&A form data to the backend to update the USERS table.
 */
export const updateProfileData = async (userId, profileData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Include Authorization header (JWT token)
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Failed to update profile.' };
        }
    } catch (error) {
        console.error('Network error during profile update:', error);
        return { success: false, message: 'Network error. Could not connect to the server.' };
    }
};


// --- Functions to fetch Role-Specific Activity Data ---

/**
 * Fetches volunteer metrics (total hours, upcoming projects) from the DB.
 */
export const fetchVolunteerMetrics = async (userId) => {
    try {
        // This endpoint requires JOINs on USERS, VOLUNTEER_APPLICATIONS, and PROJECTS tables
        const response = await fetch(`${API_BASE_URL}/dashboard/volunteer/${userId}`);
        const data = await response.json();

        if (response.ok && data.success) {
            return { success: true, metrics: data.metrics };
        } else {
            return { success: false, message: data.message || 'Failed to fetch volunteer data.' };
        }
    } catch (error) {
        return { success: false, message: 'Network error.' };
    }
};

/**
 * Fetches NGO/Organizer metrics (campaigns, volunteer counts, funds raised) from the DB.
 */
export const fetchNGOMetrics = async (userId) => {
    try {
        // This endpoint requires data from PROJECTS and DONATIONS tables
        const response = await fetch(`${API_BASE_URL}/dashboard/ngo/${userId}`);
        const data = await response.json();

        if (response.ok && data.success) {
            return { success: true, metrics: data.metrics };
        } else {
            return { success: false, message: data.message || 'Failed to fetch NGO data.' };
        }
    } catch (error) {
        return { success: false, message: 'Network error.' };
    }
};