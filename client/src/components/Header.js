import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="container">
        <Link to="/" className="logo">Fitness Tracker</Link>
      </div>
    </header>
  );
};

export default Header;
