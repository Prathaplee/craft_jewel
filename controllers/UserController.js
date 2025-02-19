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


exports.signup = async (req, res) => {
  const { username, fullname, phonenumber, email, password ,role} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const referralCode = generateReferralCode();

    const user = new User({
      username,
      fullname,
      phonenumber,
      email,
      password: hashedPassword,  
      role,
      referralCode, 
    });

    const savedUser = await user.save();

    res.status(201).send({
      message: 'User created successfully',
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        fullname: savedUser.fullname,
        phonenumber: savedUser.phonenumber,
        email: savedUser.email,
        role: savedUser.role,
        referralCode: savedUser.referralCode,
        isAddressAdded: savedUser.isAddressAdded,

      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
};

const generateReferralCode = () => {
  const randomNumber = Math.floor(Math.random() * 1000);
  return `REF${randomNumber.toString().padStart(3, '0')}`; 
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

exports.login = async (req, res) => {
  try {
    let { phonenumber } = req.body;

    if (!phonenumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    phonenumber = String(phonenumber).trim();

    const user = await User.findOne({ phonenumber });

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const otp = generateOtp();

    const countryCode = '+91'; 
    let formattedPhoneNumber = phonenumber;
    if (!formattedPhoneNumber.startsWith('+')) {
      formattedPhoneNumber = `${countryCode}${formattedPhoneNumber}`;
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio phone number is not configured in environment variables.');
    }

    const message = await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: formattedPhoneNumber,
      body: `Your OTP is ${otp}`,
    });

    user.otp = otp;
    await user.save();

    console.log(`OTP sent: ${message.sid}`);

    res.json({
      message: 'OTP sent successfully',
      otp: otp, 
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.getKYC = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.kyc || !user.kyc.aadhaar_images || !user.kyc.pan_images) {
      return res.status(404).json({ message: 'No KYC data found for this user' });
    }

    const aadhaarImages = user.kyc.aadhaar_images || [];
    const panImages = user.kyc.pan_images || [];

    const response = {
      aadhaar_images: aadhaarImages.map((image) => ({
        contentType: image.contentType,
        image: image.data.toString('base64'),
      })),
      pan_images: panImages.map((image) => ({
        contentType: image.contentType,
        image: image.data.toString('base64'),
      })),
    };

    return res.json({
      message: 'KYC data retrieved successfully',
      kyc: response,
    });
  } catch (error) {
    console.error('Error retrieving KYC:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (user) {
      const userDetails = { ...user.toObject() };
      delete userDetails.kyc; 

      if (user.kyc && user.kyc.aadhaar_images && user.kyc.pan_images) {
        const reqMock = { params: { userId } };
        const resMock = {
          status: (statusCode) => ({
            json: (response) => ({ statusCode, ...response }),
          }),
          json: (response) => response,
        };

        const kycResponse = await exports.getKYC(reqMock, resMock);

        return res.status(200).json({
          userDetails,
          kyc: kycResponse.kyc, 
        });
      }

      return res.status(200).json({
        userDetails,
        message: "KYC data not available",
      });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      message: "An error occurred while fetching the user",
      error: err.message,
    });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { username, fullname, email, phonenumber } = req.body; 

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
    const user = await User.findByIdAndDelete(req.params.id); 

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

    if (!phonenumber || !otp) {
      return res.status(400).send({ message: 'Phone number and OTP are required' });
    }

    const sanitizedPhoneNumber = String(phonenumber).trim();

    const user = await User.findOne({ phonenumber: sanitizedPhoneNumber });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(401).send({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = null; 

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '168h' } 
    );

    user.token = token; 
    await user.save();

    return res.send({
      message: 'OTP verified successfully',
      token, 
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
  
      if (!address || !bank_details) {
        return res.status(400).send({ message: 'Address and bank details are required' });
      }
  
      if (!address.street || !address.city || !address.state || !address.pincode) {
        return res.status(400).send({ message: 'Incomplete address information' });
      }
  
      if (!bank_details.account_number || !bank_details.ifsc_code || !bank_details.bank_name) {
        return res.status(400).send({ message: 'Incomplete bank details' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      user.address = address;
      user.bank_details = bank_details;
  
      const updatedUser = await user.save();
  
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


  const storage = multer.memoryStorage();
  const upload = multer().fields([
    { name: 'aadhaar', maxCount: 5 }, 
    { name: 'pan', maxCount: 5 },
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
        message: 'Aadhaar number and PAN number are required',
      });
    }

    if (aadhaarImages.length === 0 || panImages.length === 0) {
      return res.status(400).json({
        message: 'At least one Aadhaar image and one PAN image are required',
      });
    }

    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update KYC details
      user.aadhaar_number = aadhaar_number;
      user.pan_number = pan_number;

      user.kyc = {
        aadhaar_images: aadhaarImages.map((file) => ({
          data: file.buffer,
          contentType: file.mimetype,
        })),
        pan_images: panImages.map((file) => ({
          data: file.buffer,
          contentType: file.mimetype,
        })),
      };

      // Save updated user
      await user.save();

      return res.json({
        message: 'KYC updated successfully',
        kyc: {
          aadhaar_number,
          pan_number,
          aadhaar_images: aadhaarImages.length,
          pan_images: panImages.length,
        },
      });
    } catch (error) {
      console.error('Error updating KYC:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
};

