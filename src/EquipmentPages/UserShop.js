import React, { useState, useEffect } from 'react';
import './UserShop.css';
import badminton from '../EquipmentPages/images/badminton.jpg';
import bag from '../EquipmentPages/images/bag.jpg';
import band from '../EquipmentPages/images/band.jpg';
import basket from '../EquipmentPages/images/basket.webp';
import cones from '../EquipmentPages/images/cones.jpg';
import handbands from '../EquipmentPages/images/handbands.jpg';
import socks from '../EquipmentPages/images/socks.jpg';
import shorts from '../EquipmentPages/images/shorts.jpeg';
import waterbottle from '../EquipmentPages/images/waterbottle.webp';
import yogamat from '../EquipmentPages/images/yogamat.jpg';
import tennis from '../EquipmentPages/images/tennis.jpeg';



const UserShop = () => {
  // State management
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Dummy data with placeholder images
  const dummyData = [
    {
      id: 1,
      name: 'Premium Basketball',
      description: 'Official size and weight basketball with superior grip for indoor/outdoor play',
      price: 49.99,
      stockStatus: 'In Stock',
      category: 'Sports Equipment',
      imageURL: basket
    },
    {
      id: 2,
      name: 'Running Shorts',
      description: 'Lightweight, breathable running shorts with moisture-wicking technology',
      price: 29.99,
      stockStatus: 'In Stock',
      category: 'Apparel',
      imageURL: shorts
    },
    {
      id: 3,
      name: 'Yoga Mat',
      description: 'Eco-friendly non-slip yoga mat with carrying strap (6mm thickness)',
      price: 34.99,
      stockStatus: 'Low Stock',
      category: 'Fitness',
      imageURL: yogamat
    },
    {
      id: 4,
      name: 'Tennis Racket',
      description: 'Professional-grade tennis racket with carbon fiber construction',
      price: 189.99,
      stockStatus: 'Out of Stock',
      category: 'Sports Equipment',
      imageURL: tennis
    },
    {
      id: 5,
      name: 'Sports Water Bottle',
      description: 'Premium BPA-free water bottle with sports cap (750ml capacity)',
      price: 15.99,
      stockStatus: 'In Stock',
      category: 'Accessories',
      imageURL: waterbottle
    },
    {
      id: 6,
      name: 'Training Cones (Set of 10)',
      description: 'Bright orange training cones for sports drills and agility training',
      price: 19.99,
      stockStatus: 'In Stock',
      category: 'Training',
      imageURL: cones
    },
    {
      id: 7,
      name: 'Compression Socks',
      description: 'Performance compression socks for athletic recovery and support',
      price: 19.99,
      stockStatus: 'Low Stock',
      category: 'Apparel',
      imageURL: socks
    },
    {
      id: 8,
      name: 'Gym Bag',
      description: 'Spacious gym bag with separate compartments for shoes and wet items',
      price: 39.99,
      stockStatus: 'In Stock',
      category: 'Accessories',
      imageURL: bag
    },
    {
      id: 9,
      name: 'Resistance Bands Set',
      description: 'Set of 5 resistance bands with handles and door anchor',
      price: 39.99,
      stockStatus: 'In Stock',
      category: 'Fitness',
      imageURL: band
    },
    {
      id: 10,
      name: 'Sports Headbands (Pack of 3)',
      description: 'Moisture-wicking headbands for intense workouts in various colors',
      price: 12.99,
      stockStatus: 'In Stock',
      category: 'Accessories',
      imageURL: handbands
    }
  ];

  // Get unique categories and statuses for filters
  const categories = ['All', ...new Set(dummyData.map(item => item.category))];
  const statuses = ['All', ...new Set(dummyData.map(item => item.stockStatus))];

  // Load dummy data on component mount
  useEffect(() => {
    setItems(dummyData);
    setFilteredItems(dummyData);
  }, []);

  // Handle filtering
  useEffect(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || item.stockStatus === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, items]);

  // Toggle wishlist item
  const toggleWishlist = (itemId) => {
    if (wishlist.includes(itemId)) {
      setWishlist(wishlist.filter(id => id !== itemId));
    } else {
      setWishlist([...wishlist, itemId]);
    }
  };

  // Open item details modal
  const openItemModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    let className = 'status-badge ';
    switch(status) {
      case 'In Stock':
        className += 'in-stock';
        break;
      case 'Low Stock':
        className += 'low-stock';
        break;
      case 'Out of Stock':
        className += 'out-of-stock';
        break;
      default:
        className += 'in-stock';
    }
    return <span className={className}>{status}</span>;
  };

  // Shop Item Card Component
  const ShopItemCard = ({ item }) => {
    const isInWishlist = wishlist.includes(item.id);
    const isOutOfStock = item.stockStatus === 'Out of Stock';

    return (
      <div className={`shop-item-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
        {isOutOfStock && <div className="out-of-stock-overlay">Out of Stock</div>}
        
        <div className="card-image" onClick={() => openItemModal(item)}>
          <img src={item.imageURL} alt={item.name} />
          <div className="card-overlay">
            <span className="view-details-btn">Quick View</span>
          </div>
        </div>
        
        <div className="card-content">
          <div className="card-header">
            <h3 className="item-name">{item.name}</h3>
            <button 
              className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
              onClick={() => toggleWishlist(item.id)}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              ♥
            </button>
          </div>
          
          <p className="item-description">{item.description}</p>
          
          <div className="item-category">{item.category}</div>
          
          <div className="item-footer">
            <div className="item-price">${item.price.toFixed(2)}</div>
            <div className="item-status">{renderStatusBadge(item.stockStatus)}</div>
          </div>
          
          <div className="item-actions">
            <button 
              className="btn btn-primary add-to-cart-btn"
              disabled={isOutOfStock}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="user-shop-page">
      <div className="page-header">
        <h1>Sports Complex Shop</h1>
        <p>Quality gear and apparel for your athletic needs</p>
      </div>

      {/* Search and Filter Section */}
      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Showing {filteredItems.length} of {items.length} products
        {wishlist.length > 0 && (
          <span className="wishlist-count"> • {wishlist.length} items in your wishlist</span>
        )}
      </div>

      {/* Shop Items Grid */}
      <div className="shop-items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ShopItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      {isModalOpen && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedItem.name}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedItem.imageURL} alt={selectedItem.name} />
                <div className="image-status">
                  {renderStatusBadge(selectedItem.stockStatus)}
                </div>
              </div>
              
              <div className="modal-details">
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{selectedItem.category}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value price">${selectedItem.price.toFixed(2)}</span>
                </div>
                
                <div className="detail-row full-width">
                  <span className="detail-label">Description:</span>
                  <p className="detail-description">{selectedItem.description}</p>
                </div>
                
                <div className="modal-actions">
                  <button 
                    className={`wishlist-btn ${wishlist.includes(selectedItem.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(selectedItem.id)}
                  >
                    {wishlist.includes(selectedItem.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                  
                  <button 
                    className="btn btn-primary add-to-cart-btn"
                    disabled={selectedItem.stockStatus === 'Out of Stock'}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserShop;