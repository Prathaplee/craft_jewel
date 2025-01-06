const mongoose = require('mongoose');
const db = mongoose.connection.useDb('Test_1'); // Use the specific database

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
    required: false, // Optional field
  },
  role: {
    type: String,
    default: 'user', // Default role for new users
  },
  otp: {
    type: String, // For OTP verification
  },
  otp: {
    type: String, // For OTP verification
  },
  token: {
    type: String, // Store the generated token for the user
    required: false, // Optional, only set when the user has verified OTP
  },
  tokenCreatedAt: {
    type: Date, // Store the time when the token was created
    required: false, // Optional, only set when the token is generated
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  bank_details: {
    account_number: String,
    ifsc_code: String,
    bank_name: String,
  },
  kyc: {
    aadhar_image: {
      data: Buffer, // Store the image as binary data
      contentType: String, // Store MIME type for the image
    },
    pan_image: {
      data: Buffer, // Store the image as binary data
      contentType: String, // Store MIME type for the image
    },
  },
}, { timestamps: true }); 
const User = db.model('User', userSchema);

module.exports = User;  // Export the model
