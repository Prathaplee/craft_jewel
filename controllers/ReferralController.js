const User = require('../models/User'); // Assuming you have a User model

// Get referral list for a specific user based on their referral code
exports.getReferralList = async (req, res) => {
  try {
    const { referralCode } = req.params;

    // Find all users who have the given referral code
    const referredUsers = await User.find({ referralCode });

    if (referredUsers.length === 0) {
      return res.status(404).json({ message: 'No users found with this referral code' });
    }

    // Return the list of referred users
    res.status(200).json({
      message: 'Referral list retrieved successfully',
      referredUsers: referredUsers.map(user => ({
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phonenumber: user.phonenumber,
        referralCode: user.referralCode
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};


exports.getAllReferralList = async (req, res) => {
    try {
      // Find all users who have a referral code set
      const usersWithReferralCode = await User.find({ referralCode: { $exists: true, $ne: null } });
  
      if (usersWithReferralCode.length === 0) {
        return res.status(404).json({ message: 'No users with referral codes found' });
      }
  
      // Return the list of users with referral codes
      res.status(200).json({
        message: 'Referral list retrieved successfully',
        users: usersWithReferralCode.map(user => ({
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          phonenumber: user.phonenumber,
          referralCode: user.referralCode
        }))
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', error: err });
    }
  };