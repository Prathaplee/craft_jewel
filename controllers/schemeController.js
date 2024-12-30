const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');

// Create a new scheme
exports.createScheme = async (req, res) => {
  try {
    const {
      scheme_name,
      scheme_type,
      min_amount,
      max_amount,
      duration,
      scheme_description,
      is_weight_or_amount,
      min_weight,
      max_weight
    } = req.body;

    // Check if scheme_type exists
    if (!scheme_type || typeof scheme_type !== 'string') {
      return res.status(400).send({ message: 'scheme_type is required and must be a string.' });
    }

    // Normalize and validate `scheme_type`
    const normalizedSchemeType = scheme_type.toLowerCase();
    if (!['diamond', 'gold'].includes(normalizedSchemeType)) {
      return res.status(400).send({ message: 'Invalid scheme_type. Allowed values are diamond or gold.' });
    }

    // Create and save the scheme
    const scheme = new Scheme({
      scheme_name,
      scheme_type: normalizedSchemeType,
      min_amount,
      max_amount,
      duration,
      scheme_description,
      is_weight_or_amount,
      min_weight,
      max_weight
    });

    await scheme.save();
    res.status(201).send(scheme);
  } catch (err) {
    res.status(500).send({ message: 'Error creating scheme', error: err.message });
  }
};


// Get all schemes
exports.getSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.send(schemes);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching schemes', error: err.message });
  }
};

// Get a specific scheme by ID
exports.getScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).send({ message: 'Scheme not found' });
    }
    res.send(scheme);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching scheme', error: err.message });
  }
};

// Update an existing scheme
exports.updateScheme = async (req, res) => {
  try {
    const { scheme_type } = req.body;

    // Validate `scheme_type` if provided
    if (scheme_type && !['diamond', 'gold'].includes(scheme_type)) {
      return res.status(400).send({ message: 'Invalid scheme_type. Allowed values are diamond or gold.' });
    }

    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scheme) {
      return res.status(404).send({ message: 'Scheme not found' });
    }
    res.send(scheme);
  } catch (err) {
    res.status(500).send({ message: 'Error updating scheme', error: err.message });
  }
};

// Delete a scheme by ID
exports.deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) {
      return res.status(404).send({ message: 'Scheme not found' });
    }
    res.send({ message: 'Scheme deleted successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Error deleting scheme', error: err.message });
  }
};
