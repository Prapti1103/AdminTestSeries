import { createContext, useState } from "react";
import AuthService from "../services/authService";
import { USE_LOCAL_TOKEN, LOCAL_JWT } from "../api/authConfig";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (USE_LOCAL_TOKEN && LOCAL_JWT) {
      try {
        AuthService.verifyToken(LOCAL_JWT);
        return true;
      } catch {
        return false;
      }
    }

    return AuthService.isAuthenticated();
  });

  const [token, setToken] = useState(() => {
    if (USE_LOCAL_TOKEN && LOCAL_JWT) {
      return LOCAL_JWT;
    }

    return AuthService.getToken();
  });

  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    const response = await AuthService.login(credentials);
    const savedToken = AuthService.getToken();

    setToken(savedToken);
    setIsAuthenticated(true);
    setLoading(false);

    return response;
  };

  const logout = () => {
    AuthService.logout();
    setToken(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};