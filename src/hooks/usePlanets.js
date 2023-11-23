import { useEffect } from "react"
import { useState } from "react"
import backend from "../api/backend"
import { toast } from "sonner"
import { getParamsAndRefill } from "../helpers"

export const usePlanets = () => {
  const [planets, setPlanets] = useState([])
  const [isPlanetsLoading, setIsPlanetsLoading] = useState({
    planets: true
  })

  const setIsFetching = (state, bool) => {
    setIsPlanetsLoading(prevState => ({ ...prevState, [state]: bool }))
  }

  const refreshPlanets = () => {
    getPlanets().then(setPlanets)
  }

  useEffect(() => {
    getPlanets().then(setPlanets)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const getPlanets = async() => {
    try {
      const { data: responseData } = await backend.get('/planets')
      toast.message('Se ejecutó una query.', { description: getParamsAndRefill(responseData.executedQuery.query, responseData.executedQuery.data) })
      return responseData.data
    } catch(error) {
      console.error(error.response.data.error)
      return []
    } finally {
      setIsFetching('planets', false)
    }
  }

  return {
    planets,
    isPlanetsLoading,
    refreshPlanets
  }
}