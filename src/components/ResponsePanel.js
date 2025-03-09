import React, { useState } from 'react';
import JSONViewer from './JSONViewer';
import '../styles/ResponsePanel.css';

const ResponsePanel = ({ response, isLoading }) => {
  const [activeTab, setActiveTab] = useState('body');

  if (isLoading) {
    return (
      <div className="response-panel">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Sending request...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="response-panel empty-response">
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <p className="empty-state-title">Request not sent yet</p>
          <p className="empty-state-description">Send a request to see the response</p>
        </div>
      </div>
    );
  }

  const statusClass = response.status >= 200 && response.status < 300
    ? 'success'
    : response.status >= 400
      ? 'error'
      : 'warning';

  // Format response time to be more readable
  const formatResponseTime = (time) => {
    if (time < 1000) {
      return `${time} ms`;
    } else {
      return `${(time / 1000).toFixed(2)} s`;
    }
  };

  // Calculate approximate size of the data
  const calculateSize = () => {
    if (!response?.data) return '0 bytes';
    
    try {
      const jsonStr = JSON.stringify(response.data);
      const bytes = new TextEncoder().encode(jsonStr).length;
      
      if (bytes < 1024) {
        return `${bytes} bytes`;
      } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
      } else {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      }
    } catch (e) {
      return 'unknown size';
    }
  };

  return (
    <div className="response-panel">
      <div className="response-header">
        <div className="response-status">
          <div className={`status-badge ${statusClass}`}>
            {response.status}
          </div>
          <div className="status-text">
            {response.statusText}
          </div>
          <div className="response-meta">
            <div className="response-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {formatResponseTime(response.time)}
            </div>
            <div className="response-size">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              {calculateSize()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="response-tabs">
        <div 
          className={`response-tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          <span className="tab-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
          Body
        </div>
        <div 
          className={`response-tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          <span className="tab-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </span>
          Headers
          <span className="param-count">{Object.keys(response.headers).length}</span>
        </div>
      </div>
      
      <div className="response-content">
        {activeTab === 'body' && (
          <div className="body-content">
            <JSONViewer data={response.data} height="100%" />
          </div>
        )}
        
        {activeTab === 'headers' && (
          <div className="headers-content">
            <div className="headers-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <tr key={key}>
                      <td className="header-name">{key}</td>
                      <td className="header-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsePanel;
