const mongoose = require('mongoose');
const db = mongoose.connection.useDb('Test_1'); 
// Define schema for gold and silver rates
const RateSchema = new mongoose.Schema({
  gold_rate: {
    type: Number,
    required: true,
  },
  silver_rate: {
    type: Number,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create model
const Rate = db.model('Rate', RateSchema);

module.exports = Rate;
