import React, { useState } from 'react';
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
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <p>Send a request to see the response</p>
        </div>
      </div>
    );
  }

  const statusClass = response.status >= 200 && response.status < 300
    ? 'success'
    : response.status >= 400
      ? 'error'
      : 'warning';

  const formatData = (data) => {
    try {
      // If it's already a string, try to parse it as JSON to format it
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          return JSON.stringify(parsed, null, 2);
        } catch {
          // If it's not valid JSON, return the original string
          return data;
        }
      }
      
      // If it's an object, stringify it with indentation
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  // Format response time to be more readable
  const formatResponseTime = (time) => {
    if (time < 1000) {
      return `${time} ms`;
    } else {
      return `${(time / 1000).toFixed(2)} s`;
    }
  };

  return (
    <div className="response-panel">
      <div className="response-status">
        <div className={`status-code ${statusClass}`}>
          {response.status}
        </div>
        <div className="status-text">
          {response.statusText}
        </div>
        <div className="response-time">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {formatResponseTime(response.time)}
        </div>
      </div>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
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
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
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
      
      <div className="tab-content">
        {activeTab === 'body' && (
          <div className="body-content">
            <pre className="code-block">{formatData(response.data)}</pre>
          </div>
        )}
        
        {activeTab === 'headers' && (
          <div className="headers-content">
            <div className="table-container card">
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
