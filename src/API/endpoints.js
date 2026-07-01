export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
  },
  CATEGORIES: {
    CREATE: "/SaveCategory",
    GET_ALL: "/GetAllCategories",
    DELETE: (id) => `/DeleteCategory/${id}`,
  },
  SECTIONS: {
    CREATE: "/createSubject",
    GET_ALL: "/GetAllSubjects",
    DELETE: (id) => `/DeleteSubject/${id}`,
  },
  TEST_SERIES: {
    GET_ALL: "/getAllTestSeries",
    CREATE: "/createTestSeries",
    UPDATE: (id) => `/UpdateTestSeries/${id}`,
    DELETE: (id) => `/deleteTestSeries/${id}`,
    GET_BY_ID: (id) => `/TestSeriesById/${id}`,
  },
  TEST_PAPERS: {
    GET_ALL: "/GetAllPapers",
    CREATE: "/CreatePaper",
    UPDATE: (id) => `/UpdatePaper/${id}`,
    DELETE: (id) => `/DeletePaper/${id}`,
    GET_BY_ID: (id) => `/getPaperById/${id}`,
  },
  DASHBOARD: {
    ORDER_STATS: "/getTestSeriesOrderStats",
    REVENUE_COUNT: "/getRevenueAndCountByTestSeries",
  },
};
