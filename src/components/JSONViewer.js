import React, { useState, useEffect } from 'react';
import '../styles/JSONViewer.css';

const JSONViewer = ({ 
  data, 
  readOnly = true, 
  onChange = null,
  height = 'auto', 
  showCopyButton = true 
}) => {
  const [parsedData, setParsedData] = useState(null);
  const [rawJSON, setRawJSON] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [parseError, setParseError] = useState('');
  const [collapsedPaths, setCollapsedPaths] = useState(new Set());

  useEffect(() => {
    if (data) {
      try {
        // Handle different input types
        let parsed;
        if (typeof data === 'string') {
          // Try to parse as JSON if it's a string
          try {
            parsed = JSON.parse(data);
            const formatted = JSON.stringify(parsed, null, 2);
            setParsedData(parsed);
            setRawJSON(formatted);
            setEditableContent(formatted);
            setParseError('');
          } catch (e) {
            // If not valid JSON, treat as plain text
            setRawJSON(data);
            setEditableContent(data);
            setParseError('Invalid JSON: ' + e.message);
          }
        } else {
          // If it's already an object, stringify it
          parsed = data;
          const formatted = JSON.stringify(parsed, null, 2);
          setParsedData(parsed);
          setRawJSON(formatted);
          setEditableContent(formatted);
          setParseError('');
        }
      } catch (error) {
        console.error("Error formatting JSON:", error);
        setRawJSON(String(data));
        setEditableContent(String(data));
        setParseError('Error formatting JSON: ' + error.message);
      }
    } else {
      setParsedData(null);
      setRawJSON('');
      setEditableContent('');
      setParseError('');
    }
  }, [data]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(rawJSON).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  };

  const handleEditClick = () => {
    if (isEditing) {
      try {
        // Try to parse the editable content as JSON
        const parsed = JSON.parse(editableContent);
        const formatted = JSON.stringify(parsed, null, 2);
        
        setParsedData(parsed);
        setRawJSON(formatted);
        setParseError('');
        
        // Call onChange if provided
        if (onChange) {
          onChange(parsed);
        }
      } catch (error) {
        setParseError('Invalid JSON: ' + error.message);
      }
    }
    
    setIsEditing(!isEditing);
  };

  const handleTextareaChange = (e) => {
    setEditableContent(e.target.value);
    
    // Real-time validation feedback
    try {
      JSON.parse(e.target.value);
      setParseError('');
    } catch (error) {
      setParseError('Invalid JSON: ' + error.message);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEditableContent(text);
      
      // Try to validate pasted content
      try {
        JSON.parse(text);
        setParseError('');
      } catch (error) {
        setParseError('Invalid JSON: ' + error.message);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setParseError('Could not access clipboard. Make sure you\'ve granted permission.');
    }
  };

  const handleEditFocus = (e) => {
    if (e.target) {
      e.target.setSelectionRange(0, e.target.value.length);
    }
  };

  const toggleCollapsed = (path) => {
    const newCollapsed = new Set(collapsedPaths);
    if (newCollapsed.has(path)) {
      newCollapsed.delete(path);
    } else {
      newCollapsed.add(path);
    }
    setCollapsedPaths(newCollapsed);
  };

  // Recursive rendering of JSON with collapsible nodes
  const renderJSONNode = (data, path = '') => {
    if (data === null) {
      return <span className="json-null">null</span>;
    }

    if (typeof data === 'boolean') {
      return <span className="json-boolean">{String(data)}</span>;
    }

    if (typeof data === 'number') {
      return <span className="json-number">{data}</span>;
    }

    if (typeof data === 'string') {
      return <span className="json-string">"{data}"</span>;
    }

    if (Array.isArray(data)) {
      const isCollapsed = collapsedPaths.has(path);
      
      return (
        <div className="json-array">
          <div className="json-toggle-line">
            <span 
              className={`json-toggle ${isCollapsed ? 'collapsed' : ''}`} 
              onClick={() => toggleCollapsed(path)}
            ></span>
            <span className="json-bracket">[</span>
            {isCollapsed && (
              <span className="json-collapsed-indicator">Array({data.length})</span>
            )}
            {isCollapsed && <span className="json-bracket">]</span>}
          </div>
          
          {!isCollapsed && (
            <>
              <div className="json-array-items">
                {data.map((item, index) => (
                  <div key={`${path}-${index}`} className="json-array-item">
                    {renderJSONNode(item, `${path}.${index}`)}
                    {index < data.length - 1 && <span className="json-comma">,</span>}
                  </div>
                ))}
              </div>
              <div><span className="json-bracket">]</span></div>
            </>
          )}
        </div>
      );
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data);
      const isCollapsed = collapsedPaths.has(path);
      
      return (
        <div className="json-object">
          <div className="json-toggle-line">
            <span 
              className={`json-toggle ${isCollapsed ? 'collapsed' : ''}`} 
              onClick={() => toggleCollapsed(path)}
            ></span>
            <span className="json-bracket">{'{'}</span>
            {isCollapsed && (
              <span className="json-collapsed-indicator">Object({keys.length})</span>
            )}
            {isCollapsed && <span className="json-bracket">{'}'}</span>}
          </div>

          {!isCollapsed && (
            <>
              <div className="json-object-properties">
                {keys.map((key, index) => (
                  <div key={`${path}-${key}`} className="json-object-property">
                    <span className="json-key">"{key}"</span>
                    <span className="json-colon">: </span>
                    {renderJSONNode(data[key], `${path}.${key}`)}
                    {index < keys.length - 1 && <span className="json-comma">,</span>}
                  </div>
                ))}
              </div>
              <div><span className="json-bracket">{'}'}</span></div>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="json-viewer" style={{ height }}>
      {parseError && (
        <div className="json-parse-error">
          {parseError}
        </div>
      )}
      
      <div className="json-viewer-toolbar">
        {!readOnly && (
          <button 
            className={`json-viewer-btn ${isEditing ? 'json-active' : ''}`} 
            onClick={handleEditClick}
          >
            {isEditing ? 'Save' : 'Edit JSON'}
          </button>
        )}
        
        {isEditing && (
          <button 
            className="json-viewer-btn" 
            onClick={handlePaste}
          >
            Paste
          </button>
        )}
        
        {showCopyButton && (
          <button 
            className={`json-viewer-btn ${copySuccess ? 'json-success' : ''}`} 
            onClick={handleCopyClick}
          >
            {copySuccess ? 'Copied!' : 'Copy JSON'}
          </button>
        )}
      </div>
      
      <div className="json-viewer-content">
        {isEditing ? (
          <textarea 
            className="json-editor" 
            value={editableContent}
            onChange={handleTextareaChange}
            onFocus={handleEditFocus}
            spellCheck="false"
          ></textarea>
        ) : (
          <div className="json-formatted">
            {parsedData && renderJSONNode(parsedData, 'root')}
          </div>
        )}
      </div>
    </div>
  );
};

export default JSONViewer;
