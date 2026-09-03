const OldCloth = require("../models/oldCloth.model");

// ======================================================
// UPLOAD OLD CLOTH
// ======================================================
const uploadOldCloth = async (req, res) => {
  try {

    const clothData = {
      ...req.body,
      seller: req.user._id,
    };

    const cloth = await OldCloth.create(clothData);

    res.status(201).json({
      success: true,
      message: "Old cloth uploaded successfully",
      cloth,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// GET ALL OLD CLOTHS
// ======================================================
const getAllOldCloths = async (req, res) => {
  try {

    const cloths = await OldCloth.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      cloths,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// GET SINGLE OLD CLOTH
// ======================================================
const getSingleOldCloth = async (req, res) => {
  try {

    const cloth = await OldCloth.findById(req.params.id);

    if (!cloth) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      cloth,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// DELETE OLD CLOTH
// ======================================================
const deleteOldCloth = async (req, res) => {
  try {

    await OldCloth.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  uploadOldCloth,
  getAllOldCloths,
  getSingleOldCloth,
  deleteOldCloth,
};