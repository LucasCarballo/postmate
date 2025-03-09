import React, { useState } from 'react';
import '../styles/Modal.css';

const NewCollectionModal = ({ onSave, onClose }) => {
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!collectionName.trim()) {
      setError('Collection name is required');
      return;
    }

    // Create a new collection object with Postman compatible structure
    const newCollection = {
      info: {
        _postman_id: generateUniqueId(),
        name: collectionName.trim(),
        description: collectionDescription.trim(),
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: []
    };

    onSave(newCollection);
  };

  // Generate a unique ID similar to Postman's format
  const generateUniqueId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Create New Collection</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="collectionName">Collection Name *</label>
            <input
              type="text"
              id="collectionName"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Enter collection name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="collectionDescription">Description</label>
            <textarea
              id="collectionDescription"
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
              placeholder="Enter collection description"
              rows={4}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="modal-actions">
            <button className="cancel-button" onClick={onClose}>Cancel</button>
            <button className="save-button" onClick={handleSave}>Create Collection</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCollectionModal;
