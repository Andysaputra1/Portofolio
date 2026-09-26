import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initBotId } from 'botid/client/core'
import './index.css'
import App from './App.tsx'
import { PortfolioDataProvider } from './context/PortfolioDataContext.tsx'
import ManageAccess from './components/ManageAccess.tsx'

// The BotID challenge is served through vercel.json rewrites, which exist only on Vercel deployments.
if (import.meta.env.PROD) initBotId({ protect: [{ path: '/api/chat', method: 'POST' }] })

const isManagePage = window.location.pathname.replace(/\/+$/, '') === '/manage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioDataProvider>{isManagePage ? <ManageAccess /> : <App />}</PortfolioDataProvider>
  </StrictMode>,
)
