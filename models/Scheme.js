const mongoose = require('mongoose');
const db = mongoose.connection.useDb('Test_1'); 

const schemeSchema = new mongoose.Schema({
  scheme_name: { type: String, required: true }, 
  scheme_type: {
    type: String,
    enum: ['diamond', 'gold'], 
    required: true 
  },
  min_amount: { type: Number, required: true }, 
  max_amount: { type: Number, required: true }, 
  is_weight_or_amount: {
    type: String,
    enum: ['weight', 'amount'], 
    required: function () {
      return this.scheme_type === 'gold';
    }
  },
  min_weight: { 
    type: Number, 
    required: function() {
      return this.scheme_type === 'gold' && this.is_weight_or_amount === 'weight';
    }
  }, 
  max_weight: { 
    type: Number, 
    required: function() {
      return this.scheme_type === 'gold' && this.is_weight_or_amount === 'weight';
    }
  }, 
  duration: { type: Number, required: true }, 
  scheme_description: { type: String, required: false } 
});

// Create the model
const Scheme = db.model('Scheme', schemeSchema);

module.exports = Scheme;
