import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NeedsProvider } from './context/NeedsContext.jsx'; 
import ChatPopup from './components/Chatpopup.jsx';

import Navbar from './components/Navbar.jsx'; 
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Auth from './pages/Auth.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import NGODashboard from './pages/NGODashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import Profile from './pages/Profile.jsx'; // <--- NEW IMPORT for Profile Page

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  // If the user is logged in, but their role is not allowed, redirect to home
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Navbar />
      {/* We are using 'main' here instead of 'div' for better semantic HTML */}
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* 1. NEW ROUTE: Profile Page */}
          {/* We'll make the profile page accessible to all logged-in users */}
          <Route 
            path="/profile" 
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } 
          />
          
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['Donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo-dashboard"
            element={
              <ProtectedRoute allowedRoles={['NGO']}>
                <NGODashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Chat Popup Logic */}
      {!chatOpen && (
        <div
          className="chat-fab-open"
          onClick={() => setChatOpen(true)}
          title="Chat with support"
        >
          <span role="img" aria-label="chat">&#128172;</span>
        </div>
      )}
      {chatOpen && (
        <ChatPopup onClose={() => setChatOpen(false)} />
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NeedsProvider> 
          <AppContent />
        </NeedsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;