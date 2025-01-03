const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');
const mongoose = require('mongoose');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Get data for a specific date
router.get('/:userId/:date', async (req, res) => {
  try {
    const data = await UserData.findOne({
      userId: req.params.userId,
      date: req.params.date
    });
    res.json(data ? data.data : {});
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Save data for a specific date
router.post('/:userId/:date', async (req, res) => {
  try {
    const data = await UserData.findOneAndUpdate(
      { 
        userId: req.params.userId,
        date: req.params.date
      },
      {
        userId: req.params.userId,
        date: req.params.date,
        data: req.body
      },
      { new: true, upsert: true }
    );
    res.json(data.data);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get all dates with data
router.get('/:userId/dates/all', async (req, res) => {
  try {
    const dates = await UserData.find(
      { userId: req.params.userId },
      { date: 1, _id: 0 }
    );
    res.json(dates.map(d => d.date));
  } catch (error) {
    console.error('Error fetching dates:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = router;