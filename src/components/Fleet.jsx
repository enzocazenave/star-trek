import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ModalFleetContext } from '../contexts/ModalFleetContext';
import { PositionSelectorContext } from '../contexts/PositionSelectorContext';

export const Fleet = ({ fleet }) => {

  const { handleSelectedFleet } = useContext(ModalFleetContext)
  const { isInSelectionMode, lastMovedFleet, isMoveConfirmed, selectedFleetId, selectedPosition } = useContext(PositionSelectorContext)

  const handleClick = () => {
    if (!isInSelectionMode) handleSelectedFleet(fleet)
  }

  const fleetName = fleet.Nombre.split(' ')[1].toLowerCase()
  const imageSrc = `../src/assets/fleets/${['fup', 'romulana', 'cardassiana', 'ferengi'].includes(fleetName) ? fleetName : 'uss' }.png`

  return (
    <div 
      className={`
        relative h-full 
        ${lastMovedFleet === fleet.id_flota && 'animate-zoom-in'}
        ${isMoveConfirmed && selectedFleetId === fleet.id_flota && 'animate-zoom-out'}
      `}
      onClick={handleClick}
    >
      <img 
        src={imageSrc}
        className="w-full h-full object-contain absolute hover:scale-[1.05] hover:opacity-80 transition-all cursor-pointer drop-shadow-[0_35px_35px_rgba(255,255,0,0.15)]"
      />
      <div className="badge badge-primary text-white text-md absolute right-3 bottom-6">{fleet?.cantidad_naves}</div>
    </div>
  )
}

Fleet.propTypes = {
  fleet: PropTypes.object.isRequired,
};