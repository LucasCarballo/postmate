import React, { useState, useEffect, useRef } from 'react';
import { parseUrl } from '../utils/httpClient';
import '../styles/RequestPanel.css';

const RequestPanel = ({ request, onSendRequest }) => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '', enabled: true }]);
  const [bodyType, setBodyType] = useState('none');
  const [bodyContent, setBodyContent] = useState('');
  const [activeTab, setActiveTab] = useState('params');
  const [queryParams, setQueryParams] = useState([{ key: '', value: '', enabled: true }]);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);

  // Update form when a request is selected
  useEffect(() => {
    if (request) {
      // Handle simple string request URLs
      if (typeof request.request === 'string') {
        const { baseUrl, params } = parseUrl(request.request);
        setUrl(baseUrl);
        setQueryParams(
          Object.entries(params).map(([key, value]) => ({ key, value, enabled: true })).length 
            ? Object.entries(params).map(([key, value]) => ({ key, value, enabled: true })) 
            : [{ key: '', value: '', enabled: true }]
        );
        setMethod('GET');
        setHeaders([{ key: '', value: '', enabled: true }]);
        setBodyType('none');
        setBodyContent('');
        return;
      }
      
      // Handle full request objects
      if (request.request) {
        // Set method
        setMethod(request.request.method || 'GET');
        
        // Set URL and extract query params
        if (typeof request.request.url === 'string') {
          const { baseUrl, params } = parseUrl(request.request.url);
          setUrl(baseUrl);
          setQueryParams(
            Object.entries(params).map(([key, value]) => ({ key, value, enabled: true })).length 
              ? Object.entries(params).map(([key, value]) => ({ key, value, enabled: true })) 
              : [{ key: '', value: '', enabled: true }]
          );
        } else if (request.request.url) {
          // Handle complex URL objects
          const urlObj = request.request.url;
          let constructedUrl = '';
          
          // Construct URL from host and path
          if (urlObj.host && Array.isArray(urlObj.host)) {
            constructedUrl += urlObj.host.join('.');
          }
          
          if (urlObj.path && Array.isArray(urlObj.path)) {
            constructedUrl = constructedUrl ? `${constructedUrl}/${urlObj.path.join('/')}` : urlObj.path.join('/');
          }
          
          // Add protocol
          if (urlObj.protocol) {
            constructedUrl = `${urlObj.protocol}://${constructedUrl}`;
          } else {
            constructedUrl = `https://${constructedUrl}`;
          }
          
          // Set the URL
          setUrl(constructedUrl);
          
          // Handle query params
          if (urlObj.query && Array.isArray(urlObj.query)) {
            const extractedParams = urlObj.query
              .filter(param => param.key)
              .map(param => ({ key: param.key, value: param.value || '', enabled: true }));
            
            setQueryParams(extractedParams.length ? extractedParams : [{ key: '', value: '', enabled: true }]);
          } else {
            setQueryParams([{ key: '', value: '', enabled: true }]);
          }
        }
        
        // Set headers
        if (request.request.header && Array.isArray(request.request.header)) {
          const extractedHeaders = request.request.header
            .filter(header => header.key)
            .map(header => ({ key: header.key, value: header.value || '', enabled: true }));
          
          setHeaders(extractedHeaders.length ? extractedHeaders : [{ key: '', value: '', enabled: true }]);
        } else {
          setHeaders([{ key: '', value: '', enabled: true }]);
        }
        
        // Set body
        if (request.request.body) {
          const body = request.request.body;
          
          if (body.mode) {
            setBodyType(body.mode);
            
            // Handle different body types
            switch (body.mode) {
              case 'raw':
                setBodyContent(body.raw || '');
                break;
              case 'urlencoded':
                if (body.urlencoded && Array.isArray(body.urlencoded)) {
                  const formattedContent = body.urlencoded
                    .map(item => `${item.key}=${item.value}`)
                    .join('&');
                  setBodyContent(formattedContent);
                }
                break;
              case 'formdata':
                if (body.formdata && Array.isArray(body.formdata)) {
                  const formattedContent = body.formdata
                    .map(item => `${item.key}: ${item.value}`)
                    .join('\n');
                  setBodyContent(formattedContent);
                }
                break;
              default:
                setBodyContent('');
            }
          }
        } else {
          setBodyType('none');
          setBodyContent('');
        }
      }
    }
  }, [request]);

  // Method selector
  const methodRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (methodRef.current && !methodRef.current.contains(event.target)) {
        setMethodDropdownOpen(false);
      }
    }
    
    if (methodDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [methodDropdownOpen]);
  
  // Get method class for styling
  const getMethodClass = () => {
    const methodLower = method.toLowerCase();
    return `method-${methodLower}`;
  };
  
  const toggleMethodDropdown = () => {
    setMethodDropdownOpen(!methodDropdownOpen);
  };
  
  const selectMethod = (newMethod) => {
    setMethod(newMethod);
    setMethodDropdownOpen(false);
  };
  
  // URL input reference
  const urlInputRef = useRef(null);
  
  useEffect(() => {
    // Focus URL input when component mounts
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, []);

  const handleSend = () => {
    // Construct the final URL with query parameters
    let finalUrl = url;
    const activeParams = queryParams.filter(param => param.key && param.enabled);
    
    if (activeParams.length > 0) {
      const queryString = activeParams
        .map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
        .join('&');
      
      // If URL already has query parameters, append with &, otherwise use ?
      finalUrl += finalUrl.includes('?') ? `&${queryString}` : `?${queryString}`;
    }
    
    const requestData = {
      method,
      url: finalUrl,
      headers: headers.reduce((acc, header) => {
        if (header.key && header.value && header.enabled) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {}),
      body: bodyType !== 'none' ? bodyContent : undefined
    };
    
    onSendRequest(requestData);
  };
  
  // Headers management
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };
  
  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };
  
  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const toggleHeaderEnabled = (index) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], enabled: !newHeaders[index].enabled };
    setHeaders(newHeaders);
  };

  // Query params management
  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '', enabled: true }]);
  };
  
  const updateQueryParam = (index, field, value) => {
    const newParams = [...queryParams];
    newParams[index] = { ...newParams[index], [field]: value };
    setQueryParams(newParams);
  };
  
  const removeQueryParam = (index) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const toggleQueryParamEnabled = (index) => {
    const newParams = [...queryParams];
    newParams[index] = { ...newParams[index], enabled: !newParams[index].enabled };
    setQueryParams(newParams);
  };

  return (
    <div className="request-panel">
      <div className="request-url-section">
        <div ref={methodRef} style={{ position: 'relative' }}>
          <div className={`method-selector ${getMethodClass()}`} onClick={toggleMethodDropdown}>
            <span className="method-name">{method}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginLeft: '2px' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {methodDropdownOpen && (
            <div className="method-dropdown">
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                <div 
                  key={m} 
                  className={`method-dropdown-item ${m.toLowerCase() === method.toLowerCase() ? getMethodClass() : ''}`}
                  onClick={() => selectMethod(m)}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="url-input-container">
          <input 
            type="text" 
            className="url-input" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="Enter request URL"
            ref={urlInputRef}
          />
        </div>
        <button className="send-button" onClick={handleSend}>
          <span className="send-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13"></path>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
          </span>
          Send
        </button>
      </div>
      
      <div className="request-tabs">
        <div 
          className={`request-tab ${activeTab === 'params' ? 'active' : ''}`}
          onClick={() => setActiveTab('params')}
        >
          <span className="tab-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </span>
          Params
          {queryParams.filter(p => p.key).length > 0 && (
            <span className="request-tab-indicator">{queryParams.filter(p => p.key).length}</span>
          )}
        </div>
        <div 
          className={`request-tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          <span className="tab-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
            </svg>
          </span>
          Headers
          {headers.filter(h => h.key).length > 0 && (
            <span className="request-tab-indicator">{headers.filter(h => h.key).length}</span>
          )}
        </div>
        <div 
          className={`request-tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          <span className="tab-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </span>
          Body
        </div>
        <div 
          className={`request-tab ${activeTab === 'auth' ? 'active' : ''}`}
          onClick={() => setActiveTab('auth')}
        >
          <span className="tab-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          Auth
        </div>
      </div>
      
      <div className="request-content">
        {activeTab === 'params' && (
          <div className="param-form">
            {queryParams.map((param, index) => (
              <div key={index} className="param-row">
                <input
                  type="checkbox"
                  className="param-checkbox"
                  checked={param.enabled !== false}
                  onChange={() => toggleQueryParamEnabled(index)}
                />
                <input
                  type="text"
                  className="param-input"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => updateQueryParam(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  className="param-input"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                />
                <button className="param-remove" onClick={() => removeQueryParam(index)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
            
            <button className="add-param-button" onClick={addQueryParam}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add Parameter
            </button>
          </div>
        )}
        
        {activeTab === 'headers' && (
          <div className="param-form">
            {headers.map((header, index) => (
              <div key={index} className="param-row">
                <input
                  type="checkbox"
                  className="param-checkbox"
                  checked={header.enabled !== false}
                  onChange={() => toggleHeaderEnabled(index)}
                />
                <input
                  type="text"
                  className="param-input"
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  className="param-input"
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                />
                <button className="param-remove" onClick={() => removeHeader(index)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
            
            <button className="add-param-button" onClick={addHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add Header
            </button>
          </div>
        )}
        
        {activeTab === 'body' && (
          <div className="request-body-section">
            <div className="body-type-selector">
              <div 
                className={`body-type-option ${bodyType === 'none' ? 'active' : ''}`}
                onClick={() => setBodyType('none')}
              >
                None
              </div>
              <div 
                className={`body-type-option ${bodyType === 'raw' ? 'active' : ''}`}
                onClick={() => setBodyType('raw')}
              >
                Raw
              </div>
              <div 
                className={`body-type-option ${bodyType === 'json' ? 'active' : ''}`}
                onClick={() => setBodyType('json')}
              >
                JSON
              </div>
              <div 
                className={`body-type-option ${bodyType === 'formdata' ? 'active' : ''}`}
                onClick={() => setBodyType('formdata')}
              >
                Form Data
              </div>
              <div 
                className={`body-type-option ${bodyType === 'urlencoded' ? 'active' : ''}`}
                onClick={() => setBodyType('urlencoded')}
              >
                x-www-form-urlencoded
              </div>
            </div>
            
            {bodyType !== 'none' && (
              <div className="body-editor-container">
                {bodyType === 'json' ? (
                  <textarea 
                    className="json-editor"
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                    placeholder="Enter JSON body content"
                  />
                ) : (
                  <textarea 
                    className="raw-editor"
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                    placeholder={`Enter ${bodyType} body content`}
                  />
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'auth' && (
          <div className="auth-section">
            <p>Authentication options will be available in future versions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPanel;
