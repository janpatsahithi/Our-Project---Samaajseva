// src/pages/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Use the Auth Hook

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  // State for form and view
  const [view, setView] = useState('role_select'); 
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setView('login');
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate(result.user.role === 'NGO' ? '/ngo-dashboard' : '/donor-dashboard');
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name) { setError('Name is required.'); return; }

    const result = await register(name, email, password, role);
    
    if (result.success) {
      navigate(result.user.role === 'NGO' ? '/ngo-dashboard' : '/donor-dashboard');
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  // --- Render Functions (Same structure, but with real logic calls) ---

  const renderRoleSelect = () => (
    <div className="auth-container">
      <h1 style={{fontSize: '2.5em', color: '#4CAF50'}}>SamaajSeva</h1>
      <p style={{marginBottom: '40px'}}>Empowering NGOs and Donors to Make a Difference Together</p>
      
      <div className="role-selection">
        <div className="role-card" style={{borderLeft: '5px solid #4CAF50'}}>
          <span style={{fontSize: '2.5em', color: '#4CAF50', display: 'block', marginBottom: '10px'}}>
            &#128221; 
          </span>
          <h3>NGO Login</h3>
          <p>Create and manage requests for your organization</p>
          <button 
            className="role-button primary-button"
            onClick={() => handleRoleSelect('NGO')}
          >
            Continue as Organization
          </button>
        </div>
        <div className="role-card" style={{borderLeft: '5px solid #FF9800'}}>
          <span style={{fontSize: '2.5em', color: '#FF9800', display: 'block', marginBottom: '10px'}}>
            &#129309; 
          </span>
          <h3>Donor Login</h3>
          <p>Discover and support NGO requests near you</p>
          <button 
            className="role-button primary-button"
            style={{backgroundColor: '#FF9800'}}
            onClick={() => handleRoleSelect('Donor')}
          >
            Continue as Supporter
          </button>
        </div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="auth-container">
      <h2>Login as {role}</h2>
      <p>Welcome back! Enter your credentials to continue.</p>
      <form onSubmit={handleLogin}>
        <input 
          className="auth-input" 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
        <input 
          className="auth-input" 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required />
          
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="primary-button" style={{width: '100%', marginTop: '10px'}}>Login</button>
      </form>
      <p style={{marginTop: '20px'}}>
        Don't have an account? <span onClick={() => {setView('signup'); setError('');}} className="toggle-link">Sign up</span>
        <br/>
        <span onClick={() => {setView('role_select'); setError('');}} className="toggle-link" style={{fontSize: '0.9em', marginTop: '10px', display: 'inline-block'}}>
            ← Change Role
        </span>
      </p>
    </div>
  );

  const renderSignup = () => (
    <div className="auth-container">
      <h2>Sign Up as {role}</h2>
      <p>Create your new account.</p>
      <form onSubmit={handleRegister}>
        <input 
          className="auth-input" 
          type="text" 
          placeholder="Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required />
        <input 
          className="auth-input" 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
        <input 
          className="auth-input" 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required />
          
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="primary-button" style={{width: '100%', marginTop: '10px'}}>Sign Up</button>
      </form>
      <p style={{marginTop: '20px'}}>
        Already have an account? <span onClick={() => {setView('login'); setError('');}} className="toggle-link">Login</span>
      </p>
    </div>
  );

  if (view === 'role_select') return renderRoleSelect();
  if (view === 'signup') return renderSignup();
  return renderLogin();
};

export default Auth;