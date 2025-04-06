const bcrypt = require('bcryptjs');
const twilioClient = require('../config/twilio'); 
const User = require('../models/User'); 
const mongoose = require('mongoose');
const db = mongoose.connection.useDb('Test_1'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const tokenStore = {};
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { GridFSBucket } = require("mongodb");
const stream = require("stream");

exports.signup = async (req, res) => {
  const { username, fullname, phonenumber, email, password ,role} = req.body;

  try {
    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate a referral code
    const referralCode = generateReferralCode();

    // Create a new user with the provided data
    const user = new User({
      username,
      fullname,
      phonenumber,
      email,
      password: hashedPassword,  // Store the hashed password
      role,
      referralCode,  // Set the referral code
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Return the saved user's data, including the referral code
    res.status(201).send({
      message: 'User created successfully',
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        fullname: savedUser.fullname,
        phonenumber: savedUser.phonenumber,
        email: savedUser.email,
        role: savedUser.role,
        referralCode: savedUser.referralCode, // Ensure referral code is included
        isAddressAdded: savedUser.isAddressAdded,

      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
};

// Function to generate a unique referral code
const generateReferralCode = () => {
  const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
  return `REF${randomNumber.toString().padStart(3, '0')}`; // Ensure the number is always 3 digits
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

exports.login = async (req, res) => {
  try {
    let { phonenumber } = req.body;

    // Ensure phone number is provided
    if (!phonenumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Convert phone number to string
    phonenumber = String(phonenumber).trim();

    // Find user by phone number
    const user = await User.findOne({ phonenumber });

    // If user is not found, return error
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Generate OTP
    const otp = generateOtp();

    // Prepare phone number in E.164 format
    const countryCode = '+91'; // Set your country code
    let formattedPhoneNumber = phonenumber;
    if (!formattedPhoneNumber.startsWith('+')) {
      formattedPhoneNumber = `${countryCode}${formattedPhoneNumber}`;
    }

    // Ensure Twilio phone number is set in environment variables
    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio phone number is not configured in environment variables.');
    }

    // Send OTP via Twilio
    const message = await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: formattedPhoneNumber,
      body: `Your OTP is ${otp}`,
    });

    // Save OTP to the user record
    user.otp = otp;
    await user.save();

    console.log(`OTP sent: ${message.sid}`);

    // Return response
    res.json({
      message: 'OTP sent successfully',
      otp: otp, // Include the OTP in the response
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { username, fullname, email, phonenumber } = req.body;  // Extract only the fields to be updated

    // Create an update object only with the fields provided in the request
    const updateFields = {};
    if (username) updateFields.username = username;
    if (fullname) updateFields.fullname = fullname;
    if (email) updateFields.email = email;
    if (phonenumber) updateFields.phonenumber = phonenumber;

    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.send({
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phonenumber: user.phonenumber,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Internal server error',
      error: err.message || err,
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send({ message: 'Internal server error', error: err.message });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { phonenumber, otp } = req.body;

    // Validate input
    if (!phonenumber || !otp) {
      return res.status(400).send({ message: 'Phone number and OTP are required' });
    }

    // Ensure phone number is a string
    const sanitizedPhoneNumber = String(phonenumber).trim();

    // Find user by phone number
    const user = await User.findOne({ phonenumber: sanitizedPhoneNumber });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Compare OTPs as strings
    if (String(user.otp) !== String(otp)) {
      return res.status(401).send({ message: 'Invalid OTP' });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = null; // Clear OTP after successful verification

    // Generate a new JWT token with a secret key stored in an environment variable
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '168h' } // Token expiry time
    );

    // Save the token in the user document (optional)
    user.token = token; // Store the token in the database (optional, depending on your needs)
    await user.save();

    // Return success message along with the token and user details
    return res.send({
      message: 'OTP verified successfully',
      token, // Include the JWT token
      user: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        phonenumber: user.phonenumber,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).send({ message: 'Internal server error', error: err.message });
  }
};

  exports.updateProfile = async (req, res) => {
    try {
      const { userId } = req.params;
      const { address, bank_details } = req.body;
  
      // Validate the input data for address and bank details
      if (!address || !bank_details) {
        return res.status(400).send({ message: 'Address and bank details are required' });
      }
  
      // Ensure that the address and bank_details fields contain the required fields
      if (!address.street || !address.city || !address.state || !address.pincode) {
        return res.status(400).send({ message: 'Incomplete address information' });
      }
  
      if (!bank_details.account_number || !bank_details.ifsc_code || !bank_details.bank_name) {
        return res.status(400).send({ message: 'Incomplete bank details' });
      }
  
      // Fetch user from the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      // Update the user's address and bank details
      user.address = address;
      user.bank_details = bank_details;
  
      // Save the updated user to the database
      const updatedUser = await user.save();
  
      // Return the updated user information excluding sensitive fields
      res.send({
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          phone_number: updatedUser.phone_number,
          referral_code: updatedUser.referral_code,
          address: updatedUser.address,
          bank_details: updatedUser.bank_details,
        },
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).send({ message: 'Internal server error', error: err.message });
    }
  };


const bucket = new GridFSBucket(db, { bucketName: "kycFiles" });
const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([
  { name: "aadhaar", maxCount: 5 },
  { name: "pan", maxCount: 5 },
]);

exports.updateKYC = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { userId } = req.params;
    const { aadhaar_number, pan_number } = req.body;
    const aadhaarImages = req.files?.aadhaar || [];
    const panImages = req.files?.pan || [];

    if (!aadhaar_number || !pan_number) {
      return res.status(400).json({
        message: "Aadhaar number and PAN number are required",
      });
    }

    if (aadhaarImages.length === 0 || panImages.length === 0) {
      return res.status(400).json({
        message: "At least one Aadhaar image and one PAN image are required",
      });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.aadhaar_number = aadhaar_number;
      user.pan_number = pan_number;
      user.kyc = { aadhaar_images: [], pan_images: [] };

      for (const file of aadhaarImages) {
        const fileId = new mongoose.Types.ObjectId();
        const uploadStream = bucket.openUploadStreamWithId(fileId, file.originalname, {
          contentType: file.mimetype,
        });
        stream.Readable.from(file.buffer).pipe(uploadStream);
        user.kyc.aadhaar_images.push(fileId);
      }

      for (const file of panImages) {
        const fileId = new mongoose.Types.ObjectId();
        const uploadStream = bucket.openUploadStreamWithId(fileId, file.originalname, {
          contentType: file.mimetype,
        });
        stream.Readable.from(file.buffer).pipe(uploadStream);
        user.kyc.pan_images.push(fileId);
      }

      await user.save();

      return res.json({
        message: "KYC updated successfully",
        kyc: {
          aadhaar_number,
          pan_number,
          aadhaar_images: user.kyc.aadhaar_images,
          pan_images: user.kyc.pan_images,
        },
      });
    } catch (error) {
      console.error("Error updating KYC:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

exports.getKYC = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.kyc || !user.kyc.aadhaar_images || !user.kyc.pan_images) {
      return res.status(404).json({ message: "No KYC data found for this user" });
    }

    const aadhaarFiles = user.kyc.aadhaar_images.map((id) => ({ fileId: id }));
    const panFiles = user.kyc.pan_images.map((id) => ({ fileId: id }));

    return res.json({
      message: "KYC data retrieved successfully",
      kyc: {
        aadhaar_images: aadhaarFiles,
        pan_images: panFiles,
      },
    });
  } catch (error) {
    console.error("Error retrieving KYC:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDetails = { ...user.toObject() };
    delete userDetails.kyc;

    const serverUrl = `${req.protocol}://${req.get("host")}`;

    if (user.kyc && user.kyc.aadhaar_images && user.kyc.pan_images) {
      return res.status(200).json({
        userDetails,
        kyc: {
          aadhaar_images: user.kyc.aadhaar_images.map((id) => ({
            fileId: id,
            url: `${serverUrl}/kyc/image/${id}`,
          })),
          pan_images: user.kyc.pan_images.map((id) => ({
            fileId: id,
            url: `${serverUrl}/kyc/image/${id}`,
          })),
        },
      });
    }

    return res.status(200).json({
      userDetails,
      message: "KYC data not available",
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({
      message: "An error occurred while fetching the user",
      error: err.message,
    });
  }
};


exports.getKYCImage = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const fileStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    fileStream.on("error", (err) => {
      console.error("Error retrieving file:", err);
      return res.status(404).json({ message: "File not found" });
    });

    fileStream.on("file", (file) => {
      res.set("Content-Type", file.contentType);
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};