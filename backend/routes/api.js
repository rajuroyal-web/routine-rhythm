const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');

// Get data for a specific date
router.get('/:userId/:date', async (req, res) => {
  try {
    const data = await UserData.findOne({
      userId: req.params.userId,
      date: req.params.date
    });
    res.json(data ? data.data : {});
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
