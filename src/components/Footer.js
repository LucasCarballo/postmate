import React from 'react';
import '../styles/Footer.css';

export const Footer = () => {
  return (
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
  );
};

export default Footer;
