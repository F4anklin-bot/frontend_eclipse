import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext({
  token: null,
  role: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth.token");
    const storedRole = localStorage.getItem("auth.role");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const login = useCallback((newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
    localStorage.setItem("auth.token", newToken);
    localStorage.setItem("auth.role", newRole);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("auth.token");
    localStorage.removeItem("auth.role");
  }, []);

  const value = useMemo(() => ({
    token,
    role,
    isAuthenticated: Boolean(token && role),
    login,
    logout,
  }), [token, role, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


