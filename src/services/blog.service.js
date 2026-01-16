import api from "../api/axiosConfig";

export const getAllBlogs = async (
  page = 0,
  size = 10,
  sort = "createdAt,desc"
) => {
  const response = await api.get(
    `/blog/list?page=${page}&size=${size}&sort=${sort}`
  );
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await api.get(`/blog/${id}`);
  return response.data;
};

export const getBlogsByCategory = async (categoryId) => {
  const response = await api.get(`/blog/category/${categoryId}`);
  return response.data;
};

export const createBlog = async (blogData) => {
  const response = await api.post("/blog/create", blogData);
  return response.data;
};

export const updateBlog = async (id, blogData) => {
  const response = await api.put(`/blog/update/${id}`, blogData);
  return response.data;
};

export const deleteBlog = async (id) => {
  await api.delete(`/blog/delete/${id}`);
};

export const createComment = async (commentData) => {
  const response = await api.post("/comments/save", commentData);
  return response.data;
};

export const updateComment = async (id, commentData) => {
  const response = await api.put(`/comments/update/${id}`, commentData);
  return response.data;
};

export const deleteComment = async (id) => {
  await api.delete(`/comments/delete/${id}`);
};

export const searchBlogs = async (query) => {
  const response = await api.get(`/blog/search?title=${query}`);
  return response.data;
};

export const blogMe = async () => {
  const response = await api.get(`/blog/me`);
  return response.data;
};
