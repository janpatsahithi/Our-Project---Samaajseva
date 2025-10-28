import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// API base URL (proxied via Vite to Node server at http://localhost:4000)
const API_BASE_URL = '/api';


export const AuthProvider = ({ children }) => {
    // Attempt to load user from localStorage for mock session persistence
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('samaajseva_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoggedIn, setIsLoggedIn] = useState(!!user);

    // --- Database Login Function ---
    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                setIsLoggedIn(true);
                localStorage.setItem('samaajseva_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message || 'Login failed.' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please check if the backend server is running.' };
        }
    };

    // --- Database Register Function ---
    const register = async (name, email, password, role) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                setIsLoggedIn(true);
                localStorage.setItem('samaajseva_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message || 'Registration failed.' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error. Please check if the backend server is running.' };
        }
    };

    // --- Logout Function ---
    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('samaajseva_user');
    };

    const value = {
        user,
        isLoggedIn,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
