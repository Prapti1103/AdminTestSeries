import axios from "axios";

// Use relative path for API calls - Vite proxy will handle routing
const api = axios.create({
  baseURL: "/api",
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    const authToken = token?.trim(); // Remove whitespace
    
    console.log("🔵 API Request:", config.url);
    console.log("Token in sessionStorage:", authToken ? `${authToken.substring(0, 20)}...` : "❌ NO TOKEN");
    
    if (authToken) {
      // Check if token already has Bearer prefix
      const tokenValue = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;
      config.headers.Authorization = tokenValue;
      console.log("✅ Authorization header set");
    } else {
      console.warn("⚠️ NO TOKEN FOUND - User may not be authenticated");
    }
    
    // Ensure Content-Type is set
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration and 403 errors
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response SUCCESS:", response.config.method.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const errorMsg = error.response?.data?.message || error.message;
    
    console.error(`🔴 HTTP ${status} Error on ${url}:`, errorMsg);
    console.error("Error details:", error.response?.data);
    
    if (status === 401) {
      console.error("🔴 401 Unauthorized - Token expired or invalid");
      sessionStorage.removeItem("token");
      if (window.location.hostname !== 'localhost') {
        window.location.href = "/admin";
      }
    }
    
    if (status === 403) {
      console.error("🔴 403 Forbidden - No valid token or insufficient permissions");
      console.error("Response data:", error.response?.data);
      
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("⚠️ No token found in sessionStorage! User needs to login.");
      } else {
        console.error("Token exists but was rejected. Check if token is valid or expired.");
      }
      
      if (window.location.hostname !== 'localhost') {
        sessionStorage.removeItem("token");
        window.location.href = "/admin";
      }
    }
    
    return Promise.reject(error);
  }
);

// ================= USERS =================

// Get all users
export const getAllUsers = async () => {
  try {
    const res = await api.get(`/users/all`);
    return res;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Create user
export const createUser = async (data) => {
  try {
    const res = await api.post(`/register`, data);
    return res;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Login
export const loginUser = async (data) => {
  try {
    const res = await api.post(`/login`, data);
    return res;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};


// ================= CATEGORY =================

// Create Category
export const createCategory = async (data) => {
  try {
    const res = await api.post(`/SaveCategory`, data);
    return res;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Get All Categories
export const getAllCategories = async () => {
  try {
    const res = await api.get(`/GetAllCategories`);
    return res;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Delete Category
export const deleteCategory = async (id) => {
  try {
    const res = await api.delete(`/DeleteCategory/${id}`);
    return res;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};


// ================= SECTION =================

// Create Section (Subject)
export const createSection = async (data) => {
  try {
    const res = await api.post(`/createSubject`, data);
    return res;
  } catch (error) {
    console.error("Error creating section:", error);
    throw error;
  }
};

// Get All Sections
export const getAllSections = async () => {
  try {
    const res = await api.get(`/GetAllSubjects`);
    return res;
  } catch (error) {
    console.error("Error fetching sections:", error);
    throw error;
  }
};

// Delete Section
export const deleteSection = async (id) => {
  try {
    const res = await api.delete(`/DeleteSubject/${id}`);
    return res;
  } catch (error) {
    console.error("Error deleting section:", error);
    throw error;
  }
};


// ================= SOLVED TEST PAPERS =================

// Get All Solved Test Papers
export const getAllSolvedTestPapers = async (userId) => {
  try {
    const res = await api.get(`/solved-testpapers/${userId}`);
    return res;
  } catch (error) {
    console.error("Error fetching solved test papers:", error);
    throw error;
  }
};