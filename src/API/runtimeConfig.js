export const getApiBaseUrl = () => {

  if (import.meta.env.DEV) {
    return "/api";
  }

  return import.meta.env.VITE_API_URL;
};