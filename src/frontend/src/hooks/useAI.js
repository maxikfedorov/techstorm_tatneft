import { useState, useCallback } from 'react'
import { aiService } from '../services/aiService'

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [response, setResponse] = useState('')

  const generateDiagram = useCallback(async (request) => {
    if (!request.prompt?.trim()) return

    setIsLoading(true)
    setError(null)
    setResponse('')

    try {
      const result = await aiService.generate(request)
      setResponse(result.content)
      return result.content
    } catch (err) {
      const errorMessage = err.message || 'Произошла ошибка при генерации'
      setError(errorMessage)
      setResponse(`Ошибка: ${errorMessage}`)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResponse('')
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    response,
    generateDiagram,
    reset
  }
}
