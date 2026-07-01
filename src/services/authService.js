import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { USE_LOCAL_TOKEN, LOCAL_JWT } from "../api/authConfig";

class AuthService {
  extractToken(response) {
    const payload = response?.data;
    const possibleFields = [
      "token",
      "jwt",
      "accessToken",
      "access_token",
      "Authorization",
      "authorization",
      "jwtToken",
      "authToken",
      "bearerToken",
      "data",
    ];

    const tokenFromHeader = response?.headers?.authorization || response?.headers?.Authorization;

    if (typeof tokenFromHeader === "string" && tokenFromHeader) {
      return tokenFromHeader.startsWith("Bearer ") ? tokenFromHeader.slice(7) : tokenFromHeader;
    }

    for (const field of possibleFields) {
      const value = payload?.[field];
      if (typeof value === "string" && value) {
        const normalized = value.startsWith("Bearer ") ? value.slice(7) : value;
        if (normalized.includes(".") || normalized.length > 20) {
          return normalized;
        }
      }
    }

    if (typeof payload === "string" && payload) {
      return payload.startsWith("Bearer ") ? payload.slice(7) : payload;
    }

    return null;
  }

  async login(credentials) {
    try {
      if (USE_LOCAL_TOKEN && LOCAL_JWT) {
        this.verifyToken(LOCAL_JWT);
        sessionStorage.setItem("token", LOCAL_JWT);
        return { token: LOCAL_JWT };
      }

      const response = await api.post("/admin/login", credentials);
      const token = this.extractToken(response);

      if (!token) {
        throw new Error("JWT Token not received from backend");
      }

      this.verifyToken(token);
      sessionStorage.setItem("token", token);

      return response.data;
    } catch (error) {
      console.error("Admin Login Error:", error);
      throw error;
    }
  }

  logout() {
    sessionStorage.removeItem("token");
    window.location.replace("/admin");
  }

  getToken() {
    return sessionStorage.getItem("token");
  }

  getAdminDetails() {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const decoded = this.verifyToken(token);

      return {
        name: decoded?.name || decoded?.fullName || decoded?.adminName || decoded?.sub || "Administrator",
        email: decoded?.email || decoded?.username || decoded?.sub || "",
        role: decoded?.role || decoded?.roles || "Administrator",
        issuedAt: decoded?.iat || null,
        expiresAt: decoded?.exp || null,
      };
    } catch {
      return null;
    }
  }

  verifyToken(token) {
    try {
      const decoded = jwtDecode(token);

      if (!decoded.exp) {
        throw new Error("Invalid JWT");
      }

      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        throw new Error("JWT Expired");
      }

      return decoded;
    } catch (error) {
      sessionStorage.removeItem("token");
      throw error;
    }
  }

  isAuthenticated() {
    const token = this.getToken();

    if (!token) return false;

    try {
      this.verifyToken(token);
      return true;
    } catch {
      return false;
    }
  }
}

export default new AuthService();