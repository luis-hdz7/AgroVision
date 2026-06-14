import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/features/mapping/mapping.css'
import App from './app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
