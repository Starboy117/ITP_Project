const Court = require("../models/courtModel");


async function generateCourtId() {
  const lastCourt = await Court.findOne().sort({ courtId: -1 });
  if (!lastCourt) return "C01";

  const lastNumber = parseInt(lastCourt.courtId.substring(1), 10);
  const newNumber = lastNumber + 1;
  return "C" + String(newNumber).padStart(2, "0");
}


const addCourt = async (req, res) => {
  try {
    const {
      courtName,
      courtType,
      hourlyRate,
      status,
      capacity,
      location,
      description,
      imageUrl,
    } = req.body;


    if (!courtName || String(courtName).trim() === "") {
      return res.status(400).json({ error: "Court name is required." });
    }
    if (!courtType || String(courtType).trim() === "") {
      return res.status(400).json({ error: "Court type is required." });
    }
    if (hourlyRate == null || isNaN(hourlyRate) || Number(hourlyRate) <= 0) {
      return res.status(400).json({ error: "Hourly rate must be a positive number." });
    }
    if (!status || String(status).trim() === "") {
      return res.status(400).json({ error: "Status is required." });
    }
    if (capacity == null || isNaN(capacity) || Number(capacity) <= 0) {
      return res.status(400).json({ error: "Capacity must be a positive number." });
    }
    if (!location || String(location).trim() === "") {
      return res.status(400).json({ error: "Location is required." });
    }
    

   
    const courtId = await generateCourtId();

    const newCourt = new Court({
      courtId,
      courtName,
      courtType,
      hourlyRate,
      status,
      capacity,
      location,
      description,
      imageUrl,
    });

    await newCourt.save();

    res.status(201).json({
      message: "Court added successfully",
      court: newCourt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding court",
      error: error.message,
    });
  }
};

const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.find(); // fetch all courts
    const count = courts.length; // ✅ total number of courts

    res.status(200).json({ count, courts }); // send both count and data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courts", error: err.message });
  }
};


const getActiveCourts = async (req, res) => {
  try {
    // Only include courts NOT under maintenance
    const courts = await Court.find({ status: { $ne: "Maintenance" } }); 
    const activeCount = courts.length;

    res.status(200).json({ activeCount, courts }); // send count and data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courts", error: err.message });
  }
};





const updateCourt = async (req, res) => {
  try {
    const { courtId } = req.params; // from URL
    const data = req.body; // updated fields

    // Use findOneAndUpdate with courtId, not findById
    const updatedCourt = await Court.findOneAndUpdate({ courtId }, data, { new: true });

    if (!updatedCourt) {
      return res.status(404).json({ message: "Court not found" });
    }

    res.status(200).json({
      message: "Court updated successfully",
      court: updatedCourt,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating court", error: error.message });
  }
};



const deleteCourt = async (req, res) => {
  const { id } = req.params; // corrected

  try {
    const deleted = await Court.findOneAndDelete({ courtId: id }); // use courtId
    if (!deleted) {
      return res.status(404).json({ message: "Court not found" });
    }

    res.status(200).json({ message: "Court deleted successfully", court: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting court", error: error.message });
  }
};





module.exports = { addCourt,getAllCourts,updateCourt,deleteCourt,getActiveCourts };

