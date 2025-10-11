import React, { useState, useEffect } from 'react';
import './EquipmentDetails.css';

const EquipmentDetails = () => {
  // State management
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState(['All']);
  const [statuses, setStatuses] = useState(['All']);

  // Fetch equipment data from backend
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/equipments");
        if (!response.ok) {
          throw new Error('Failed to fetch equipment data');
        }
        const data = await response.json();
        setEquipment(data);
        setFilteredEquipment(data);
        
        // Extract unique categories and statuses from the fetched data
        const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
        const uniqueStatuses = ['All', ...new Set(data.map(item => item.status))];
        
        setCategories(uniqueCategories);
        setStatuses(uniqueStatuses);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEquipment();
  }, []);

  // Handle filtering
  useEffect(() => {
    let filtered = equipment.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredEquipment(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, equipment]);

  // Open equipment details modal
  const openDetailsModal = (equipment) => {
    setSelectedEquipment(equipment);
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
      case 'Available':
        className += 'available';
        break;
      case 'In Use':
        className += 'in-use';
        break;
      case 'Damaged':
        className += 'damaged';
        break;
      case 'Under Maintenance':
        className += 'under-maintenance';
        break;
      default:
        className += 'available';
    }
    return <span className={className}>{status}</span>;
  };

  // Equipment Card Component
  const EquipmentCard = ({ equipment }) => {
    return (
      <div className="equipment-card" onClick={() => openDetailsModal(equipment)}>
        <div className="card-image">
          <img src={equipment.imageURL || 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Equipment'} alt={equipment.name} />
          <div className="card-overlay">
            <span className="view-details-btn">View Details</span>
          </div>
        </div>
        <div className="card-content">
          <h3 className="equipment-name">{equipment.name}</h3>
          <div className="equipment-category">{equipment.category}</div>
          <div className="equipment-details">
            <div className="equipment-status">
              {renderStatusBadge(equipment.status)}
            </div>
            <div className="purchase-date">
              Purchased: {new Date(equipment.purchaseDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="equipment-details-page">
      <div className="page-header">
        <h1>Equipment Catalog</h1>
        <p>Browse our collection of sports equipment</p>
      </div>

      {/* Search and Filter Section */}
      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search equipment by name or category..."
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
        Showing {filteredEquipment.length} of {equipment.length} equipment items
      </div>

      {/* Equipment Grid */}
      <div className="equipment-grid">
        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item) => (
            <EquipmentCard key={item._id} equipment={item} />
          ))
        ) : (
          <div className="no-results">
            <h3>No equipment found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Equipment Details Modal */}
      {isModalOpen && selectedEquipment && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEquipment.name}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedEquipment.imageURL || 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Equipment'} alt={selectedEquipment.name} />
                <div className="image-status">
                  {renderStatusBadge(selectedEquipment.status)}
                </div>
              </div>
              
              <div className="modal-details">
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{selectedEquipment.category}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Purchase Date:</span>
                  <span className="detail-value">
                    {new Date(selectedEquipment.purchaseDate).toLocaleDateString()}
                  </span>
                </div>
                
                {selectedEquipment.lastMaintenance && (
                  <div className="detail-row">
                    <span className="detail-label">Last Maintenance:</span>
                    <span className="detail-value">
                      {new Date(selectedEquipment.lastMaintenance).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className="detail-row full-width">
                  <span className="detail-label">Description:</span>
                  <p className="detail-description">
                    {selectedEquipment.description || 'No description available.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetails;