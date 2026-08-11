import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrintPage from './PrintPage.jsx'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const isPrintPage = path === '/impressao' || window.location.hash.startsWith('#impressao')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPrintPage ? <PrintPage /> : <App />}
  </StrictMode>,
)
