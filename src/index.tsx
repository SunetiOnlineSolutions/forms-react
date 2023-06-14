import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DataStoreProvider } from './context/DataStore';

ReactDOM.render(
  <React.StrictMode>
    <DataStoreProvider>
      <App />
    </DataStoreProvider>
  </React.StrictMode>,
  document.getElementById('app')
);
