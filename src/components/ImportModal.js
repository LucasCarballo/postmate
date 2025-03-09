import React, { useState } from 'react';
import '../styles/ImportModal.css';

const { ipcRenderer } = window.require('electron');

const ImportModal = ({ onImport, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImportClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ipcRenderer.invoke('import-collection');
      
      if (!result.success) {
        setError(result.message || 'Failed to import collection');
        return;
      }
      
      onImport(result.data);
    } catch (err) {
      setError(`Error importing collection: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="import-modal">
        <div className="modal-header">
          <h2>Import Collection</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <p>Import a Postman collection from a JSON file.</p>
          
          <button 
            className="import-file-button" 
            onClick={handleImportClick}
            disabled={isLoading}
          >
            {isLoading ? 'Importing...' : 'Select File'}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
