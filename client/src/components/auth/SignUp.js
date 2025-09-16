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
  const [showPassword, setShowPassword] = useState(false);
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
    
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
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
              <div className="input-group" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 characters)"
                  required
                  className="form-input"
                  style={{
                    padding: '12px 45px 12px 15px',
                    fontSize: '16px',
                    minHeight: '44px',
                    width: '100%'
                  }}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: '500'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  required
                />
                <span className="checkmark"></span>
                I agree to the <a href="/terms" className="terms-link">Terms</a> and <a href="/privacy" className="terms-link">Privacy Policy</a>
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