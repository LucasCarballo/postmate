/**
 * Utility functions for working with Postman collections
 */

/**
 * Validates if the given object is a valid Postman collection
 * 
 * @param {object} collection - The collection object to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidPostmanCollection = (collection) => {
  if (!collection || typeof collection !== 'object') {
    return false;
  }

  // Check if it has the basic structure
  if (!collection.info || !collection.item) {
    return false;
  }

  // Check info object
  if (!collection.info.name || !collection.info._postman_id) {
    return false;
  }

  return true;
};

/**
 * Extracts all requests from a collection and returns them in a flat array
 * 
 * @param {object} collection - The Postman collection
 * @returns {array} Array of request objects
 */
export const extractRequests = (collection) => {
  const requests = [];

  const processItems = (items, parentPath = []) => {
    if (!items || !Array.isArray(items)) {
      return;
    }

    items.forEach(item => {
      const currentPath = [...parentPath, item.name];

      // If it's a folder with items
      if (item.item && Array.isArray(item.item)) {
        processItems(item.item, currentPath);
      } 
      // If it's a request
      else if (item.request) {
        requests.push({
          ...item,
          path: currentPath
        });
      }
    });
  };

  processItems(collection.item);
  return requests;
};

/**
 * Finds a specific request by ID in a collection
 * 
 * @param {object} collection - The Postman collection
 * @param {string} requestId - The ID of the request to find
 * @returns {object|null} The request object or null if not found
 */
export const findRequestById = (collection, requestId) => {
  const allRequests = extractRequests(collection);
  return allRequests.find(req => req.id === requestId) || null;
};

/**
 * Converts a Postman request to an executable request format for our application
 * 
 * @param {object} postmanRequest - The Postman request object
 * @returns {object} Executable request object with method, url, headers, etc.
 */
export const convertToExecutableRequest = (postmanRequest) => {
  // Handle different request formats
  let request = postmanRequest.request;

  // If request is a string URL
  if (typeof request === 'string') {
    return {
      method: 'GET',
      url: request,
      headers: {}
    };
  }

  // Process URL
  let url = '';
  if (typeof request.url === 'string') {
    url = request.url;
  } else if (request.url) {
    // Build URL from object
    const urlObj = request.url;
    
    if (urlObj.protocol) {
      url += `${urlObj.protocol}://`;
    }
    
    if (urlObj.host) {
      if (Array.isArray(urlObj.host)) {
        url += urlObj.host.join('.');
      } else {
        url += urlObj.host;
      }
    }
    
    if (urlObj.port) {
      url += `:${urlObj.port}`;
    }
    
    if (urlObj.path) {
      if (Array.isArray(urlObj.path)) {
        url += `/${urlObj.path.join('/')}`;
      } else {
        url += `/${urlObj.path}`;
      }
    }
  }

  // Process headers
  let headers = {};
  if (request.header) {
    if (Array.isArray(request.header)) {
      request.header.forEach(h => {
        if (h.key && h.value) {
          headers[h.key] = h.value;
        }
      });
    } else if (typeof request.header === 'string') {
      request.header
        .split('\n')
        .filter(Boolean)
        .forEach(line => {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          if (key && value) {
            headers[key] = value;
          }
        });
    }
  }

  // Process body
  let body = undefined;
  if (request.body) {
    if (request.body.mode === 'raw' && request.body.raw) {
      body = request.body.raw;
    } else if (request.body.mode === 'urlencoded' && Array.isArray(request.body.urlencoded)) {
      const params = new URLSearchParams();
      request.body.urlencoded.forEach(param => {
        if (param.key) {
          params.append(param.key, param.value || '');
        }
      });
      body = params.toString();
    }
  }

  return {
    method: request.method || 'GET',
    url,
    headers,
    body
  };
};
