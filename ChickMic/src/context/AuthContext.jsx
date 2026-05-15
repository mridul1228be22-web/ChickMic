import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/api.js'
import { AuthContext } from './auth-context.js'

const TOKEN_KEY = 'chickmic_auth_token'
const USER_KEY = 'chickmic_auth_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const saved = localStorage.getItem(USER_KEY)
    return savedToken && saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  const persistSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    localStorage.setItem(TOKEN_KEY, nextToken)
  }, [])

  const clearSession = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }, [])

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const { user: currentUser } = await apiRequest('/auth/me', { token })
        setUser(currentUser)
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
      } catch {
        clearSession()
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [token, clearSession])

  const loginWithEmail = useCallback(
    async (email, password) => {
      const { user: loggedInUser, token: sessionToken } = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      persistSession(loggedInUser, sessionToken)
      return loggedInUser
    },
    [persistSession],
  )

  const registerWithEmail = useCallback(
    async (name, email, password) => {
      const { user: newUser, token: sessionToken } = await apiRequest('/auth/register', {
        method: 'POST',
        body: { name, email, password },
      })
      persistSession(newUser, sessionToken)
      return newUser
    },
    [persistSession],
  )

  const logout = useCallback(async () => {
    clearSession()
  }, [clearSession])

  const updateUserProfile = useCallback(
    async (updates) => {
      if (!token) throw new Error('You need to login first.')
      const { user: updatedUser } = await apiRequest('/auth/profile', {
        method: 'PATCH',
        token,
        body: updates,
      })
      setUser(updatedUser)
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
      return updatedUser
    },
    [token],
  )

  const value = useMemo(
    () => ({
      user,
      loading,
      loginWithEmail,
      registerWithEmail,
      logout,
      updateUserProfile,
    }),
    [user, loading, loginWithEmail, registerWithEmail, logout, updateUserProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
