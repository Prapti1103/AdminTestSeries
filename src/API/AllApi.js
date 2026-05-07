import axios from "axios";

const BASE_URL = "http://localhost:8080";


// ================= USERS =================

// Get all users
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/users/all`);
    return res;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Create user
export const createUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, data);
    return res;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Login
export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, data);
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
    const res = await axios.post(`${BASE_URL}/SaveCategory`, data);
    return res;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Get All Categories
export const getAllCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/GetAllCategories`);
    return res;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Delete Category
export const deleteCategory = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/DeleteCategory/${id}`);
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
    const res = await axios.post(`${BASE_URL}/createSubject`, data);
    return res;
  } catch (error) {
    console.error("Error creating section:", error);
    throw error;
  }
};

// Get All Sections
export const getAllSections = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/GetAllSubjects`);
    return res;
  } catch (error) {
    console.error("Error fetching sections:", error);
    throw error;
  }
};

// Delete Section
export const deleteSection = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/DeleteSubject/${id}`);
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
      `${BASE_URL}/solved-testpapers/${userId}`
    );
    return res;
  } catch (error) {
    console.error("Error fetching solved test papers:", error);
    throw error;
  }
};