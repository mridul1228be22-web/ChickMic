const API_BASE = '/api'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (response.status === 502) {
    throw new ApiError('Server is not running. Run npm run dev in the project folder.', 502)
  }

  if (!response.ok) {
    throw new ApiError(data.message || 'Something went wrong. Please try again.', response.status)
  }

  return data
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Run npm run dev and try again.', 0)
  }

  return parseResponse(response)
}
