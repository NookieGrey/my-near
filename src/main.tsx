import React from 'react'
import ReactDOM from 'react-dom/client'
import './shims'
import {NearContextProvider} from "./NearContext";
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NearContextProvider>
      <App/>
    </NearContextProvider>
  </React.StrictMode>,
)
