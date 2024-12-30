const mongoose = require('mongoose');
const db = mongoose.connection.useDb('Test_1'); // Use the specific database

// Define schema for app version
const AppVersionSchema = new mongoose.Schema({
  current_version: {
    type: String,
    required: true,
  },
  mandatory_version: {
    type: String,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create model
const AppVersion = db.model('AppVersion', AppVersionSchema);

module.exports = AppVersion;
