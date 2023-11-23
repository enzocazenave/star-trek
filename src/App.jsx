import { useContext } from "react";
import { Fleet, Planet } from "./components";
import { getFleetByPosition, getPlanetByPosition, verifyIfFleetExistInPosition, verifyIfPlanetExistInPosition } from "./helpers";
import { usePlanets, useFleets } from "./hooks";
import { PositionSelectorContext } from "./contexts/PositionSelectorContext";
import Swal from 'sweetalert2'
import { useEffect } from "react";

const positions = new Array(128).fill(0);

export const App = () => {
  const { planets, isPlanetsLoading, refreshPlanets } = usePlanets()
  const { updatePositionFleet, fleets, isFleetsLoading, refreshFleets, setIsFetching } = useFleets({ main: true })
  const { isInSelectionMode, setSelectedPosition, selectedPosition, setIsInSelectionMode, selectedFleetId, setSelectedFleetId, setLastMovedFleet, setIsMoveConfirmed } = useContext(PositionSelectorContext)

  const handlePositionClick = (pos) => {
    setLastMovedFleet(-1)
    setSelectedPosition(pos)

    Swal.fire({
      title: '¿Estas seguro?',
      text: '¿Estas seguro que quieres mover tu flota a esta posición?',
      icon: 'warning',
      background: 'rgb(5,23, 42)',
      color: '#fff',
      showCancelButton: true,
      confirmButtonColor: 'oklch(0.6569, 0.196, 275.75)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsMoveConfirmed(true)

        setTimeout(() => {
          updatePositionFleet(selectedFleetId, pos)
            .then(() => {
              setLastMovedFleet(selectedFleetId)
              handleLeaveSelectionMode()
              refreshFleets()
              refreshPlanets()
            })
        }, 500)
      } else {
        setSelectedPosition(-1)
      }
    });
  }

  const handleLeaveSelectionMode = () => {
    setIsInSelectionMode(false)
    setIsMoveConfirmed(false)
    setSelectedPosition(-1)
    setSelectedFleetId(-1)
  }

  useEffect(() => {
    setTimeout(() => {
      setIsFetching('fleets', false)
    }, 2500)
  }, [])

  return (
    <main className="bg-space-background bg-cover h-screen">
      { isFleetsLoading.fleets || isPlanetsLoading.planets ? (
        <div className="fixed z-50 w-full h-full bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center">
          <h1 className="text-primary text-3xl font-bold">STAR TREK</h1>
          <span className="loading loading-infinity loading-lg text-primary"></span>
        </div>) : null
      }

      {isInSelectionMode && (
        <button onClick={handleLeaveSelectionMode} className="btn btn-sm btn-primary fixed left-2 top-2 z-50">
          Salir del modo de selección
        </button>
      )}

      <div className="grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(8,1fr)] h-screen w-screen p-2">
        {positions.map((_, position) => (
          <div
            key={position}
            className={`
                  relative overflow-x-visible overflow-y-visible
                  ${isInSelectionMode && verifyIfFleetExistInPosition(position, fleets) && !verifyIfPlanetExistInPosition(position, planets)
                ? 'hover:bg-red-500/20 cursor-pointer transition-colors'
                : isInSelectionMode && selectedPosition !== position ? 'hover:bg-white/20 cursor-pointer transition-colors' : ''}
                  ${isInSelectionMode && selectedPosition === position && 'bg-green-500/30'}
                `}
            onClick={() => {
              if ((!verifyIfFleetExistInPosition(position, fleets) || (verifyIfFleetExistInPosition(position, fleets) && verifyIfPlanetExistInPosition(position, planets))) && isInSelectionMode) handlePositionClick(position)
            }}
          >
            {verifyIfPlanetExistInPosition(position, planets)
              ? <Planet planet={getPlanetByPosition(position, planets)} />
              : verifyIfFleetExistInPosition(position, fleets) && (
                <Fleet fleet={getFleetByPosition(position, fleets)} />
              )
            }
          </div>
        ))}
      </div>
    </main>
  )
} 