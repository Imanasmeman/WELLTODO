import axios from 'axios';

const API = axios.create({
  baseURL: 'https://welltodo-3.onrender.com/',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/users/register', data),
  login: (data) => API.post('/users/login', data),
  getProfile: () => API.get('/users/profile'),
};

export const taskAPI = {
  createTask: (data) => API.post('/tasks', data),
  getTodayTasks: () => API.get('/tasks/today'),
  getTasksByDate: (date) => API.get('/tasks/history', { params: { date } }),
  updateTask: (id, data) => API.put(`/tasks/${id}`, data),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
  addSubTask: (taskId, data) => API.post(`/tasks/${taskId}/subtask`, data),
  updateSubTask: (taskId, subtaskId, data) =>
    API.put(`/tasks/${taskId}/subtask/${subtaskId}`, data),
  deleteSubTask: (taskId, subtaskId) =>
    API.delete(`/tasks/${taskId}/subtask/${subtaskId}`),
};

export default API;
