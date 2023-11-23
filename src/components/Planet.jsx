import PropTypes from 'prop-types';
import { useContext } from 'react';
import { DrawerPlanetContext } from '../contexts/DrawerPlanetContext';
import { PositionSelectorContext } from '../contexts/PositionSelectorContext';

export const Planet = ({ planet }) => {

  const { handleSelectedPlanet } = useContext(DrawerPlanetContext)
  const { isInSelectionMode } = useContext(PositionSelectorContext)

  const handleClick = () => {
    if (!isInSelectionMode) handleSelectedPlanet(planet)
  }
  
  return (
    <label htmlFor="planet-drawer" onClick={handleClick}>
      <div className="relative h-full" >
        <img
          src={ `../src/assets/planets/${planet?.Nombre}.png` }
          className="absolute hover:scale-[1.05] hover:opacity-80 transition-all cursor-pointer drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)]"
        />
        { planet?.cantidad_flotas > 0 && <div className="badge badge-secondary text-white text-md absolute right-3 bottom-6">{planet?.cantidad_flotas}</div> }
      </div>
    </label>
  );
};

Planet.propTypes = {
  planet: PropTypes.object.isRequired,
};
