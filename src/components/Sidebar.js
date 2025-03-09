import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ collections, onSelectRequest, onImportClick, onCreateCollection, onCreateRequest }) => {
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCollectionClick = (collectionId) => {
    setSelectedCollectionId(collectionId === selectedCollectionId ? null : collectionId);
  };

  const handleAddRequest = (collection) => {
    onCreateRequest(collection);
  };

  const renderCollectionItem = (item, path = []) => {
    const currentPath = [...path, item.name || item.id];
    
    // If it's a folder (item group)
    if (item.item && Array.isArray(item.item)) {
      const isExpanded = expandedFolders[item.id] !== false;
      
      return (
        <div key={item.id} className="collection-folder">
          <div 
            className="folder-header" 
            onClick={() => toggleFolder(item.id)}
          >
            <span className={`folder-icon ${isExpanded ? 'expanded' : ''}`}>▶</span>
            <span className="folder-name">{item.name}</span>
          </div>
          
          {isExpanded && (
            <div className="folder-content">
              {item.item.map(subItem => renderCollectionItem(subItem, currentPath))}
            </div>
          )}
        </div>
      );
    }
    
    // If it's a request
    return (
      <div 
        key={item.id || item.name} 
        className="collection-request"
        onClick={() => onSelectRequest(item)}
      >
        <div className="request-method">
          {(item.request && item.request.method) ? item.request.method : 'GET'}
        </div>
        <div className="request-name">{item.name}</div>
      </div>
    );
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <button className="primary-button" onClick={onCreateCollection}>
          New Collection
        </button>
        <button className="secondary-button" onClick={onImportClick}>
          Import Collection
        </button>
      </div>
      
      <div className="collections-container">
        {collections.length === 0 ? (
          <div className="empty-collections">
            <p>No collections yet.</p>
            <p>Create a new collection or import one to get started.</p>
          </div>
        ) : (
          collections.map(collection => (
            <div 
              key={collection.info.id || collection.info._postman_id} 
              className={`collection ${(collection.info.id || collection.info._postman_id) === selectedCollectionId ? 'selected' : ''}`}
            >
              <div 
                className="collection-header"
                onClick={() => handleCollectionClick(collection.info.id || collection.info._postman_id)}
              >
                <span className="collection-name">{collection.info.name}</span>
                <button 
                  className="add-request-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddRequest(collection);
                  }}
                  title="Add Request"
                >
                  +
                </button>
              </div>
              
              <div className="collection-items">
                {collection.item.map(item => renderCollectionItem(item))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
