import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PortfolioDataProvider } from './context/PortfolioDataContext.tsx'
import ManageAccess from './components/ManageAccess.tsx'

const isManagePage = window.location.pathname.replace(/\/+$/, '') === '/manage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioDataProvider>{isManagePage ? <ManageAccess /> : <App />}</PortfolioDataProvider>
  </StrictMode>,
)
