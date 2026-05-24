import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  // Validate token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      authApi.me()
        .then(r => setUser(r.data))
        .catch(() => { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_user'); setUser(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password })
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (formData) => {
    const { data } = await authApi.register(formData)
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('auth_user', JSON.stringify(updatedUser))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
