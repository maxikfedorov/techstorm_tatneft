class AIService {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL
  }

  async generate(request) {
    const response = await fetch(`${this.baseURL}/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  async health() {
    const response = await fetch(`${this.baseURL}/health`)
    return await response.json()
  }
}

export const aiService = new AIService()
