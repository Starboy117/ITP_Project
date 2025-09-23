const Equipment = require("../models/equipmentModel");

// @desc Get all equipment
exports.getEquipments = async (req, res) => {
  try {
    console.log('Fetching all equipment');
    const equipments = await Equipment.find();
    console.log(`Found ${equipments.length} equipment items`);
    return res.json(equipments);
  } catch (err) {
    console.error("Error fetching equipment:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// @desc Add new equipment
exports.addEquipment = async (req, res) => {
  try {
    console.log('Adding equipment - Body:', req.body);
    console.log('File:', req.file);

    const { name, category, description, status, purchaseDate, lastMaintenance } = req.body;

    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      console.log('Image URL:', imageUrl);
    }

    const newEquipment = new Equipment({
      name,
      category,
      description,
      status,
      purchaseDate,
      lastMaintenance,
      imageUrl,
    });

    const savedEquipment = await newEquipment.save();
    console.log('Equipment saved:', savedEquipment._id);
    
    return res.status(201).json(savedEquipment);
  } catch (err) {
    console.error("Error adding equipment:", err.message);
    return res.status(400).json({ message: err.message });
  }
};

// @desc Update equipment
exports.updateEquipment = async (req, res) => {
  try {
    console.log('Updating equipment:', req.params.id);
    console.log('Update data:', req.body);
    console.log('File:', req.file);

    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await Equipment.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updated) {
      console.log('Equipment not found:', req.params.id);
      return res.status(404).json({ message: "Equipment not found" });
    }

    console.log('Equipment updated successfully');
    return res.json(updated);
  } catch (err) {
    console.error("Error updating equipment:", err.message);
    return res.status(400).json({ message: err.message });
  }
};

// @desc Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    console.log('Deleting equipment:', req.params.id);
    
    const deleted = await Equipment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      console.log('Equipment not found for deletion:', req.params.id);
      return res.status(404).json({ message: "Equipment not found" });
    }

    console.log('Equipment deleted successfully');
    return res.json({ message: "Equipment removed" });
  } catch (err) {
    console.error("Error deleting equipment:", err.message);
    return res.status(500).json({ message: err.message });
  }
};