import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginDoctor } from '../Utils/auth';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginDoctor(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="doctor-login-container">
      <div className="doctor-login-card">
        <div className="medical-symbol">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15c-2.76 0-5-2.24-5-5v-4.1l5-1.9 5 1.9V12c0 2.76-2.24 5-5 5zm1.65-2.65L13.5 14H16v-2h-2.5l.15-.85-1.8-1.8c.2-.23.15-.56-.1-.75-.23-.2-.56-.15-.75.1l-2 2c-.1.1-.15.25-.15.4 0 .26.21.5.5.5h2.29l-.14 1.35 1.8 1.8c-.2.23-.15.56.1.75.1.08.21.12.33.12.15 0 .3-.07.4-.2l2-2c.1-.1.15-.25.15-.4 0-.26-.21-.5-.5-.5h-2.29l.14-1.35z" />
          </svg>
        </div>
        <h2 className="doctor-login-title">Physician Portal</h2>
        <p className="doctor-login-subtitle">Secure access to patient records</p>
        
        <form onSubmit={handleLogin} className="doctor-login-form">
          <div className="input-group">
            <input
              type="email"
              required
              placeholder="Medical ID or Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="doctor-input"
            />
            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          
          <div className="input-group">
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="doctor-input"
            />
            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          </div>
          
          {error && <p className="login-error">{error}</p>}
          
          <button type="submit" className="doctor-login-button">
            <span className="button-text">Authenticate</span>
            <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
          </button>
        </form>
        
        <div className="login-footer">
          <a href="/forgot-password" className="footer-link">Forgot credentials?</a>
          <span className="footer-divider">|</span>
          <a href="/contact-admin" className="footer-link">Contact Hospital Admin</a>
        </div>
      </div>
    </div>
  );
}