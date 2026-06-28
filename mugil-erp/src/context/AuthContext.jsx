import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const CREDENTIALS = {
  username: 'mohan',
  password: '1234',
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const login = (username, password) => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      setIsAuthenticated(true)
      setUser({ username })
      return { success: true }
    }
    return { success: false, message: 'Incorrect username or password. Please try again.' }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
    {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


