import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
dotenv.config({ path: path.join(projectRoot, '.env') })
dotenv.config({ path: path.join(projectRoot, '..', '.env') })

const app = express()
const PORT = process.env.PORT || 3001

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'chickmic-dev-secret-change-me'
}

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    database: mongoose.connection.readyState === 1,
  })
})

app.use('/api/auth', authRoutes)

async function start() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('Missing MONGODB_URI in .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`)
  })
}

start()
