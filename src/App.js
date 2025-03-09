import React, { useState } from 'react';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';
import ImportModal from './components/ImportModal';
import NewCollectionModal from './components/NewCollectionModal';
import NewRequestModal from './components/NewRequestModal';
import { sendRequest } from './utils/httpClient';
import './styles/App.css';

const App = () => {
  const [collections, setCollections] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [response, setResponse] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] = useState(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [selectedCollectionForRequest, setSelectedCollectionForRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImportCollection = (collection) => {
    setCollections(prevCollections => [...prevCollections, collection]);
    setIsImportModalOpen(false);
  };

  const handleCreateCollection = (newCollection) => {
    setCollections(prevCollections => [...prevCollections, newCollection]);
    setIsNewCollectionModalOpen(false);
  };

  const handleCreateRequest = (collection) => {
    setSelectedCollectionForRequest(collection);
    setIsNewRequestModalOpen(true);
  };

  const handleSaveNewRequest = (newRequest) => {
    setCollections(prevCollections => 
      prevCollections.map(collection => {
        if ((collection.info.id || collection.info._postman_id) === 
            (selectedCollectionForRequest.info.id || selectedCollectionForRequest.info._postman_id)) {
          return {
            ...collection,
            item: [...collection.item, newRequest]
          };
        }
        return collection;
      })
    );
    setIsNewRequestModalOpen(false);
    setSelectedCollectionForRequest(null);
  };

  const handleSendRequest = async (request) => {
    try {
      setIsLoading(true);
      setResponse(null);
      
      // Send the request using our HTTP client
      const response = await sendRequest(request);
      
      // Update the response state
      setResponse(response);
    } catch (error) {
      // Handle errors
      setResponse({
        status: 0,
        statusText: 'Error',
        headers: {},
        data: { error: error.message || 'An error occurred' },
        time: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Layout
        sidebar={
          <Sidebar 
            collections={collections} 
            onSelectRequest={setSelectedRequest}
            onImportClick={() => setIsImportModalOpen(true)}
            onCreateCollection={() => setIsNewCollectionModalOpen(true)}
            onCreateRequest={handleCreateRequest}
          />
        }
        mainContent={
          <RequestPanel 
            request={selectedRequest} 
            onSendRequest={handleSendRequest} 
          />
        }
        rightPanel={
          <ResponsePanel response={response} isLoading={isLoading} />
        }
      />
      
      {isImportModalOpen && (
        <ImportModal 
          onImport={handleImportCollection}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}

      {isNewCollectionModalOpen && (
        <NewCollectionModal
          onSave={handleCreateCollection}
          onClose={() => setIsNewCollectionModalOpen(false)}
        />
      )}

      {isNewRequestModalOpen && selectedCollectionForRequest && (
        <NewRequestModal
          collection={selectedCollectionForRequest}
          onSave={handleSaveNewRequest}
          onClose={() => {
            setIsNewRequestModalOpen(false);
            setSelectedCollectionForRequest(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
