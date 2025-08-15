import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext({
  token: null,
  role: null,
  username: null,
  isAuthenticated: false,
  initializing: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth.token");
    const storedRole = localStorage.getItem("auth.role");
    const storedUsername = localStorage.getItem("auth.username");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
      if (storedUsername) setUsername(storedUsername);
    }
    setInitializing(false);
  }, []);

  const login = useCallback((newToken, newRole, newUsername) => {
    setToken(newToken);
    setRole(newRole);
    setUsername(newUsername || null);
    localStorage.setItem("auth.token", newToken);
    localStorage.setItem("auth.role", newRole);
    if (newUsername) localStorage.setItem("auth.username", newUsername);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRole(null);
    setUsername(null);
    localStorage.removeItem("auth.token");
    localStorage.removeItem("auth.role");
    localStorage.removeItem("auth.username");
  }, []);

  const value = useMemo(() => ({
    token,
    role,
    username,
    isAuthenticated: Boolean(token && role),
    initializing,
    login,
    logout,
  }), [token, role, username, initializing, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


