import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FitnessContent from './components/FitnessContent';

// Import CSS
import './index.css';

function FitnessApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Check authentication status on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token validity here if needed
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleSignIn = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        navigate('/fitness');
    };

    const handleSignUp = () => {
        // After successful signup, redirect to signin
        navigate('/signin');
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/signin');
    };

    return (
        <div className="App">
            <Routes>
                {/* Public Routes */}
                <Route path="/home" element={
                    !isAuthenticated ? (
                        <HomePage />
                    ) : (
                        <Navigate to="/fitness" replace />
                    )
                } />
                
                <Route path="/signin" element={
                    !isAuthenticated ? (
                        <SignIn onSignIn={handleSignIn} />
                    ) : (
                        <Navigate to="/fitness" replace />
                    )
                } />
                
                <Route path="/signup" element={
                    !isAuthenticated ? (
                        <SignUp onSignUp={handleSignUp} />
                    ) : (
                        <Navigate to="/fitness" replace />
                    )
                } />
                
                {/* Protected Route */}
                <Route path="/fitness" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <FitnessContent handleSignOut={handleSignOut} />
                    </ProtectedRoute>
                } />
                
                {/* Default Route */}
                <Route path="/" element={
                    isAuthenticated ? (
                        <Navigate to="/fitness" replace />
                    ) : (
                        <Navigate to="/home" replace />
                    )
                } />
                
                {/* Catch-all Route */}
                <Route path="*" element={
                    isAuthenticated ? (
                        <Navigate to="/fitness" replace />
                    ) : (
                        <Navigate to="/home" replace />
                    )
                } />
            </Routes>
        </div>
    );
}

// Main App component with Router
function App() {
  return (
    <Router>
      <FitnessApp />
    </Router>
  );
}

export default App;