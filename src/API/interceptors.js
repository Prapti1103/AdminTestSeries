import api from "./axios";
import {
  USE_LOCAL_TOKEN,
  LOCAL_JWT,
} from "./authConfig";

api.interceptors.request.use(

  (config) => {

    let token = sessionStorage.getItem("token");

    // Local Development
    if (import.meta.env.DEV && USE_LOCAL_TOKEN && LOCAL_JWT) {

      token = LOCAL_JWT;

    }

    if (token) {

      config.headers.Authorization =
        token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

    }

    return config;

  },

  (error) => Promise.reject(error)

);

api.interceptors.response.use(

  (response) => response,

  (error) => {

    const status = error.response?.status;

    if (
      !USE_LOCAL_TOKEN &&
      (status === 401 || status === 403)
    ) {

      sessionStorage.removeItem("token");

      window.location.href = "/admin";

    }

    return Promise.reject(error);

  }

);

export default api;