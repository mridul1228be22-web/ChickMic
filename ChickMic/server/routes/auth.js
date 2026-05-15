import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { requireDatabase } from '../middleware/db.js'

const router = Router()

router.use(requireDatabase)

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

router.post('/register', async (request, response) => {
  try {
    const { name, email, password } = request.body
    if (!name?.trim() || !email?.trim() || !password) {
      return response.status(400).json({ message: 'Name, email, and password are required.' })
    }
    if (password.length < 6) {
      return response.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return response.status(409).json({ message: 'Account already exists. Please sign in.' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      displayName: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      address: { fullName: name.trim() },
    })

    const token = signToken(user._id)
    return response.status(201).json({ user: user.toPublicJSON(), token })
  } catch (error) {
    console.error('Register error:', error)
    return response.status(500).json({ message: 'Could not create account. Try again.' })
  }
})

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body
    if (!email?.trim() || !password) {
      return response.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = signToken(user._id)
    return response.json({ user: user.toPublicJSON(), token })
  } catch (error) {
    console.error('Login error:', error)
    return response.status(500).json({ message: 'Login failed. Try again.' })
  }
})

router.get('/me', requireAuth, (request, response) => {
  return response.json({ user: request.user.toPublicJSON() })
})

router.patch('/profile', requireAuth, async (request, response) => {
  try {
    const { displayName, address } = request.body
    if (displayName?.trim()) request.user.displayName = displayName.trim()
    if (address) {
      request.user.address = {
        ...request.user.address.toObject?.() ?? request.user.address,
        ...address,
      }
      if (displayName?.trim()) request.user.address.fullName = displayName.trim()
    }
    await request.user.save()
    return response.json({ user: request.user.toPublicJSON() })
  } catch (error) {
    console.error('Profile update error:', error)
    return response.status(500).json({ message: 'Could not update profile.' })
  }
})

export default router
