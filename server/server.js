console.log('Starting server...');
require('dotenv').config();

// Log environment variables (except sensitive ones)
console.log('Environment:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- PORT:', process.env.PORT || 8000);
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '*** (set)' : 'Not set');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '*** (set)' : 'Not set');
console.log('- CLIENT_URL:', process.env.CLIENT_URL || 'http://localhost:3000');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');

console.log('Loading routes...');
const authRoutes = require('./routes/auth');
const entriesRoutes = require('./routes/entries');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json()); // Body parser
app.use(bodyParser.json()); // Additional body parser
app.use(morgan('dev')); // Request logging

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production' ?
            'Internal server error' : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// MongoDB Configuration
const MONGODB_URI = process.env.NODE_ENV === 'production' 
    ? process.env.MONGODB_URI 
    : 'mongodb://0.0.0.0:27017/fitness-tracker';

const PORT = process.env.PORT || 8000;

// Production security middleware
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    app.use(compression());
}

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Successfully connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async() => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

// Start the server
console.log('Starting HTTP server...');
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/fitness-tracker'}`);
    console.log(`CORS allowed origin: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or specify a different one.`);
    }
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection at: ${promise}, reason: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
