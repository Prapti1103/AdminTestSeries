import axios from "axios";

const BASE_URL = "http://localhost:8080"; // backend URL

// ✅ Get All Users (Table ke liye)
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/getAllUsers`);
    return res;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// ✅ Create User (Admin modal se)
export const createUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, data);
    return res;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// ✅ Login (optional - agar admin login bhi use kare)
export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, data);
    return res;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};