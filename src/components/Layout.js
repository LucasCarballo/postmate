import React from 'react';
import '../styles/Layout.css';

const Layout = ({ sidebar, mainContent, rightPanel }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <div className="logo">Postmate</div>
        </div>
        
        <div className="header-center">
          <div className="environment-selector">
            <select>
              <option value="default">Default Environment</option>
              <option value="development">Development</option>
              <option value="production">Production</option>
            </select>
          </div>
        </div>
        
        <div className="header-right">
          <button className="icon-button theme-toggle" title="Toggle Theme">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
          <button className="icon-button user-profile" title="Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </header>
      
      <div className="main-container">
        <div className="sidebar card elevation-1">
          {sidebar}
        </div>
        
        <div className="content-container">
          <div className="main-content card elevation-1">
            {mainContent}
          </div>
          
          <div className="right-panel card elevation-1">
            {rightPanel}
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <div className="status">
          <span className="status-indicator online"></span>
          <span className="status-text">Status: Ready</span>
        </div>
        <div className="footer-actions">
          <button className="footer-button" title="History">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            History
          </button>
          <button className="footer-button" title="Console">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
            Console
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
