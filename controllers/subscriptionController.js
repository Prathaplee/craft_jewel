const { GoldSubscription } = require('../models/Subscription');
const { DiamondSubscription } = require('../models/Subscription');
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const moment = require('moment');
const Rate = require('../models/Rate');
const createGoldSubscription = async (req, res) => {
  try {
    const { user_id, scheme_id, payment_type, amount, weight } = req.body;
    
    // Fetch the user from the database
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // Ensure KYC is completed
    if (!user.kyc || !user.kyc.aadhar_image || !user.kyc.pan_image) {
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
      payment_type,
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
    const { user_id, scheme_id, payment_type, initial_amount} = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.kyc || !user.kyc.aadhar_image || !user.kyc.pan_image) {
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
      payment_type,
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
    const { due_date, subscribe_status } = req.body;

    const subscription = await GoldSubscription.findById(subscription_id);
    if (!subscription) {
      return res.status(400).json({ message: "Gold subscription not found" });
    }
    
    const initialDate = moment().toDate();
    const endDate = moment(initialDate).add(11, 'months').toDate();
    const result = await GoldSubscription.updateOne(
      { _id: subscription_id }, // Filter to match the subscription by ID
      {
        $set: {
          subscribe_status,
          initial_date: initialDate,
          end_date: endDate,
          due_date
        }
      }
    );
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Failed to update Gold subscription" });
    }
    const updatedSubscription = await GoldSubscription.findById(subscription_id);
    res.status(200).json({ message: "Gold subscription updated successfully", subscription: updatedSubscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the Gold subscription", error });
  }
};



const updateDiamondSubscription = async (req, res) => {
  try {
    const { subscription_id } = req.params; 
    const { due_date, subscribe_status } = req.body;

    const subscription = await DiamondSubscription.findById(subscription_id);
    if (!subscription) {
      return res.status(404).json({ message: "Diamond subscription not found" });
    }

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
    const updatedSubscription = await DiamondSubscription.findById(subscription_id);
    res.status(200).json({
      message: "Diamond subscription updated successfully",
      subscription: updatedSubscription,
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
    const goldSubscriptions = await GoldSubscription.find({});
    const diamondSubscriptions = await DiamondSubscription.find({});
    const subscriptionReport = {
      gold: goldSubscriptions,
      diamond: diamondSubscriptions,
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

module.exports = { createGoldSubscription, createDiamondSubscription, updateGoldSubscription,updateDiamondSubscription, getSubscriptionReport, getSubscriptionReporUser };
