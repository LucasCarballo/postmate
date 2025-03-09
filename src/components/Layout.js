import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/Layout.css';

const Layout = ({ sidebar, mainContent, rightPanel }) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragHandleRef = useRef(null);
  const containerRef = useRef(null);
  const requestPanelRef = useRef(null);

  useEffect(() => {
    const handleMouseDown = (e) => {
      e.preventDefault();
      setIsDragging(true);
      document.body.classList.add('resizing');
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current || !requestPanelRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const maxHeight = containerRect.height - 100; // Ensure response panel has at least 100px
      
      // Calculate new height based on mouse position relative to container
      const newHeight = e.clientY - containerRect.top;
      
      if (newHeight >= 150 && newHeight < maxHeight) {
        requestPanelRef.current.style.height = `${newHeight}px`;
        requestPanelRef.current.style.flex = '0 0 auto';
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.classList.remove('resizing');
    };

    const dragHandle = dragHandleRef.current;
    if (dragHandle) {
      dragHandle.addEventListener('mousedown', handleMouseDown);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      if (dragHandle) {
        dragHandle.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleRequest = async (request) => {
    setIsLoading(true);
    // Simulating API request
    setTimeout(() => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-cache',
          'x-powered-by': 'Express',
        },
        data: {
          success: true,
          message: 'This is a successful response',
          data: {
            id: 123,
            name: 'Sample product',
            price: 99.99,
            tags: ['new', 'featured'],
            metadata: {
              created: '2023-01-15T12:00:00Z',
              updated: '2023-02-20T15:30:00Z',
            }
          }
        },
        time: 234 // milliseconds
      };
      setResponse(mockResponse);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="layout">
      <Header />
      
      <div className="main-container">
        <div className="sidebar card elevation-1">
          {sidebar}
        </div>
        
        <div className="content-container">
          <div className="vertical-panels-container" ref={containerRef}>
            <div className="request-panel-container" ref={requestPanelRef}>
              {mainContent}
            </div>
            
            <div className="resize-handle" ref={dragHandleRef}>
              <div className="resize-handle-line"></div>
            </div>
            
            <div className="response-panel-container">
              {rightPanel}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Layout;
