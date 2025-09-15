require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
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

// MongoDB Connection
// Load environment variables
require('dotenv').config();

const MONGODB_URI = process.env.NODE_ENV === 'production' 
    ? process.env.MONGODB_URI 
    : 'mongodb://0.0.0.0:27017/fitness-tracker';

const PORT = process.env.PORT || 8000;

// Production security middleware
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    app.use(helmet());
    app.use(compression());
}

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error(' MongoDB connection error:', err);
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
const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});