const Rate = require('../models/Rate');

// Get rates
exports.getRates = async (req, res) => {
  try {
    const rates = await Rate.findOne(); // Fetch the single document
    res.status(200).json({
      message: 'Rates retrieved successfully',
      data: rates,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving rates',
      error: error.message,
    });
  }
};

// Create or update rates
exports.createOrUpdateRates = async (req, res) => {
  try {
    const { gold_rate, silver_rate } = req.body;

    if (gold_rate === undefined || silver_rate === undefined) {
      return res.status(400).json({
        message: 'gold_rate and silver_rate are required',
      });
    }

    const updatedRates = await Rate.findOneAndUpdate(
      {},
      { gold_rate, silver_rate, updated_at: new Date() },
      { new: true, upsert: true } // Create if not exists, update otherwise
    );

    res.status(200).json({
      message: 'Rates saved successfully',
      data: updatedRates,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving rates',
      error: error.message,
    });
  }
};

// Delete rates
exports.deleteRates = async (req, res) => {
  try {
    await Rate.deleteMany(); // Deletes the single document in the collection
    res.status(200).json({
      message: 'Rates deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting rates',
      error: error.message,
    });
  }
};
