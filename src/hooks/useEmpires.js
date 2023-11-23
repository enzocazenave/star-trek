import { useState } from "react"
import backend from "../api/backend"
import { toast } from "sonner"
import { getParamsAndRefill } from "../helpers"

export const useEmpires = () => {
  const [isEmpiresLoading, setIsEmpiresLoading] = useState({
    empires: false
  })

  const setIsFetching = (state, bool) => {
    setIsEmpiresLoading(prevState => ({ ...prevState, [state]: bool }))
  }
  
  const getEmpireById = async(id) => {
    setIsFetching('empires', true)

    try {
      const { data: responseData } = await backend.get(`/empires/${id}`)
      toast.message('Se ejecutó una query.', { description: getParamsAndRefill(responseData.executedQuery.query, responseData.executedQuery.data) })
      return responseData.data
    } catch(error) {
      console.error(error.response.data.error)
      if (error.response.data.error.includes('_NOT_FOUND')) {
        toast.warning('Se ejecutó una query sin resultados.', { description: getParamsAndRefill(error.response.data.executedQuery.query, error.response.data.executedQuery.data) })
      }
      return []
    } finally {
      setIsFetching('empires', false)
    }
  }

  return {
    isEmpiresLoading,
    getEmpireById
  }
}