const express = require('express');
const FitnessEntry = require('../models/FitnessEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Create a new fitness entry
router.post('/', async (req, res) => {
    const { activityName, caloriesBurned, duration, intensity, activityDate } = req.body;
    
    // Input validation
    if (!activityName || !caloriesBurned || !duration || !intensity) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const newEntry = new FitnessEntry({
            userId: req.userId, // From auth middleware
            activityName,
            caloriesBurned: Number(caloriesBurned),
            duration: Number(duration),
            intensity,
            activityDate: activityDate || new Date()
        });
        
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error creating fitness entry:', error);
        res.status(500).json({ error: 'Server error while creating entry' });
    }
});

// Get all fitness entries for the authenticated user
router.get('/', async (req, res) => {
    try {
        const entries = await FitnessEntry.find({ userId: req.userId })
            .sort({ activityDate: -1 }); // Most recent first
        res.json(entries);
    } catch (error) {
        console.error('Error fetching entries:', error);
        res.status(500).json({ error: 'Server error while fetching entries' });
    }
});
// Get a single fitness entry by ID
router.get('/:id', async (req, res) => {
    try {
        const entry = await FitnessEntry.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found or access denied' });
        }
        
        res.json(entry);
    } catch (error) {
        console.error('Error fetching entry:', error);
        res.status(500).json({ error: 'Server error while fetching entry' });
    }
});

// Update a fitness entry
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { activityName, caloriesBurned, duration, intensity, activityDate } = req.body;
    
    try {
        const updateData = {};
        if (activityName) updateData.activityName = activityName;
        if (caloriesBurned) updateData.caloriesBurned = Number(caloriesBurned);
        if (duration) updateData.duration = Number(duration);
        if (intensity) updateData.intensity = intensity;
        if (activityDate) updateData.activityDate = new Date(activityDate);
        
        const updatedEntry = await FitnessEntry.findOneAndUpdate(
            { _id: id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedEntry) {
            return res.status(404).json({ error: 'Entry not found or unauthorized' });
        }
        
        res.json(updatedEntry);
    } catch (error) {
        console.error('Error updating entry:', error);
        res.status(500).json({ 
            error: error.name === 'ValidationError' 
                ? error.message 
                : 'Server error while updating entry' 
        });
    }
});

// Delete a fitness entry
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedEntry = await FitnessEntry.findOneAndDelete({ 
            _id: id, 
            userId: req.userId 
        });
        
        if (!deletedEntry) {
            return res.status(404).json({ error: 'Entry not found or unauthorized' });
        }
        
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).json({ error: 'Server error while deleting entry' });
    }
});

module.exports = router;