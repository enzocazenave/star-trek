import { createContext } from "react";
import PropTypes from 'prop-types'
import { useState } from "react";

export const PositionSelectorContext = createContext({})

export const PositionSelectorProvider = ({ children }) => {

  const [isInSelectionMode, setIsInSelectionMode] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(-1)
  const [selectedFleetId, setSelectedFleetId] = useState(-1)
  const [lastMovedFleet, setLastMovedFleet] = useState(-1)
  const [isMoveConfirmed, setIsMoveConfirmed] = useState(false)

  return (
    <PositionSelectorContext.Provider value={{ 
      isInSelectionMode,
      selectedPosition,
      selectedFleetId,
      lastMovedFleet,
      isMoveConfirmed,
      setSelectedPosition,
      setIsInSelectionMode,
      setSelectedFleetId,
      setLastMovedFleet,
      setIsMoveConfirmed
    }}>
      { children }
    </PositionSelectorContext.Provider>
  )
}

PositionSelectorProvider.propTypes = {
  children: PropTypes.node.isRequired
}