import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaChartLine, FaBullseye } from 'react-icons/fa';
import '../HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="logo">Fitness Tracker</Link>
          <div className="auth-buttons">
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Track Your Fitness Journey</h1>
          <p>Start your fitness journey today and achieve your goals with our easy-to-use fitness tracker.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Why Choose Our Fitness Tracker</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaDumbbell />
            </div>
            <h3>Track Workouts</h3>
            <p>Easily log your exercises and monitor your progress over time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Analyze Progress</h3>
            <p>View detailed statistics to monitor your fitness journey.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaBullseye />
            </div>
            <h3>Set Goals</h3>
            <p>Achieve your fitness goals with our tracking tools.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Start Your Fitness Journey?</h2>
        <p>Join us today and take the first step towards a healthier you.</p>
        <Link to="/signup" className="btn btn-white">Sign Up Now - It's Free</Link>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h4>Fitness Tracker</h4>
            <p>Your personal fitness companion.</p>
          </div>
        </div>
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} Fitness Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
