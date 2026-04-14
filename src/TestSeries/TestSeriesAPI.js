import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      sessionStorage.removeItem("token");
      window.location.href = "/admin";
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
export const getAllCategories = () => {
  return api.get("/AllVTCategories");
};

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
  return api.post("/createVTCategory", data);
};

export const getAllVTCategories = () => {
  return api.get("/AllVTCategories");
};

export const updateVTCategory = (id, data) => {
  return api.put(`/updateVTCategory/${id}`, data);
};

export const deleteVTCategory = (id) => {
  return api.delete(`/deleteVTCategory/${id}`);
};

// VTSection APIs
export const createSection = (data) => {
  return api.post("/createSection", data);
};

export const getAllSections = () => {
  return api.get("/AllSections");
};

export const updateSection = (id, data) => {
  return api.put(`/updateSection/${id}`, data);
};

export const deleteSection = (id) => {
  return api.delete(`/deleteSection/${id}`);
};

// API functions for TestSeries
export const getAllTestSeries = () => {
  return api.get("/AllTestSeries");
};

export const createTestSeries = (data) => {
  return api.post("/createTestSeries", data);
};

export const updateTestSeries = (id, data) => {
  return api.put(`/updateTestSeries/${id}`, data);
};

export const deleteTestSeries = (id) => {
  return api.delete(`/deleteTestSeries/${id}`);
};

export const getTestPapersByTestSeries = (testSeriesId) => {
  return api.get(`/TestSeriesById/${testSeriesId}`);
};

export const uploadTestSeriesImage = (id, formData) => {
  return api.post(`/uploadImage/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateTestSeriesImage = (id, formData) => {
  return api.put(`/updateImage/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// VT Test paper apis
// Test Papers APIs
export const createTestPaper = (data) => {
  return api.post("/createTestPaper", data);
};

export const updateTestPaper = (id, data) => {
  return api.put(`/updateTestPaper/${id}`, data);
};

export const getTestPaperById = (id) => {
  return api.get(`/TestPaperById/${id}`);
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

export const getAllTestpapers = () => api.get("/AllTestPapers");
export const getAllTestSeriesNames = () => api.get("/getAllTestSeriesNames");
export const deleteTestPaper = (id) => api.delete(`/deleteTestPaper/${id}`);
export const getSolvedCount = (testPaperId) => {
  return api.get(`/SolvedTestPaperCount/${testPaperId}`);
};
export const getRanking = (testPaperId) =>{
  return api.get(`/ranking/${testPaperId}`);
}
export const fetchQuestionByTestPaperId = (testPaperId) =>{
  return api.get(`/TestPaperQuestions/${testPaperId}`)
}

export const getQuestionsCountBySection = (section) => {
  return api.get("/questioncountbysection", { params: { section } });
};

export const getTotalQuestionCount = () => {
  return api.get("/countofquestion");
};

export const getAllQuestions = () => {
  return api.get("/AllQuestions");
};

export const createQuestion = (formData) => {
  return api.post("/addQuestions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateQuestion = (id, formData) => {
  return api.put(`/updateQuestion/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteQuestion = (id) => {
  return api.delete(`/deleteQuestion/${id}`);
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