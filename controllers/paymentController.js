const Razorpay = require('razorpay');
const { GoldSubscription, DiamondSubscription } = require('../models/Subscription');
const Scheme = require('../models/Scheme'); // Import the Scheme model

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Function to create Gold Payment Order
exports.createGoldPaymentOrder = async (req, res) => {
  const { subscription_id, amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // Convert to the smallest currency unit
      currency: 'INR',
      receipt: `receipt_${subscription_id}`,
      notes: { subscription_id },
    };

    // Create the Razorpay order
    const order = await razorpayInstance.orders.create(options);

    const subscription = await GoldSubscription.findById(subscription_id)
      .populate({
        path: 'scheme_id',
        select: 'scheme_type',
      });

    if (!subscription) {
      return res.status(404).json({ message: 'Gold Subscription not found' });
    }

    const updatedSubscription = await GoldSubscription.findById(subscription_id);
    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found in the model' });
    }

    // Update subscription with payment details
    updatedSubscription.payments.push({
      payment_amount: amount,
      payment_status: 'pending',
      payment_method: 'razorpay',
      razorpay_order_id: order.id,
    });

    updatedSubscription.updated_at = new Date();
    await updatedSubscription.save();

    res.json({
      message: 'Gold Payment order created successfully',
      order_id: order.id,
      currency: order.currency,
      amount: order.amount,
      order_receipt: order.receipt,
    });
  } catch (error) {
    console.error('Error creating Razorpay order for Gold:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to create Diamond Payment Order
exports.createDiamondPaymentOrder = async (req, res) => {
  const { subscription_id, amount, weight } = req.body;

  try {
    const options = {
      amount: amount * 100, // Convert to the smallest currency unit
      currency: 'INR',
      receipt: `receipt_${subscription_id}`,
      notes: { subscription_id },
    };

    // Create the Razorpay order
    const order = await razorpayInstance.orders.create(options);

    const subscription = await DiamondSubscription.findById(subscription_id)
      .populate({
        path: 'scheme_id',
        select: 'scheme_type',
      });

    if (!subscription) {
      return res.status(404).json({ message: 'Diamond Subscription not found' });
    }

    const updatedSubscription = await DiamondSubscription.findById(subscription_id);
    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found in the model' });
    }

    // Update subscription with payment details
    updatedSubscription.payments.push({
      payment_amount: amount,
      payment_status: 'pending',
      payment_method: 'razorpay',
      razorpay_order_id: order.id,
      weight: weight, // Store the weight for Diamond subscription
    });

    updatedSubscription.updated_at = new Date();
    await updatedSubscription.save();

    res.json({
      message: 'Diamond Payment order created successfully',
      order_id: order.id,
      currency: order.currency,
      amount: order.amount,
      order_receipt: order.receipt,
    });
  } catch (error) {
    console.error('Error creating Razorpay order for Diamond:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Verify Razorpay payment and update subscription status
// Verify Razorpay payment and update subscription status
exports.verifyPayment = async (req, res) => {
  const { subscription_id, payment_id, order_id, signature } = req.body;

  try {
    const subscription = await GoldSubscription.findById(subscription_id)
      .populate({
        path: 'scheme_id',
        select: 'scheme_type',
      });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const { scheme_type } = subscription.scheme_id;
    const SubscriptionModel = scheme_type === 'gold' ? GoldSubscription : DiamondSubscription;

    const updatedSubscription = await SubscriptionModel.findById(subscription_id);

    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found in the model' });
    }

    // Verify the signature
    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Payment is verified
    updatedSubscription.payments.push({
      payment_amount: updatedSubscription.amount,
      payment_status: 'completed',
      payment_method: 'razorpay',
      razorpay_order_id: order_id,
      razorpay_payment_id: payment_id,
      razorpay_signature: signature,
    });

    // Update the subscription status
    updatedSubscription.subscribe_status = 'active'; // Set status to active after payment
    updatedSubscription.updated_at = new Date();

    await updatedSubscription.save();

    res.json({
      message: 'Payment verified successfully',
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
