import React from 'react';
import { Link } from 'react-router-dom';
import './AuthHeader.css';

const AuthHeader = ({ title }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1>Fitness Tracker</h1>
        </div>
        <div className="header-right">
          <nav className="auth-nav">
            <Link to="/signin" className={`nav-link ${title === 'Sign In' ? 'active' : ''}`}>
              Sign In
            </Link>
            <Link to="/signup" className={`nav-link ${title === 'Sign Up' ? 'active' : ''}`}>
              Sign Up
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
