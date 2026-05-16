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
    
    console.log("🔵 API Request:", config.method.toUpperCase(), config.url);
    console.log("Token in sessionStorage:", authToken ? `${authToken.substring(0, 20)}...` : "❌ NO TOKEN");
    
    if (authToken) {
      // Check if token already has Bearer prefix
      const tokenValue = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;
      config.headers.Authorization = tokenValue;
      console.log("✅ Authorization header set");
    } else {
      console.warn("⚠️ NO TOKEN FOUND - User may not be authenticated");
    }
    
    // Ensure Content-Type is set for non-file uploads
    if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
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
    console.log("✅ API Response SUCCESS:", response.config.url, response.status);
    console.log("Response data:", response.data);
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


// Get test series order statistics (cards data)
export const getTestSeriesOrderStats = async () => {
  try {
    const response = await api.get("/getTestSeriesOrderStats");
    return response.data; 
  } catch (error) {
    console.error("Error fetching test series order stats:", error);
    throw error;
  }
};

// Get revenue and count by test series (pie chart data)
export const getTestSeriesRevenueAndCount = () => {
  return api.get("/getRevenueAndCountByTestSeries");
};

// Get monthly revenue and count by year (monthly graph data)
export const getMonthlyTestSeriesReport = (year) => {
  return api.get("/getMonthlyRevenueAndCountByYear", {
    params: { year }
  });
};

// Get daily revenue and count (daily graph data)
export const getTestSeriesDailyReport = (year, month) => {
  return api.get("/dailyrevenue", {
    params: { year, month }
  });
};


//order List APIs
export const getAllTestSeriesOrders = () => {
  return api.get("/testseries/orders");
};

// Category APIs


// Question APIs
export const getQuestionsBySection = (section) => {
  return api.get(`/QuestionsBySections/${section}`);
};

export const getTestPaperQuestions = (testPaperId) => {
  return api.get(`/TestPaperQuestions/${testPaperId}`);
};

export const getQuestionCount = (testPaperId) => {
  return api.get(`/QuestionCount/${testPaperId}`);
};

export const getSectionQuestionCount = (section) => {
  return api.get(`/questioncountbysection`, { params: { section } });
};

export const addQuestionsToTestPaper = (testPaperId, questionIds) => {
  return api.post(`/addQuestionsToTestPaper/${testPaperId}`, questionIds, {
    headers: { "Content-Type": "application/json" },
  });
};

export const removeQuestionsFromTestPaper = (testPaperId, questionIds) => {
  return api.put(`/removequestions/${testPaperId}`, questionIds, {
    headers: { "Content-Type": "application/json" },
  });
};

// VTCategory APIs
export const createVTCategory = (data) => {
  console.log("Creating category with data:", data);
  return api.post("/categories/SaveCategory", data).catch(err => {
    console.error("Create category error:", err.response?.data || err.message);
    throw err;
  });
};

export const GetAllCategories = () => {
  console.log("Fetching all categories");
  return api.get("/categories/GetAllCategories").catch(err => {
    console.error("Get categories error:", err.response?.data || err.message);
    throw err;
  });
};

export const updateVTCategory = (id, data) => {
  console.log("Updating category:", id, data);

  return api.put(`/categories/UpdateCategory/${id}`, data).catch(err => {
    console.error(
      "Update category error:",
      err.response?.data || err.message
    );
    throw err;
  });
};

export const deleteVTCategory = (id) => {
  console.log("Deleting category:", id);
  return api.delete(`/categories/DeleteCategory/${id}`).catch(err => {
    console.error("Delete category error:", err.response?.data || err.message);
    throw err;
  });
};

// VTSection APIs
export const createSection = (data) => {
  return api.post("/sections", data);
};

export const getAllSections = () => {
  return api.get("/sections");
};

export const updateSection = (id, data) => {
  return api.put(`/sections/${id}`, data);
};

export const deleteSection = (id) => {
  return api.delete(`/sections/${id}`);
};

// API functions for TestSeries
export const getAllTestSeries = () => {
  return api.get("/getAllTestSeries");
};

export const createTestSeries = (data) => {
  return api.post("/createTestSeries", data);
};

export const UpdateTestSeries = (id, data) => {
  return api.put(`/UpdateTestSeries/${id}`, data);
};

export const deleteTestSeries = (id) => {
  return api.delete(`/deleteTestSeries/${id}`);
};

export const getTestPapersByTestSeries = (testSeriesId) => {
  return api.get(`/TestSeriesById/${testSeriesId}`);
};

export const uploadTestSeriesImage = (id, formData) => {
  return api.post(`/uploadImage/${id}`, formData);
};

export const updateTestSeriesImage = (id, formData) => {
  return api.put(`/updateImage/${id}`, formData);
};

// VT Test paper apis
// Test Papers APIs
export const CreatePaper = (data) => {
  return api.post("/CreatePaper", data);
};

export const UpdatePaper = (id, data) => {
  return api.put(`/UpdatePaper/${id}`, data);
};

export const getPaperById = (id) => {
  return api.get(`/getPaperById/${id}`);
};
export const uploadTestPaperImage = (testPaperId, formData) => {
  return api.post(`/${testPaperId}/uploadTestPaperImage`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateTestPaperImage = (testPaperId, formData) => {
  return api.put(`/${testPaperId}/updateTestPaperImage`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const GetAllPapers = () => api.get("/GetAllPapers");
export const getAllTestSeriesNames = () => api.get("/getAllTestSeriesNames");
export const DeletePaper = (id) => api.delete(`/DeletePaper/${id}`);
export const getSolvedCount = (testPaperId) => {
  return api.get(`/SolvedTestPaperCount/${testPaperId}`);
};
export const getRanking = (testPaperId) =>{
  return api.get(`/ranking/${testPaperId}`);
}
export const fetchQuestionByTestPaperId = (testPaperId) =>{
  return api.get(`/TestPaperQuestions/${testPaperId}`)
}
export const getAllPapers = () => {
  return api.get("/GetAllPapers");
};
export const getQuestionsCountBySection = (section) => {
  return api.get(`/questioncountbysection/${section}`);
};

export const getTotalQuestionCount = () => {
  return api.get("/countofquestion");
};

export const getAllQuestions = () => {
  return api.get("/getAllQuestions");
};

export const createQuestion = (data) => {
  return api.post("/createQuestion", data);
};

export const updateQuestion = (id, data) => {
  return api.put(`/updateQuestionById/${id}`, data);
};

export const deleteQuestion = (id) => {
  return api.delete(`/DeleteQuestion/${id}`);
};
// New function for updating showTestResult
export const updateShowTestResult = async (testPaperId, newShowTestResult) => {
  const response = await api.put(
    `/updateShowTestPaperResult/${testPaperId}`,
    null, // No request body
    {
      params: {
        showTestResult: newShowTestResult,
      },
    }
  );
  return response;
};

export const uploadAllResultPdf = (testPaperId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/uploadAllResultPdf/${testPaperId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateAllResultPdf = (testPaperId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.put(`/updateAllResultPdf/${testPaperId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateShowAllResult = async (testPaperId, newShowAllResult) => {
  const response = await api.put(
    `/updateShowAllResult/${testPaperId}`,
    null,
    {
      params: {
        showAllResult: newShowAllResult,
      },
    }
  );
  return response;
};


export const updateDownloadTestPaper = async (testPaperId, newDownloadStatus) => {
  return await api.put(
    `/updateDownloadTestPaper/${testPaperId}`,
    null,
    {
      params: {
        downloadTestPaper: newDownloadStatus,
      },
    }
  );
};