const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token is not valid' });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = auth;
