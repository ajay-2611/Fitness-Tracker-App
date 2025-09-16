import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './FitnessContent.css';

const workoutTypes = {
    'Running': 5,
    'Cycling': 4.2,
    'Weight lifting': 3,
    'Jumping jacks': 6,
    'Plank': 2.5
};

const intensityLevels = {
    'slow': 0.8,
    'medium': 1,
    'intense': 2
};

const workoutImages = {
    'Running': 'https://hips.hearstapps.com/hmg-prod/images/running-track-1667904802.jpg?crop=0.668xw:1.00xh;0.0737xw,0&resize=1200:*',
    'Cycling': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRojYLPHyZSdib7HVum9UNMT9VGBfHYYHnikQ&s',
    'Weight lifting': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV36vg3YFDBjYPqH7wZYl9OMc6uF-WfS_p6Q&s',
    'Jumping jacks': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlECUUtGf9-0uZHJw2U-XOQ1cP3D1bdUgWYw&s',
    'Plank': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaXU2VOusNl6L3TFrxmdxXNYFagP7Zu0v2tQ&s'
};

const FitnessContent = ({ handleSignOut }) => {
    const [fitnessEntries, setFitnessEntries] = useState([]);
    const [showAddEntryForm, setShowAddEntryForm] = useState(false);
    const [editEntryIndex, setEditEntryIndex] = useState(null);

    // Initialize form data - keep duration as string for input handling
    const [formData, setFormData] = useState(() => ({
        activityName: 'Running',
        duration: "30",
        intensity: 'medium',
        activityDate: new Date().toISOString().split('T')[0]
    }));

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Reset form to defaults
    const resetForm = () => {
        setFormData({
            activityName: 'Running',
            duration: "30",
            intensity: 'medium',
            activityDate: new Date().toISOString().split('T')[0]
        });
    };

    // Fetch entries when component mounts.
    // ADDED: Re-fetch entries after a successful form submission.
    const fetchEntries = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleSignOut();
                return;
            }
            
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/entries`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setFitnessEntries(data);
            } else if (response.status === 401) {
                handleSignOut();
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
            setError('Failed to fetch entries. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [handleSignOut]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    // Input change handler - updates state with every keystroke
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            handleSignOut();
            return;
        }

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const url = editEntryIndex !== null
            ? `${apiUrl}/api/entries/${fitnessEntries[editEntryIndex]._id}`
            : `${apiUrl}/api/entries`;
        const method = editEntryIndex !== null ? 'PUT' : 'POST';

        try {
            // Validate and convert duration to number safely
            let duration = parseInt(formData.duration, 10);
            if (isNaN(duration) || duration < 1) {
                duration = 1;
            }
            
            const caloriesBurned = calculateCalories(
                formData.activityName,
                duration,
                formData.intensity
            );

            const entryData = {
                ...formData,
                duration,
                caloriesBurned,
                activityDate: formData.activityDate || new Date().toISOString().split('T')[0]
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(entryData)
            });

            if (response.ok) {
                // SUCCESS: Refetch all entries to get the latest data.
                await fetchEntries(); 
                setShowAddEntryForm(false);
                resetForm();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to save entry. Please try again.');
            }
        } catch (error) {
            console.error('Error saving entry:', error);
            setError('An error occurred while saving. Please try again.');
        }
    };

    // Delete entry
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/entries/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                setFitnessEntries(fitnessEntries.filter(entry => entry._id !== id));
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    // Edit entry
    const handleEdit = (index) => {
        const entry = fitnessEntries[index];
        setFormData({
            activityName: entry.activityName,
            duration: String(entry.duration || 1), // Convert to string for input
            intensity: entry.intensity,
            activityDate: entry.activityDate.split('T')[0]
        });
        setEditEntryIndex(index);
        setShowAddEntryForm(true);
    };

    // Calculate calories
    const calculateCalories = (activity, duration, intensity) => {
        const baseCalories = workoutTypes[activity] || 5;
        const intensityMultiplier = intensityLevels[intensity] || 1;
        return Math.round(baseCalories * duration * intensityMultiplier);
    };

    const handleAddNewEntry = () => {
        resetForm();
        setEditEntryIndex(null);
        setShowAddEntryForm(true);
        setError('');
    };

    const handleCancelForm = () => {
        setShowAddEntryForm(false);
        setEditEntryIndex(null);
        setError('');
        resetForm();
    };

    if (isLoading) {
        return (
            <div className="fitness-app">
                <header className="app-header">
                    <h1>Fitness Tracker</h1>
                    <button 
                        onClick={handleSignOut}
                        className="sign-out-btn"
                    >
                        Sign Out
                    </button>
                </header>
                <div className="loading">Loading your fitness entries...</div>
            </div>
        );
    }

    return (
        <div className="fitness-app">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1>Fitness Tracker</h1>
                    </div>
                    <div className="header-right">
                        <button 
                            onClick={handleSignOut}
                            className="sign-out-btn"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="app-main">
                {!showAddEntryForm ? (
                    <div className="add-entry-container">
                        <button 
                            onClick={handleAddNewEntry}
                            className="add-entry-btn"
                        >
                            + Add New Entry
                        </button>
                    </div>
                ) : (
                    <div className="entry-form-container">
                        <h2>{editEntryIndex !== null ? 'Edit Entry' : 'Add New Entry'}</h2>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmit} className="entry-form">
                            <div className="form-group">
                                <label>Activity:</label>
                                <select
                                    className="form-control"
                                    name="activityName"
                                    value={formData.activityName}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {Object.keys(workoutTypes).map(activity => (
                                        <option key={activity} value={activity}>
                                            {activity}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Intensity:</label>
                                <select
                                    className="form-control"
                                    name="intensity"
                                    value={formData.intensity}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {Object.keys(intensityLevels).map(level => (
                                        <option key={level} value={level}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Duration (minutes):</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    min="1"
                                    step="1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date:</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    name="activityDate"
                                    value={formData.activityDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    {editEntryIndex !== null ? 'Update Entry' : 'Add Entry'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancelForm}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                <div className="entries-container">
                    <h2>Your Entries</h2>
                    {error && <div className="error-message">{error}</div>}
                    {fitnessEntries.length === 0 ? (
                        <div className="no-entries">
                            <p>No entries yet. Add your first workout!</p>
                        </div>
                    ) : (
                        <ul className="entries-list">
                            {fitnessEntries.map((entry, index) => {
                                const calories = calculateCalories(
                                    entry.activityName,
                                    entry.duration,
                                    entry.intensity
                                );
                                
                                return (
                                    <li key={entry._id} className="entry-card">
                                        <div className="entry-image">
                                            <img
                                                src={workoutImages[entry.activityName] || workoutImages['Running']}
                                                alt={entry.activityName}
                                            />
                                        </div>
                                        <div className="entry-details">
                                            <h3>{entry.activityName}</h3>
                                            <p>Duration: {entry.duration} minutes</p>
                                            <p>Intensity: {entry.intensity}</p>
                                            <p>Calories Burned: {calories}</p>
                                            <p>Date: {new Date(entry.activityDate).toLocaleDateString()}</p>
                                            <div className="entry-actions">
                                                <button
                                                    className="btn btn-edit"
                                                    onClick={() => handleEdit(index)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-delete"
                                                    onClick={() => handleDelete(entry._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FitnessContent;