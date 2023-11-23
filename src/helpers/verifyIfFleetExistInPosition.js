export const verifyIfFleetExistInPosition = (position, fleets) => fleets.some(fleet => fleet.coordenadas === position)
