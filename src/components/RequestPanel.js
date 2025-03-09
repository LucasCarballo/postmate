import React, { useState, useEffect } from 'react';
import { parseUrl } from '../utils/httpClient';
import '../styles/RequestPanel.css';

const RequestPanel = ({ request, onSendRequest }) => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [bodyType, setBodyType] = useState('none');
  const [bodyContent, setBodyContent] = useState('');
  const [activeTab, setActiveTab] = useState('params');
  const [queryParams, setQueryParams] = useState([{ key: '', value: '' }]);

  // Update form when a request is selected
  useEffect(() => {
    if (request) {
      // Handle simple string request URLs
      if (typeof request.request === 'string') {
        const { baseUrl, params } = parseUrl(request.request);
        setUrl(baseUrl);
        setQueryParams(
          Object.entries(params).map(([key, value]) => ({ key, value })).length 
            ? Object.entries(params).map(([key, value]) => ({ key, value })) 
            : [{ key: '', value: '' }]
        );
        setMethod('GET');
        setHeaders([{ key: '', value: '' }]);
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
            Object.entries(params).map(([key, value]) => ({ key, value })).length 
              ? Object.entries(params).map(([key, value]) => ({ key, value })) 
              : [{ key: '', value: '' }]
          );
        } else if (request.request.url) {
          // Handle complex URL objects
          const urlObj = request.request.url;
          let constructedUrl = '';
          
          if (urlObj.protocol) {
            constructedUrl += `${urlObj.protocol}://`;
          }
          
          if (urlObj.host) {
            if (Array.isArray(urlObj.host)) {
              constructedUrl += urlObj.host.join('.');
            } else {
              constructedUrl += urlObj.host;
            }
          }
          
          if (urlObj.port) {
            constructedUrl += `:${urlObj.port}`;
          }
          
          if (urlObj.path) {
            if (Array.isArray(urlObj.path)) {
              constructedUrl += `/${urlObj.path.join('/')}`;
            } else {
              constructedUrl += `/${urlObj.path}`;
            }
          }
          
          setUrl(constructedUrl);
          
          // Extract query params if available
          if (urlObj.query && Array.isArray(urlObj.query)) {
            setQueryParams(
              urlObj.query.map(param => ({ key: param.key, value: param.value })).length
                ? urlObj.query.map(param => ({ key: param.key, value: param.value }))
                : [{ key: '', value: '' }]
            );
          } else {
            setQueryParams([{ key: '', value: '' }]);
          }
        }
        
        // Set headers
        if (request.request.header) {
          if (Array.isArray(request.request.header)) {
            setHeaders(
              request.request.header.map(h => ({ key: h.key, value: h.value }))
            );
          } else if (typeof request.request.header === 'string') {
            // Handle string headers (less common)
            const headerPairs = request.request.header
              .split('\n')
              .filter(Boolean)
              .map(line => {
                const [key, ...valueParts] = line.split(':');
                const value = valueParts.join(':').trim();
                return { key, value };
              });
              
            setHeaders(headerPairs.length ? headerPairs : [{ key: '', value: '' }]);
          }
        } else {
          setHeaders([{ key: '', value: '' }]);
        }
        
        // Set body
        if (request.request.body) {
          const body = request.request.body;
          setBodyType(body.mode || 'none');
          
          if (body.mode === 'raw' && body.raw) {
            setBodyContent(body.raw);
          } else if (body.mode === 'urlencoded' && Array.isArray(body.urlencoded)) {
            setBodyContent(
              body.urlencoded
                .map(param => `${param.key}=${param.value}`)
                .join('&')
            );
          } else if (body.mode === 'formdata' && Array.isArray(body.formdata)) {
            // For simplicity we're just showing the key-value pairs
            setBodyContent(
              body.formdata
                .map(param => `${param.key}=${param.value}`)
                .join('\n')
            );
          }
        } else {
          setBodyType('none');
          setBodyContent('');
        }
      }
    }
  }, [request]);
  
  const handleSend = () => {
    // Build the full URL with query parameters
    const finalUrl = url + (queryParams.some(p => p.key) ? '?' : '') +
      queryParams
        .filter(p => p.key)
        .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value || '')}`)
        .join('&');
    
    const requestData = {
      method,
      url: finalUrl,
      headers: headers.reduce((acc, header) => {
        if (header.key && header.value) {
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
    setHeaders([...headers, { key: '', value: '' }]);
  };
  
  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };
  
  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };
  
  // Query params management
  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };
  
  const updateQueryParam = (index, field, value) => {
    const newParams = [...queryParams];
    newParams[index] = { ...newParams[index], [field]: value };
    setQueryParams(newParams);
  };
  
  const removeQueryParam = (index) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  return (
    <div className="request-panel">
      <div className="request-url-bar">
        <select 
          className="method-selector" 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="OPTIONS">OPTIONS</option>
          <option value="HEAD">HEAD</option>
        </select>
        
        <input 
          type="text" 
          className="url-input" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Enter request URL"
        />
        
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
      
      <div className="request-tabs">
        <div 
          className={`tab ${activeTab === 'params' ? 'active' : ''}`}
          onClick={() => setActiveTab('params')}
        >
          Params
        </div>
        <div 
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </div>
        <div 
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </div>
        <div 
          className={`tab ${activeTab === 'auth' ? 'active' : ''}`}
          onClick={() => setActiveTab('auth')}
        >
          Auth
        </div>
      </div>
      
      <div className="tab-content">
        {activeTab === 'params' && (
          <div className="params-tab">
            <table className="params-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {queryParams.map((param, index) => (
                  <tr key={index}>
                    <td>
                      <input 
                        type="text" 
                        value={param.key} 
                        onChange={(e) => updateQueryParam(index, 'key', e.target.value)}
                        placeholder="Query parameter name"
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        value={param.value} 
                        onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                        placeholder="Query parameter value"
                      />
                    </td>
                    <td>
                      <button 
                        className="remove-button" 
                        onClick={() => removeQueryParam(index)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button className="add-button" onClick={addQueryParam}>
              Add Parameter
            </button>
          </div>
        )}
        
        {activeTab === 'headers' && (
          <div className="headers-tab">
            <table className="headers-table">
              <thead>
                <tr>
                  <th>Header</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {headers.map((header, index) => (
                  <tr key={index}>
                    <td>
                      <input 
                        type="text" 
                        value={header.key} 
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        placeholder="Header name"
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        value={header.value} 
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header value"
                      />
                    </td>
                    <td>
                      <button 
                        className="remove-button" 
                        onClick={() => removeHeader(index)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button className="add-button" onClick={addHeader}>
              Add Header
            </button>
          </div>
        )}
        
        {activeTab === 'body' && (
          <div className="body-tab">
            <div className="body-type-selector">
              <label>
                <input 
                  type="radio" 
                  name="bodyType" 
                  value="none" 
                  checked={bodyType === 'none'} 
                  onChange={() => setBodyType('none')} 
                />
                None
              </label>
              
              <label>
                <input 
                  type="radio" 
                  name="bodyType" 
                  value="raw" 
                  checked={bodyType === 'raw'} 
                  onChange={() => setBodyType('raw')} 
                />
                Raw
              </label>
              
              <label>
                <input 
                  type="radio" 
                  name="bodyType" 
                  value="urlencoded" 
                  checked={bodyType === 'urlencoded'} 
                  onChange={() => setBodyType('urlencoded')} 
                />
                Form URL-encoded
              </label>
              
              <label>
                <input 
                  type="radio" 
                  name="bodyType" 
                  value="formdata" 
                  checked={bodyType === 'formdata'} 
                  onChange={() => setBodyType('formdata')} 
                />
                Form Data
              </label>
            </div>
            
            {bodyType !== 'none' && (
              <textarea 
                className="body-content" 
                value={bodyContent} 
                onChange={(e) => setBodyContent(e.target.value)}
                placeholder={`Enter ${bodyType} content here`}
              />
            )}
          </div>
        )}
        
        {activeTab === 'auth' && (
          <div className="auth-tab">
            <p>Authentication options will be added in future updates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPanel;
