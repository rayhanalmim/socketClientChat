import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import routes from './routes/routes'

// import { ThemeProvider, AuthContextProvider } from '@antopolis/admin-component-library/src/Contexts/Contexts'
// import { Toaster } from '@antopolis/admin-component-library/src/Components/ui/ui'
// import { CLRouterProvider } from '@antopolis/admin-component-library/src/Helpers/Helpers'

import { ThemeProvider, AuthContextProvider } from '@antopolis/admin-component-library/dist/contexts'
import { Toaster } from '@antopolis/admin-component-library/dist/ui'
import { CLRouterProvider } from '@antopolis/admin-component-library/dist/helper'

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
