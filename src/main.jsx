import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { DrawerPlanetProvider } from './contexts/DrawerPlanetContext.jsx'
import { ModalFleetProvider } from './contexts/ModalFleetContext.jsx'
import { PositionSelectorProvider } from './contexts/PositionSelectorContext.jsx'
import { Toaster } from 'sonner'

const root = document.getElementById('root')

createRoot(root).render(
  <>
    <Toaster position="bottom-right" expand={false} richColors />
    <PositionSelectorProvider>
      <ModalFleetProvider>
        <DrawerPlanetProvider>
          <App />
        </DrawerPlanetProvider>
      </ModalFleetProvider>
    </PositionSelectorProvider>
  </>
)