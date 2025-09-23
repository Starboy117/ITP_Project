const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/shopController');

// Define routes for shop items
router.get('/', getAllItems);          // GET all items
router.get('/:id', getItemById);       // GET single item by ID
router.post('/addItem', createItem);          // CREATE new item
router.put('/:id', updateItem);        // UPDATE existing item
router.delete('/:id', deleteItem);     // DELETE item

module.exports = router;