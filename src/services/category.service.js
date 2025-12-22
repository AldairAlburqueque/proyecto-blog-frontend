import api from '../api/axiosConfig';

export const getAllCategories = async () => {
  const response = await api.get('/category/list');
  return response.data;
};
