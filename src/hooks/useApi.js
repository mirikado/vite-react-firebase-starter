import { useState, useCallback } from 'react'

export const useApi = () => {
  const [loadingMap, setLoadingMap] = useState({}) // Dùng object thay vì boolean
  const [error, setError] = useState(null)

  const callApi = useCallback(async (key, apiFn,...args) => {
    setLoadingMap(prev => ({...prev, [key]: true }))
    setError(null)
    try {
      return await apiFn(...args)
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoadingMap(prev => ({...prev, [key]: false }))
    }
  }, [])

  return { loadingMap, error, callApi }
}