import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, AuthContextProvider } from '@antopolis/admin-component-library/dist/contexts'
import { Toaster } from '@antopolis/admin-component-library/dist/ui'
import { CLRouterProvider } from '@antopolis/admin-component-library/dist/helper'
import routes from './routes/routes'

import './index.css'
import '@antopolis/admin-component-library/dist/main.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <AuthContextProvider>
        <CLRouterProvider router={routes} />
        <Toaster />
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>,
)
