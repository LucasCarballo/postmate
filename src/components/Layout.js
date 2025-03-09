import React from 'react';
import '../styles/Layout.css';

const Layout = ({ sidebar, mainContent, rightPanel }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="logo">Postmate</div>
        <div className="environment-selector">
          <select>
            <option value="default">Default Environment</option>
            <option value="development">Development</option>
            <option value="production">Production</option>
          </select>
        </div>
      </header>
      
      <div className="main-container">
        <div className="sidebar">
          {sidebar}
        </div>
        
        <div className="content-container">
          <div className="main-content">
            {mainContent}
          </div>
          
          <div className="right-panel">
            {rightPanel}
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <div className="status-bar">Status: Ready</div>
      </footer>
    </div>
  );
};

export default Layout;
