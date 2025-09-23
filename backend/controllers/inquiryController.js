const Inquiry = require("../models/InquiryModel");

// ✅ Get all inquiries
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    return res.status(200).json({ inquiries }); // always 200, even empty
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get inquiry by ID
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    return res.status(200).json({ inquiry });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Unable to fetch inquiry", error: err.message });
  }
};

// ✅ Add new inquiry
const addInquiry = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const inquiry = new Inquiry({ name, email, message });
    const saved = await inquiry.save();
    return res.status(201).json({ inquiry: saved });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", error: err.message });
    }
    return res
      .status(500)
      .json({ message: "Unable to add inquiry", error: err.message });
  }
};

// ✅ Update inquiry
const updateInquiry = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { name, email, message },
      { new: true, runValidators: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    return res.status(200).json({ inquiry });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", error: err.message });
    }
    return res
      .status(500)
      .json({ message: "Unable to update inquiry", error: err.message });
  }
};

// ✅ Delete inquiry
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    return res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Unable to delete inquiry", error: err.message });
  }
};

module.exports = {
  getAllInquiries,
  getInquiryById,
  addInquiry,
  updateInquiry,
  deleteInquiry,
};
