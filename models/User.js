const mongoose = require('mongoose');
const db = mongoose.connection.useDb('Test_1');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
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
      required: false,
    },
    role: {
      type: String,
      default: 'user',
    },
    otp: {
      type: String,
    },
    token: {
      type: String,
      required: false,
    },
    tokenCreatedAt: {
      type: Date,
      required: false,
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
    aadhaar_number: {
      type: String,
      required: false,
    },
    pan_number: {
      type: String,
      required: false,
    },
    kyc: {
      aadhaar_images: [{ type: mongoose.Schema.Types.ObjectId, ref: "kycFiles" }],
      pan_images: [{ type: mongoose.Schema.Types.ObjectId, ref: "kycFiles" }],
    },
    isVerifiedKyc: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add virtual field `isAddressAdded`
userSchema.virtual('isAddressAdded').get(function () {
  const { street, city, state, pincode } = this.address || {};
  return !!(street || city || state || pincode);
});

// Add virtual field `isKycAdded`
userSchema.virtual('isKycAdded').get(function () {
  const hasAadhaarNumber = !!this.aadhaar_number;
  const hasPanNumber = !!this.pan_number;
  const hasKyc =
    this.kyc &&
    Array.isArray(this.kyc.aadhaar_images) &&
    this.kyc.aadhaar_images.length > 0 &&
    Array.isArray(this.kyc.pan_images) &&
    this.kyc.pan_images.length > 0;

  return hasAadhaarNumber && hasPanNumber && hasKyc;
});

// Ensure virtuals are included in JSON and Object output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Create the model
const User = db.model('User', userSchema);

module.exports = User;
