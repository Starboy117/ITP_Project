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
    res.status(200).json({ courts }); // send data as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courts", error: err.message });
  }
};

module.exports = { addCourt,getAllCourts };

