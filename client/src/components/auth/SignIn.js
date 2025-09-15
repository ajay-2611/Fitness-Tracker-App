import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import './Auth.css';

const SignIn = ({ onSignIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email, // Using email as username
          password: formData.password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Call onSignIn with the token
        onSignIn(data.token);
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="home-button">
        <FiHome className="home-icon" />
        <span>Home</span>
      </Link>
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to continue to your account</p>
          
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={{
                  padding: '12px 15px',
                  fontSize: '16px',
                  height: '48px',
                  width: '100%',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{
                  padding: '12px 15px',
                  fontSize: '16px',
                  height: '48px',
                  width: '100%',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" id="remember" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="auth-button primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="auth-footer">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign up now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;