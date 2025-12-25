import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Inject favicon dynamically so Vite resolves the correct URL in dev & build
const faviconUrl = new URL('../assets/icon.png', import.meta.url).href
const link = document.createElement('link')
link.rel = 'icon'
link.type = 'image/png'
link.href = faviconUrl
document.head.appendChild(link)

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
