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

  const getMethodClass = (method) => {
    switch ((method || 'GET').toUpperCase()) {
      case 'GET': return 'method-get';
      case 'POST': return 'method-post';
      case 'PUT': return 'method-put';
      case 'DELETE': return 'method-delete';
      case 'PATCH': return 'method-patch';
      default: return '';
    }
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
            <span className={`folder-icon ${isExpanded ? 'expanded' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
            <span className="folder-name">{item.name}</span>
            <span className="item-count">{item.item.length}</span>
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
    const method = item.request && item.request.method ? item.request.method : 'GET';
    
    return (
      <div 
        key={item.id || item.name} 
        className="collection-request"
        onClick={() => onSelectRequest(item)}
      >
        <div className={`request-method ${getMethodClass(method)}`}>
          {method}
        </div>
        <div className="request-name">{item.name}</div>
      </div>
    );
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <button className="primary-button" onClick={onCreateCollection}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          New Collection
        </button>
        <button className="secondary-button" onClick={onImportClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Import
        </button>
      </div>
      
      <div className="collections-container">
        {collections.length === 0 ? (
          <div className="empty-collections">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>No collections yet</p>
            <p className="hint-text">Create a new collection or import one to get started.</p>
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
                <div className="collection-info">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="collection-name">{collection.info.name}</span>
                </div>
                <button 
                  className="add-request-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddRequest(collection);
                  }}
                  title="Add Request"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
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
