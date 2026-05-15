import mongoose from 'mongoose'

export function requireDatabase(_request, response, next) {
  if (mongoose.connection.readyState === 1) {
    return next()
  }
  return response.status(503).json({ message: 'Database unavailable. Please try again in a moment.' })
}
