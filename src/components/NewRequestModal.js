import React, { useState } from 'react';
import '../styles/Modal.css';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

const NewRequestModal = ({ collection, onSave, onClose }) => {
  const [requestName, setRequestName] = useState('');
  const [requestMethod, setRequestMethod] = useState('GET');
  const [requestUrl, setRequestUrl] = useState('');
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!requestName.trim()) {
      setError('Request name is required');
      return;
    }

    if (!requestUrl.trim()) {
      setError('URL is required');
      return;
    }

    // Create a new request object with Postman compatible structure
    const newRequest = {
      id: generateUniqueId(),
      name: requestName.trim(),
      request: {
        method: requestMethod,
        header: [],
        url: requestUrl.trim(),
        body: {
          mode: "raw",
          raw: ""
        }
      },
      response: []
    };

    onSave(newRequest);
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
          <h2>Create New Request in {collection.info.name}</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="requestName">Request Name *</label>
            <input
              type="text"
              id="requestName"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Enter request name"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group method-select">
              <label htmlFor="requestMethod">Method</label>
              <select
                id="requestMethod"
                value={requestMethod}
                onChange={(e) => setRequestMethod(e.target.value)}
              >
                {HTTP_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group url-input">
              <label htmlFor="requestUrl">URL *</label>
              <input
                type="text"
                id="requestUrl"
                value={requestUrl}
                onChange={(e) => setRequestUrl(e.target.value)}
                placeholder="https://example.com/api"
              />
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="modal-actions">
            <button className="cancel-button" onClick={onClose}>Cancel</button>
            <button className="save-button" onClick={handleSave}>Create Request</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequestModal;
