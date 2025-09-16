import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import './Auth.css';

const SignUp = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

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
    setSuccess('');
    setShowTermsError(false);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      setShowTermsError(true);
      return;
    }
    
    setIsLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const requestUrl = `${apiUrl}/api/auth/signup`;
      const requestBody = {
        name: formData.name,
        username: formData.email, // Using email as username to match backend
        email: formData.email,
        password: formData.password
      };
      
      console.log('Sending signup request to:', requestUrl);
      console.log('Request body:', requestBody);
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to sign in...');
        setError('');
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          if (onSignUp) onSignUp();
          navigate('/signin');
        }, 2000);
      } else {
        setError(data.error || 'An error occurred during signup');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Sign up error:', err);
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
          <h2>Create an Account</h2>
          <p className="auth-subtitle">Join us to get started on your fitness journey</p>
          
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <span>{success}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="form-input"
                  style={{
                    padding: '15px',
                    fontSize: '16px',
                    minHeight: '50px',
                    width: '100%'
                  }}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                  style={{
                    padding: '15px',
                    fontSize: '16px',
                    minHeight: '50px',
                    width: '100%'
                  }}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 characters)"
                  required
                  className="form-input"
                  style={{
                    padding: '15px',
                    fontSize: '16px',
                    minHeight: '50px',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) {
                      setShowTermsError(false);
                      setError('');
                    }
                  }}
                  className={showTermsError ? 'checkbox-error' : ''}
                />
                <span className={`checkmark ${showTermsError ? 'error' : ''}`}></span>
                I agree to the <a href="/terms" className="terms-link">Terms & Conditions</a>
                {showTermsError && (
                  <span className="terms-error">* Please accept the terms and conditions</span>
                )}
              </label>
            </div>

            <button 
              type="submit" 
              className="auth-button primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/signin" className="auth-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;