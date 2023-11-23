import { useState } from "react"
import backend from "../api/backend"
import { useEffect } from "react"
import { getParamsAndRefill } from "../helpers"
import { toast } from "sonner"

export const useFleets = ({ main = false }) => {
  const [fleets, setFleets] = useState([])
  const [isFleetsLoading, setIsFleetsLoading] = useState({
    fleets: true,
    fleetShips: false,
    updatePositionFleet: false,
    fleetOnPlanet: false
  })

  const setIsFetching = (state, bool) => {
    setIsFleetsLoading(prevState => ({ ...prevState, [state]: bool }))
  }
  
  useEffect(() => {
    if (main) {
      getFleets().then(setFleets)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const refreshFleets = () => {
    getFleets(true).then(setFleets)
  }

  const getFleets = async(refreshing = false) => {
    if (!refreshing) setIsFetching('fleets', true)

    try {
      const { data: responseData } = await backend.get('/fleets')
      toast.message('Se ejecutó una query.', { description: getParamsAndRefill(responseData.executedQuery.query, responseData.executedQuery.data) })
      return responseData.data
    } catch(error) {
      console.error(error.response.data.error)
      return []
    } finally {
      if (!refreshing) {
        if (!main) {
          setIsFetching('fleets', true)
        }
      } 
    }
  }

  const getFleetsByCoordinate = async(coordinate) => {
    setIsFetching('fleetOnPlanet', true)
    try {
      const { data: responseData } = await backend.get(`/fleets/${coordinate}`)
      toast.message('Se ejecutó una query.', { description: getParamsAndRefill(responseData.executedQuery.query, responseData.executedQuery.data) })
      return responseData.data
    } catch(error) {
      console.error(error.response.data.error)
      if (error.response.data.error.includes('_NOT_FOUND')) {
        toast.warning('Se ejecutó una query sin resultados.', { description: getParamsAndRefill(error.response.data.executedQuery.query, error.response.data.executedQuery.data) })
      }
      return []
    } finally {
      setIsFetching('fleetOnPlanet', false)
    }
  }

  const getFleetShips = async(id) => {
    setIsFetching('fleetShips', true)
    try {
      const { data: responseData } = await backend.get(`/fleets/${id}/ships`)
      toast.message('Se ejecutó una query.', { description: getParamsAndRefill(responseData.executedQuery.query, responseData.executedQuery.data) })
      return responseData.data
    } catch(error) {
      console.error(error.response.data.error)
      return []
    } finally {
      setIsFetching('fleetShips', false)
    }
  }

  const updatePositionFleet = async(id, coordinate) => {
    setIsFetching('updateFleetPosition', true)
    try {
      const { data: responseData } = await backend.put(`/fleets/${id}/coordinate`, { coordinate })
      toast.message('Se ejecutó una query.', { description: getParamsAndRefill(responseData.executedQuery.query, responseData.executedQuery.data) })
      return true
    } catch(error) {
      console.error(error.response.data.error)
      return false
    } finally {
      setIsFetching('fleetShips', false)
    }
  }

  return {
    refreshFleets,
    getFleetShips,
    fleets,
    isFleetsLoading,
    updatePositionFleet,
    getFleetsByCoordinate,
    setIsFetching
  }
}