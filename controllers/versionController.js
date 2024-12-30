const AppVersion = require('../models/Version');

// Get version details
exports.getVersion = async (req, res) => {
  try {
    const appVersion = await AppVersion.findOne();
    if (!appVersion) {
      return res.status(404).json({ message: 'Version information not found' });
    }

    res.status(200).json({
      message: 'Version information retrieved successfully',
      data: appVersion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving version information',
      error: error.message,
    });
  }
};

// Set or update version details
exports.setVersion = async (req, res) => {
  try {
    const { current_version, mandatory_version } = req.body;

    if (!current_version || !mandatory_version) {
      return res.status(400).json({
        message: 'Both current_version and mandatory_version are required',
      });
    }

    const updatedVersion = await AppVersion.findOneAndUpdate(
      {},
      { current_version, mandatory_version, updated_at: new Date() },
      { new: true, upsert: true } // Create if not exists, update otherwise
    );

    res.status(200).json({
      message: 'Version information updated successfully',
      data: updatedVersion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while updating version information',
      error: error.message,
    });
  }
};

// Check app version for updates
exports.checkUpdate = async (req, res) => {
  try {
    const { version } = req.query;

    if (!version) {
      return res.status(400).json({
        message: 'Version is required',
      });
    }

    const appVersion = await AppVersion.findOne();
    if (!appVersion) {
      return res.status(404).json({ message: 'Version information not found' });
    }

    const isMandatoryUpdate = version < appVersion.mandatory_version;
    const isOptionalUpdate = version < appVersion.current_version;

    res.status(200).json({
      message: 'Update check completed',
      update: {
        isMandatory: isMandatoryUpdate,
        isOptional: isOptionalUpdate && !isMandatoryUpdate,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while checking for updates',
      error: error.message,
    });
  }
};
