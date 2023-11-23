import { useState } from "react";
import { createContext } from "react";
import PropTypes from 'prop-types';
import { useEffect } from "react";
import { useEmpires, useFleets } from "../hooks";
import { useContext } from "react";
import { PositionSelectorContext } from "./PositionSelectorContext";
import { useRef } from "react";

export const DrawerPlanetContext = createContext({})

export const DrawerPlanetProvider = ({ children }) => {
  const [selectedPlanet, setSelectedPlanet] = useState({})
  const [empire, setEmpire] = useState({})
  const [fleets, setFleets] = useState([])
  const { getEmpireById, isEmpiresLoading } = useEmpires()
  const { getFleetsByCoordinate } = useFleets({})
  const { setIsInSelectionMode, isInSelectionMode, setSelectedFleetId } = useContext(PositionSelectorContext)
  const toggleDrawer = useRef()

  const handleMoveFleet = (fleetId) => {
    setIsInSelectionMode(true)
    setSelectedFleetId(fleetId)
    toggleDrawer.current.checked = false
  }


  const handleSelectedPlanet = (planet) => {
    const positionNumber = planet?.Coordenadas
    const row = Math.ceil(positionNumber / 16)
    const col = positionNumber % 16
    
    setSelectedPlanet({
      ...planet,
      x: col,
      y: row
    })
  }

  useEffect(() => {
    if (!selectedPlanet.ID_imperio) return
    getEmpireById(selectedPlanet.ID_imperio).then(setEmpire)
    getFleetsByCoordinate(selectedPlanet.Coordenadas).then(setFleets)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanet])

  return (
    <DrawerPlanetContext.Provider value={{ handleSelectedPlanet }}>
      <div className="drawer">
        <input disabled={isInSelectionMode} ref={toggleDrawer} id="planet-drawer" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content">
          { children }
        </div>

        <div className="drawer-side">
          <label htmlFor="planet-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu w-80 min-h-full bg-slate-900 text-base-content px-6">
            <header className="py-4 text-center">
              <p>{ selectedPlanet?.Nombre }</p>
              <h2 className="text-white font-bold text-3xl mb-4">{ selectedPlanet?.NombreVulgar }</h2>

              {selectedPlanet?.Nombre && (
                <img
                  src={`../src/assets/planets/${selectedPlanet?.Nombre}.png`}
                  className="mb-3 mx-auto transition-alldrop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] w-40 h-40 object-cover"
                />   
              )}         
            </header>

            <main className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-white/90 font-semibold text-lg">Montaña más alta</h3>
                <span className="text-md text-white/75">{ selectedPlanet?.NombreMontania } <div className="badge badge-primary text-white">{ selectedPlanet?.AlturaMontania }m</div></span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-white/90 font-semibold text-lg">Coordenada</h3>
                <div className="flex gap-2">
                  <div className="badge badge-primary text-white">{ selectedPlanet?.x + 1 }x</div>
                  <div className="badge badge-secondary text-white">{ selectedPlanet?.y }y</div>
                </div>
              </div>

              {isEmpiresLoading.empires
                  ? <span className="loading loading-infinity loading-lg mx-auto text-primary"></span>
                  : (
                    <div className="flex flex-col gap-1 mt-4">
                      <p className="text-center">Imperio dominante</p>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-white/80 font-semibold text-xl text-center">{ empire?.nombre }</h3>
                        <span className="text-xs text-white/75 text-center">Temperatura Promedio <div className="badge badge-primary text-white text-xs">{ empire?.TempPromedio }°</div></span>
                      </div>
                    </div>
                  )
              }

              <div className="flex flex-col gap-2">
                <h3 className="text-white/90 font-semibold text-lg">Flotas estacionadas</h3>
                {fleets.map((fleet) => (
                  <div className="bg-slate-800 p-4 rounded-md flex justify-between items-center" key={fleet.ID_flota}>
                    <div>
                      <span className="text-xs text-white/80 text-center">{ fleet.Nombre }</span>
                      <div className="badge badge-sm badge-secondary text-white ml-2">{ fleet.cantidad_naves }</div>
                    </div>

                    <button className="btn btn-xs btn-primary text-white" onClick={ () => { handleMoveFleet(fleet.ID_flota) } }>
                      Mover
                    </button>
                  </div>
                ))}
                { !fleets.length && <span>No hay flotas estacionadas</span> }
              </div>
            </main>
          </ul>
        </div>
      </div>
    </DrawerPlanetContext.Provider>
  )
}

DrawerPlanetProvider.propTypes = {
  children: PropTypes.node.isRequired
}