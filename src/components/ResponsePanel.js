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
          {response.time} ms
        </div>
      </div>
      
      <div className="response-tabs">
        <div 
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </div>
        <div 
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </div>
      </div>
      
      <div className="tab-content">
        {activeTab === 'body' && (
          <div className="body-content">
            <pre>{formatData(response.data)}</pre>
          </div>
        )}
        
        {activeTab === 'headers' && (
          <div className="headers-content">
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
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsePanel;
