const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async(req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new User({ 
            username: email, // Using email as username for simplicity
            email,
            name,
            password 
        });
        await newUser.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Email already exists' });
    }
});

router.post('/signin', async(req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({ error: 'Invalid username or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret');
        res.send({ token });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;