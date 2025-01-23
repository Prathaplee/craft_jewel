const mongoose = require('mongoose');
const db = mongoose.connection.useDb('Test_1');

// Shared logic for Gold and Diamond subscription schema
const subscriptionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: false
  },
  initial_amount: {
    type: Number,
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  initial_date: {
    type: Date,
    default: null
  },
  end_date: {
    type: Date,
    default: null
  },
  subscribe_status: {
    type: String,
    enum: ['waiting', 'active', 'cancelled'],
    default: 'waiting'
  },
  due_date: {
    type: [Date], // Array of due dates for the next 11 months
    default: [],  // Starts empty, populated when subscribe_status is 'active'
  },
  payments: [
    {
      payment_date: {
        type: Date,
        default: Date.now
      },
      payment_amount: {
        type: Number
      },
      payment_status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
      },
      payment_method: {
        type: String,
        enum: ['razorpay', 'manual'],
        default: 'razorpay'
      },
      razorpay_order_id: {
        type: String, // Store the Razorpay order ID
        required: function () {
          return this.payment_method === 'razorpay';
        }
      },
      razorpay_payment_id: {
        type: String, // Store the Razorpay payment ID
        required: function () {
          return this.payment_status === 'completed';
        }
      },
      razorpay_signature: {
        type: String, // Store the Razorpay payment signature
        required: function () {
          return this.payment_status === 'completed';
        }
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  },
  scheme_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: true
  }
});

// Create the Gold and Diamond subscription models
const GoldSubscription = db.model('GoldSubscription', subscriptionSchema, 'gold_subscriptions');
const DiamondSubscription = db.model('DiamondSubscription', subscriptionSchema, 'diamond_subscriptions');

module.exports = { GoldSubscription, DiamondSubscription };
