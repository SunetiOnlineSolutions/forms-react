import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/css/App.css';
import App from './App.tsx'
import { DataStoreProvider } from './context/DataStore'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
     <DataStoreProvider>
        <App />
    </DataStoreProvider>
  </React.StrictMode>,
)
