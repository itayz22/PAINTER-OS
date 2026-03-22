import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TradiePricingTool from './TradiePricingTool.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TradiePricingTool />
  </StrictMode>,
)
