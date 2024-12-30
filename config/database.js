require('dotenv').config(); 
const mongoose = require('mongoose');

const dbName = 'Test_1';  // The name of the database you want to create or use
const mongoUri = process.env.MONGO_URI;  // MongoDB Atlas URI without the database name
if (!mongoUri) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1);  // Exit the process if MONGO_URI is missing
}
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(mongoUri);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.useDb(dbName);
    console.log(`Using database: ${dbName}`);

    // const userSchema = new mongoose.Schema({
    //   username: String,
    //   email: String,
    //   phone_number: String,
    //   referral_code: { type: String, required: false },  // Optional field
    //   role: { type: String, default: 'user' }, 
    //   password: String,
    //   address: {
    //     street: String,
    //     city: String,
    //     state: String,
    //     pincode: String
    //   },
    //   bank_details: {
    //     account_number: String,
    //     ifsc_code: String,
    //     bank_name: String
    //   },
    //   kyc: {
    //     aadhar_image: String,
    //     pan_image: String
    //   }
    // });

    // const schemeSchema = new mongoose.Schema({
    //   scheme_name: { type: String, required: true }, // Ensure scheme name is required
    //   scheme_type: {
    //     type: String,
    //     enum: ['diamond', 'gold'], // Enum to restrict to 'diamond' or 'gold'
    //     required: true // Make scheme_type a required field
    //   },
    //   min_amount: { type: Number, required: true }, // Ensure min_amount is required
    //   max_amount: { type: Number, required: true }, // Ensure max_amount is required
    //   is_weight_or_amount: {
    //     type: String,
    //     enum: ['weight', 'amount'], // Allow only 'weight' or 'amount'
    //     required: false // Optional field
    //   },
    //   min_weight: { type: Number, required: false }, // Optional field
    //   max_weight: { type: Number, required: false }, // Optional field
    //   duration: { type: Number, required: true }, // Ensure duration is required
    //   scheme_description: { type: String, required: false } // Optional field for additional description
    // });

    // const subscriptionSchema = new mongoose.Schema({
    //   user_id: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'User', 
    //     required: true 
    //   },
    //   scheme_id: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Scheme', 
    //     required: true 
    //   },
    //   payment_type: { 
    //     type: String, 
    //     enum: ['weight', 'amount'], 
    //     required: true 
    //   },
    //   amount: { 
    //     type: Number, 
    //     required: function() { 
    //       return this.payment_type === 'amount'; 
    //     },
    //     min: 1 // Minimum value for the amount
    //   },
    //   weight: { 
    //     type: Number, 
    //     required: function() { 
    //       return this.payment_type === 'weight'; 
    //     },
    //     min: 1 // Minimum value for the weight
    //   },
    //   payment_status: { 
    //     type: String, 
    //     enum: ['pending', 'completed'], 
    //     default: 'pending' 
    //   },
    //   initial_date: { 
    //     type: Date, 
    //     required: true 
    //   },
    //   end_date: { 
    //     type: Date, 
    //     required: true 
    //   },
    //   created_at: { 
    //     type: Date, 
    //     default: Date.now 
    //   },
    //   updated_at: { 
    //     type: Date 
    //   }
    // });
    
    // const paymentSchema = new mongoose.Schema({
    //   user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //   scheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' },
    //   payment_date: Date,
    //   amount: Number,
    //   payment_method: String,
    //   payment_status: String
    // });

    // const referralSchema = new mongoose.Schema({
    //   user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //   referred_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //   referral_code: String,
    //   referral_date: Date
    // });

    // const User = db.model('User', userSchema);
    // const Scheme = db.model('Scheme', schemeSchema);
    // const Subscription = db.model('Subscription', subscriptionSchema);
    // const Payment = db.model('Payment', paymentSchema);
    // const Referral = db.model('Referral', referralSchema);

    // async function createCollections() {
    //   try {
    //     await User.createCollection();
    //     await Scheme.createCollection();
    //     await Subscription.createCollection();
    //     await Payment.createCollection();
    //     await Referral.createCollection();
    //     console.log('Collections created successfully in database:', dbName);
    //   } catch (error) {
    //     console.error('Error creating collections:', error);
    //   }
    // }

    // createCollections();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = mongoose;  // Export mongoose connection to be used in app.js
