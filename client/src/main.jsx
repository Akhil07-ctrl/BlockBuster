import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import { LocationProvider } from './context/LocationContext.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#ef4444',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'shadow-2xl border border-gray-100 mx-auto w-full max-w-[400px]',
          rootBox: 'w-full flex justify-center',
          userButtonPopoverCard: 'shadow-2xl border border-gray-100',
          modalBackdrop: 'backdrop-blur-sm bg-black/30',
        }
      }}
    >
      <BrowserRouter>
        <LocationProvider>
          <App />
        </LocationProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>,
)
