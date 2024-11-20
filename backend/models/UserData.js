const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  data: {
    mood: String,
    energyLevel: Number,
    weather: String,
    wakeTime: String,
    sleepTime: String,
    todos: [{
      text: String,
      completed: Boolean
    }],
    motivation: String,
    goals: [{
      text: String,
      completed: Boolean
    }],
    transactions: [{
      type: String,
      category: String,
      amount: String,
      description: String
    }],
    habits: [Boolean],
    waterIntake: [Boolean],
    notes: String,
    meals: {
      breakfast: [{ text: String }],
      lunch: [{ text: String }],
      dinner: [{ text: String }],
      snacks: [{ text: String }]
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserData', userDataSchema);