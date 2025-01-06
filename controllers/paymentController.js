const Razorpay = require('razorpay');
const { GoldSubscription, DiamondSubscription } = require('../models/Subscription');
const Scheme = require('../models/Scheme'); // Import the Scheme model

// Razorpay instance initialization
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

exports.createGoldPaymentOrder = async (req, res) => {
  const { subscription_id, amount } = req.body;

  try {
    // Step 1: Find the subscription in the database
    const subscription = await GoldSubscription.findById(subscription_id);
    if (!subscription) {
      return res.status(404).json({ message: 'Gold Subscription not found' });
    }

    // Step 2: Validate the scheme type
    const scheme = await Scheme.findById(subscription.scheme_id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found for the subscription' });
    }

    if (scheme.scheme_type !== 'gold') {
      return res.status(400).json({
        message: `Invalid subscription type. Expected 'gold', received '${scheme.scheme_type}'.`,
      });
    }

    // Step 3: Prepare the Razorpay order options
    const options = {
      amount: amount * 100, // Convert to the smallest currency unit
      currency: 'INR',
      receipt: `receipt_${subscription_id}`,
      notes: { subscription_id },
    };

    // Step 4: Create the Razorpay order
    const order = await razorpayInstance.orders.create(options);

    // Step 5: Update the subscription with payment details
    subscription.payments.push({
      payment_amount: amount,
      payment_status: 'pending',
      payment_method: 'razorpay',
      razorpay_order_id: order.id,
    });

    subscription.updated_at = new Date();
    await subscription.save();

    // Step 6: Send the response with Razorpay order details and subscription details
    res.json({
      message: 'Gold Payment order created successfully',
      razorpay_response: order, // Full Razorpay order response
      subscription_id,
      currency: order.currency,
      amount: order.amount / 100, // Convert back to the original amount
      order_receipt: order.receipt,
      scheme_type: scheme.scheme_type, // Send the scheme_type in the response
    });

  } catch (error) {
    // Step 7: Handle errors
    console.error('Error creating Razorpay order for Gold:', error);

    // If the error is related to Razorpay, provide specific error message
    if (error.response) {
      return res.status(error.response.statusCode).json({
        message: error.response.error.description || 'Error in Razorpay API call',
      });
    }

    // Generic error message
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to create Diamond Payment Order
exports.createDiamondPaymentOrder = async (req, res) => {
  const { subscription_id, amount, weight } = req.body;

  try {
    // Step 1: Prepare the Razorpay order options
    const options = {
      amount: amount * 100, // Convert to the smallest currency unit
      currency: 'INR',
      receipt: `receipt_${subscription_id}`,
      notes: { subscription_id },
    };

    // Step 2: Create the Razorpay order
    const order = await razorpayInstance.orders.create(options);

    // Step 3: Find the subscription in the database
    const subscription = await DiamondSubscription.findById(subscription_id);

    // Check if the subscription exists
    if (!subscription) {
      return res.status(404).json({ message: 'Diamond Subscription not found' });
    }

    // Fetch the scheme and validate its type
    const scheme = await Scheme.findById(subscription.scheme_id);
    if (!scheme || scheme.scheme_type !== 'diamond') {
      return res.status(400).json({ message: 'Invalid scheme type for Diamond Subscription' });
    }

    // Step 4: Update the subscription with payment details
    subscription.payments.push({
      payment_amount: amount,
      payment_status: 'pending',
      payment_method: 'razorpay',
      razorpay_order_id: order.id,
      weight: weight, // Store the weight for Diamond subscription
    });

    subscription.updated_at = new Date();
    await subscription.save();

    // Step 5: Send the response with Razorpay order details and subscription details
    res.json({
      message: 'Diamond Payment order created successfully',
      razorpay_response: order, // Full Razorpay order response
      subscription_id,
      currency: order.currency,
      amount: order.amount / 100, // Convert back to the original amount
      order_receipt: order.receipt,
      scheme_type: scheme.scheme_type, // Send the scheme_type in the response
    });

  } catch (error) {
    // Step 6: Handle errors
    console.error('Error creating Razorpay order for Diamond:', error);

    // If the error is related to Razorpay, provide specific error message
    if (error.response) {
      return res.status(error.response.statusCode).json({
        message: error.response.error.description || 'Error in Razorpay API call',
      });
    }

    // Generic error message
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// // Verify Razorpay payment and update subscription status
// exports.verifyPayment = async (req, res) => {
//   const { subscription_id, payment_id, order_id, signature } = req.body;

//   try {
//     const subscription = await GoldSubscription.findById(subscription_id)
//       .populate({
//         path: 'scheme_id',
//         select: 'scheme_type',
//       });

//     if (!subscription) {
//       return res.status(404).json({ message: 'Subscription not found' });
//     }

//     const { scheme_type } = subscription.scheme_id;
//     const SubscriptionModel = scheme_type === 'gold' ? GoldSubscription : DiamondSubscription;

//     const updatedSubscription = await SubscriptionModel.findById(subscription_id);

//     if (!updatedSubscription) {
//       return res.status(404).json({ message: 'Subscription not found in the model' });
//     }

//     // Verify the signature
//     const body = order_id + "|" + payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     if (expectedSignature !== signature) {
//       return res.status(400).json({ message: 'Payment verification failed' });
//     }

//     // Payment is verified
//     updatedSubscription.payments.push({
//       payment_amount: updatedSubscription.amount,
//       payment_status: 'completed',
//       payment_method: 'razorpay',
//       razorpay_order_id: order_id,
//       razorpay_payment_id: payment_id,
//       razorpay_signature: signature,
//     });

//     // Update the subscription status
//     updatedSubscription.subscribe_status = 'active'; // Set status to active after payment
//     updatedSubscription.updated_at = new Date();

//     await updatedSubscription.save();

//     res.json({
//       message: 'Payment verified successfully',
//       subscription: updatedSubscription,
//     });
//   } catch (error) {
//     console.error('Error verifying Razorpay payment:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
exports.verifyPayment = async (req, res) => {
  const { subscription_id, payment_id, order_id, signature } = req.body;

  try {
    // Step 1: Find the subscription by ID
    const subscription = await GoldSubscription.findById(subscription_id)
      .populate({
        path: 'scheme_id',
        select: 'scheme_type',
      });

    // Step 2: Handle if the subscription is not found
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Step 3: Retrieve the scheme_type from the populated scheme_id
    const { scheme_type } = subscription.scheme_id;
    const SubscriptionModel = scheme_type === 'gold' ? GoldSubscription : DiamondSubscription;

    // Step 4: Find the updated subscription in the correct model
    const updatedSubscription = await SubscriptionModel.findById(subscription_id);

    // Step 5: Handle if the updated subscription is not found
    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found in the model' });
    }

    // Step 6: Verify the Razorpay signature
    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Step 7: Verify if the amount is correct (you should have the amount from Razorpay order)
    if (updatedSubscription.amount !== parseFloat(req.body.amount)) {
      return res.status(400).json({ message: 'Amount mismatch' });
    }

    // Step 8: Update the subscription with payment details
    updatedSubscription.payments.push({
      payment_amount: updatedSubscription.amount,
      payment_status: 'completed',
      payment_method: 'razorpay',
      razorpay_order_id: order_id,
      razorpay_payment_id: payment_id,
      razorpay_signature: signature,
    });

    // Step 9: Update the subscription status to 'active'
    updatedSubscription.subscribe_status = 'active'; // Set status to active after payment
    updatedSubscription.updated_at = new Date();

    // Step 10: Save the updated subscription
    await updatedSubscription.save();

    // Step 11: Send response with success message
    res.json({
      message: 'Payment verified successfully',
      subscription: updatedSubscription,
    });
  } catch (error) {
    // Step 12: Handle errors
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};