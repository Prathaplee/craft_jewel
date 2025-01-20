const { GoldSubscription } = require('../models/Subscription');
const { DiamondSubscription } = require('../models/Subscription');
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const moment = require('moment');
const Rate = require('../models/Rate');

const createGoldSubscription = async (req, res) => {
  try {
    const { user_id, scheme_id,amount, weight } = req.body;
    
    // Fetch the user from the database
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // Ensure KYC is completed
    if (!user.kyc || !user.kyc.aadhaar_images || !user.kyc.pan_images || !user.aadhaar_number || !user.pan_number) {
      return res.status(400).json({ message: "User KYC not completed" });
    }

    // Fetch the scheme based on scheme_id
    const scheme = await Scheme.findById(scheme_id);
    if (!scheme) {
      return res.status(400).json({ message: "Scheme not found" });
    }

    // Check if the scheme type is 'gold'
    if (scheme.scheme_type !== 'gold') {
      return res.status(400).json({ message: "This is not a Gold subscription scheme" });
    }

    // Check if the scheme requires amount or weight
    const isAmountRequired = scheme.is_weight_or_amount === 'amount';
    const isWeightRequired = scheme.is_weight_or_amount === 'weight';

    let initialAmount;

    // If amount is required
    if (isAmountRequired) {
      if (!amount) {
        return res.status(400).json({ message: "Amount is required for this Gold subscription scheme" });
      }
      initialAmount = amount;
    }
    
    // If weight is required
    if (isWeightRequired) {
      if (!weight) {
        return res.status(400).json({ message: "Weight is required for this Gold subscription scheme" });
      }

      // Fetch today's gold rate from the Rate collection
      const goldRate = await Rate.findOne().sort({ created_at: -1 }); // Get the latest gold rate based on created_at
      if (!goldRate) {
        return res.status(400).json({ message: "Gold rate not found" });
      }

      // Calculate the initial amount based on weight and gold rate
      initialAmount = weight * goldRate.gold_rate;
    }

    // Create subscription data
    const subscriptionData = {
      user_id,
      scheme_id,
      subscribe_status: 'waiting',
      created_at: new Date(),
      updated_at: new Date(),
      due_date: null,
      initial_amount: initialAmount,
    };

    // Store weight if applicable
    if (isWeightRequired) {
      subscriptionData.weight = weight;
    }

    // Create and save the subscription
    const subscription = new GoldSubscription(subscriptionData);
    await subscription.save();
    
    res.status(201).json({ message: "Gold subscription created successfully", subscription });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the subscription", error });
  }
};


const createDiamondSubscription = async (req, res) => {
  try {
    const { user_id, scheme_id, initial_amount} = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.kyc || !user.kyc.aadhaar_images || !user.kyc.pan_images || !user.aadhaar_number || !user.pan_number){
      return res.status(400).json({ message: "User KYC not completed" });
    }
    const scheme = await Scheme.findById(scheme_id);
    if (!scheme) {
      return res.status(400).json({ message: "Scheme not found" });
    }
    if (scheme.scheme_type !== 'diamond') {
      return res.status(400).json({ message: "This is not a Diamond subscription scheme" });
    }
    const subscriptionData = {
      user_id,
      scheme_id,
      initial_amount,
      payment_status:'pending',
      subscribe_status: 'waiting',
      created_at: new Date(),
    };
    if (!initial_amount) {
      return res.status(400).json({ message: "Amount is required for Diamond subscription" });
    }
    subscriptionData.initial_amount = initial_amount;
    const subscription = new DiamondSubscription(subscriptionData);

    await subscription.save();
    res.status(201).json({ message: "Diamond subscription created successfully", subscription });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the subscription", error });
  }
};

const updateGoldSubscription = async (req, res) => {
  try {
    const { subscription_id } = req.params; // Get the subscription ID from the request params
    const { due_date, subscribe_status, isVerifiedKyc } = req.body; // Include isVerifiedKyc in the request body

    // Find the subscription by ID
    const subscription = await GoldSubscription.findById(subscription_id);
    if (!subscription) {
      return res.status(400).json({ message: "Gold subscription not found" });
    }

    // Check if the user exists using user_id from the subscription
    const user = await User.findById(subscription.user_id);
    if (!user) {
      return res.status(400).json({ message: "User associated with this subscription not found" });
    }

    // Allow admin to update isVerifiedKyc for the user
    if (typeof isVerifiedKyc !== 'undefined') {
      user.isVerifiedKyc = isVerifiedKyc; // Update isVerifiedKyc
      await user.save(); // Save changes to the user
    }

    // Update the subscription details
    const initialDate = moment().toDate();
    const endDate = moment(initialDate).add(11, 'months').toDate();
    const result = await GoldSubscription.updateOne(
      { _id: subscription_id }, // Filter to match the subscription by ID
      {
        $set: {
          subscribe_status,
          initial_date: initialDate,
          end_date: endDate,
          due_date,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Failed to update Gold subscription" });
    }

    // Fetch updated subscription
    const updatedSubscription = await GoldSubscription.findById(subscription_id);

    res.status(200).json({
      message: "Gold subscription updated successfully",
      subscription: updatedSubscription,
      user: {
        id: user._id,
        isVerifiedKyc: user.isVerifiedKyc,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the Gold subscription", error });
  }
};



const updateDiamondSubscription = async (req, res) => {
  try {
    const { subscription_id } = req.params; 
    const { due_date, subscribe_status, isVerifiedKyc } = req.body;

    // Find the subscription by ID
    const subscription = await DiamondSubscription.findById(subscription_id);
    if (!subscription) {
      return res.status(404).json({ message: "Diamond subscription not found" });
    }

    // Extract the user_id from the subscription
    const { user_id } = subscription;

    // Update the subscription details
    const initialDate = moment().toDate();
    const endDate = moment(initialDate).add(11, 'months').toDate();

    const result = await DiamondSubscription.updateOne(
      { _id: subscription_id }, // Filter to match the subscription by ID
      {
        $set: {
          subscribe_status,
          initial_date: initialDate,
          end_date: endDate,
          due_date,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Failed to update Diamond subscription" });
    }

    // Update the user's isVerifiedKyc status if provided in the request
    if (typeof isVerifiedKyc === 'boolean') {
      const userUpdateResult = await User.updateOne(
        { _id: user_id }, // Match the user by ID
        { $set: { isVerifiedKyc } }
      );

      if (userUpdateResult.modifiedCount === 0) {
        return res.status(400).json({ message: "Failed to update user KYC status" });
      }
    }

    // Fetch the updated subscription
    const updatedSubscription = await DiamondSubscription.findById(subscription_id);

    res.status(200).json({
      message: "Diamond subscription updated successfully",
      subscription: updatedSubscription,
      user: {
        user_id,
        isVerifiedKyc,
      },
    });
  } catch (error) {
    console.error("Error updating Diamond subscription:", error);
    res.status(500).json({
      message: "An error occurred while updating the Diamond subscription",
      error: error.message,
    });
  }
};

const getSubscriptionReport = async (req, res) => {
  try {
    // Fetch gold and diamond subscriptions
    const goldSubscriptions = await GoldSubscription.find({});
    const diamondSubscriptions = await DiamondSubscription.find({});

    // Helper function to fetch scheme data
    const fetchSchemeDetails = async (subscriptions) => {
      return Promise.all(
        subscriptions.map(async (subscription) => {
          if (subscription.scheme_id) {
            const scheme = await Scheme.findById(subscription.scheme_id);
            return {
              ...subscription.toObject(),
              schemeDetails: scheme || null,
            };
          }
          return subscription;
        })
      );
    };

    // Fetch scheme details for each subscription
    const goldSubscriptionsWithSchemes = await fetchSchemeDetails(goldSubscriptions);
    const diamondSubscriptionsWithSchemes = await fetchSchemeDetails(diamondSubscriptions);

    const subscriptionReport = {
      gold: goldSubscriptionsWithSchemes,
      diamond: diamondSubscriptionsWithSchemes,
    };

    res.status(200).json({
      message: "Subscription report retrieved successfully",
      data: subscriptionReport,
    });
  } catch (error) {
    console.error("Error fetching subscription report:", error);
    res.status(500).json({
      message: "An error occurred while fetching the subscription report",
      error: error.message,
    });
  }
};


const { getKYC } = require('./UserController'); // Adjust the path to where `getKYC` is defined

const getPendingRequests = async (req, res) => {
  try {
    // Retrieve all pending requests from both subscription models
    const goldPendingRequests = await GoldSubscription.find({ subscribe_status: 'waiting' });
    const diamondPendingRequests = await DiamondSubscription.find({ subscribe_status: 'waiting' });

    // Combine the results from both subscription types
    const allPendingRequests = [...goldPendingRequests, ...diamondPendingRequests];

    // If no pending requests found, return a message
    if (allPendingRequests.length === 0) {
      return res.status(404).json({ message: "No pending requests found" });
    }

    // Retrieve user details and optionally KYC data for each pending request
    const enrichedRequests = await Promise.all(
      allPendingRequests.map(async (request) => {
        try {
          const user = await User.findById(request.user_id);

          if (user) {
            // Initialize user details without KYC data
            const userDetails = { ...user.toObject() };
            delete userDetails.kyc; // Exclude KYC data from user details

            // Check if KYC data exists and fetch it if needed
            if (user.kyc && user.kyc.aadhaar_images && user.kyc.pan_images) {
              // Simulate calling `getKYC` by invoking its logic
              const reqMock = { params: { userId: user._id } };
              const resMock = {
                json: (response) => response,
                status: (statusCode) => ({
                  json: (response) => ({ statusCode, ...response }),
                }),
              };
              const kycResponse = await getKYC(reqMock, resMock);

              // Return the enriched request with KYC data and user details (without KYC)
              return {
                ...request.toObject(),
                userDetails,
                kyc: kycResponse.kyc, // Add KYC data separately
              };
            }

            // If no KYC data, just return user details without KYC
            return {
              ...request.toObject(),
              userDetails,
            };
          }

          return {
            ...request.toObject(),
            userDetails: { message: 'User not found' },
          };
        } catch (err) {
          return {
            ...request.toObject(),
            userDetails: { message: 'Error retrieving user details', error: err.message },
          };
        }
      })
    );

    res.status(200).json({
      message: "Pending requests retrieved successfully",
      data: enrichedRequests,
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({
      message: "An error occurred while fetching the pending requests",
      error: error.message,
    });
  }
};


const getSubscriptionReporUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Check if user_id is provided
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch subscriptions for the specific user
    const goldSubscriptions = await GoldSubscription.find({ user_id });
    const diamondSubscriptions = await DiamondSubscription.find({ user_id });

    // Combine subscription reports
    const subscriptionReport = {
      gold: goldSubscriptions,
      diamond: diamondSubscriptions,
    };

    // Send response
    res.status(200).json({
      message: "Subscription report retrieved successfully",
      data: subscriptionReport,
    });
  } catch (error) {
    console.error("Error fetching subscription report:", error);
    res.status(500).json({
      message: "An error occurred while fetching the subscription report",
      error: error.message,
    });
  }
};

module.exports = { createGoldSubscription, createDiamondSubscription, updateGoldSubscription,updateDiamondSubscription, getSubscriptionReport, getSubscriptionReporUser,getPendingRequests };
