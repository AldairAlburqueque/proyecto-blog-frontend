import api from "../api/axiosConfig";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/user/save", userData);
  return response.data;
};
