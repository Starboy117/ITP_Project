const ShopItem = require('../models/ShopItem');

// @desc    Get all shop items
// @route   GET /api/shop
// @access  Public
const getAllItems = async (req, res) => {
  try {
    const items = await ShopItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
};

// @desc    Get single shop item by ID
// @route   GET /api/shop/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }
    
    res.status(500).json({ message: 'Server error while fetching item' });
  }
};

// @desc    Create a new shop item
// @route   POST /api/shop
// @access  Public
const createItem = async (req, res) => {
  try {
    const { name, description, price, quantity, category, imageURL } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({ message: 'All fields except imageURL are required' });
    }
    
    // Create new item (status will be auto-calculated by the pre-save middleware)
    const newItem = new ShopItem({
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      imageURL: imageURL || ''
    });
    
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while creating item' });
  }
};

// @desc    Update an existing shop item
// @route   PUT /api/shop/:id
// @access  Public
const updateItem = async (req, res) => {
  try {
    const { name, description, price, quantity, category, imageURL } = req.body;
    
    // Find item by ID
    const item = await ShopItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Update fields
    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = parseFloat(price);
    if (quantity !== undefined) item.quantity = parseInt(quantity);
    if (category !== undefined) item.category = category;
    if (imageURL !== undefined) item.imageURL = imageURL;
    
    // Save the updated item (status will be auto-updated by pre-save middleware)
    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while updating item' });
  }
};

// @desc    Delete a shop item
// @route   DELETE /api/shop/:id
// @access  Public
const deleteItem = async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await ShopItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }
    
    res.status(500).json({ message: 'Server error while deleting item' });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};