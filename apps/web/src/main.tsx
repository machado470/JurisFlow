import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './theme/ThemeContext'
import { DensityProvider } from './layouts/DensityContext'
import { AuthProvider } from './auth/AuthContext'
import './index.css'

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <HashRouter>
    <ThemeProvider>
      <DensityProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DensityProvider>
    </ThemeProvider>
  </HashRouter>
)
