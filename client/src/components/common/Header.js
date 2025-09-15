import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="auth-header">
      <div className="logo">Fitness</div>
      <Link to="/" className="home-button">
        <FiHome className="home-icon" />
        <span>Home</span>
      </Link>
    </header>
  );
};

export default Header;
