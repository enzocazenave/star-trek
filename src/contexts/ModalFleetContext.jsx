import { createContext } from "react";
import PropTypes from 'prop-types';
import { useState } from "react";
import { useEffect } from "react";
import { useFleets } from "../hooks";
import { useContext } from "react";
import { PositionSelectorContext } from "./PositionSelectorContext";

export const ModalFleetContext = createContext({})

export const ModalFleetProvider = ({ children }) => {
  const [selectedFleet, setSelectedFleet] = useState({})
  const [fleetShips, setFleetShips] = useState([])
  const { getFleetShips, isFleetsLoading } = useFleets({})
  const { setIsInSelectionMode, setSelectedFleetId } = useContext(PositionSelectorContext)

  const handleSelectedFleet = (fleet) => {
    setSelectedFleet(fleet)
    document.querySelector('#fleet-modal').showModal()
  }

  const handleMoveFleet = () => {
    setIsInSelectionMode(true)
    setSelectedFleetId(selectedFleet?.id_flota)
  }

  useEffect(() => {
    if (!selectedFleet.id_flota) return
    getFleetShips(selectedFleet?.id_flota).then(setFleetShips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFleet])

  const fleetName = selectedFleet?.Nombre?.split(' ')[1].toLowerCase()
  const imageSrc = `../src/assets/fleets/${['fup', 'romulana', 'cardassiana', 'ferengi'].includes(fleetName) ? fleetName : 'uss' }.png`

  return (
    <ModalFleetContext.Provider value={{ handleSelectedFleet }}>
      {children}

      <dialog id="fleet-modal" className="modal">
        <div className="modal-box bg-slate-900">
          <header className="flex justify-between gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 items-center">
                <h3 className="font-semibold text-lg text-white/90">{selectedFleet?.Nombre}</h3>
                <div className="badge badge-secondary text-white">{selectedFleet?.cantidad_naves}</div>
              </div>

              <span className="text-white/70 text-sm">{selectedFleet?.nombre_imperio}</span>
            </div>

            <img
              src={imageSrc}
              className="transition-alldrop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] w-24 h-30 object-cover"
            />
          </header>

          <hr className="border-white/40 mb-4" />

          <main className="overflow-x-auto w-full">
            <h4 className="font-semibold text-md text-white/80 mb-4">Naves</h4>
            {isFleetsLoading.fleetShips
              ? <span className="loading loading-infinity loading-lg text-primary"></span>
              : (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th className="text-left">Nombre</th>
                      <th className="text-left">Modelo</th>
                      <th className="text-left">Vida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      fleetShips.map((fleetShip, index) => (
                        <tr key={fleetShip.ID_nave}>
                          <th>{index + 1}</th>
                          <td className="text-left">{fleetShip.Nombre}</td>
                          <td className="text-left">{fleetShip.Modelo}</td>
                          <td className="text-left relative">
                            <span className="absolute -translate-x-1/2 left-1/2 z-50 text-xs bottom-[3px] text-black font-bold">{fleetShip.Vida}%</span>
                            <progress className="progress progress-success progress-md h-[10px]" title={fleetShip.VIda} value={fleetShip.Vida} max="100"></progress>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )
            }
          </main>

          <div className="modal-action">
            <form method="dialog" className="flex gap-4">
              <button className="btn btn-sm btn-primary text-white" onClick={handleMoveFleet}>Mover flota</button>
              <button className="btn btn-sm btn-secondary text-white">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>
    </ModalFleetContext.Provider>
  )
}

ModalFleetProvider.propTypes = {
  children: PropTypes.node.isRequired
}