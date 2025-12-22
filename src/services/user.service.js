import api from '../api/axiosConfig';

export const getAllUsers = async () => {
  const response = await api.get('/user/list');
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/user/delete/${id}`);
};
