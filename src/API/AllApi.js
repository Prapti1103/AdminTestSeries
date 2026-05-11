import axios from "axios";

// Use relative path for API calls - Vite proxy will handle routing
const api = axios.create({
  baseURL: "/api",
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    console.log("Token in sessionStorage:", token ? `${token.substring(0, 10)}...` : "NO TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set");
    } else {
      console.warn("⚠️ NO TOKEN FOUND - User may not be authenticated");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration and 403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("🔴 401 Unauthorized - Token expired");
      sessionStorage.removeItem("token");
      // Only redirect if not in development
      if (window.location.hostname !== 'localhost') {
        window.location.href = "/admin";
      }
    }
    if (error.response && error.response.status === 403) {
      console.error("🔴 403 Forbidden - No valid token or insufficient permissions");
      // Don't redirect on 403, just reject the error
      // Only redirect if not in development
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
    const res = await axios.get(
      // eslint-disable-next-line no-undef
      `${ {baseURL}}/solved-testpapers/${userId}`
    );
    return res;
  } catch (error) {
    console.error("Error fetching solved test papers:", error);
    throw error;
  }
};