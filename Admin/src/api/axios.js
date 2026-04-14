import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const adminLoginAPI = (data) => API.post('/auth/login', data);
export const adminGetMeAPI = () => API.get('/auth/me');

// Dashboard
export const getDashboardStatsAPI = () => API.get('/admin/dashboard');

// User Management
export const getPendingUsersAPI = () => API.get('/admin/users/pending');
export const getAllUsersAPI = (params) => API.get('/admin/users', { params });
export const getUserDetailAPI = (id) => API.get(`/admin/users/${id}`);
export const approveUserAPI = (id) => API.put(`/admin/users/${id}/approve`);
export const rejectUserAPI = (id, data) => API.put(`/admin/users/${id}/reject`, data);
export const toggleUserStatusAPI = (id) => API.put(`/admin/users/${id}/toggle-status`);
export const deleteUserAPI = (id) => API.delete(`/admin/users/${id}`);

// Item Management
export const adminGetItemsAPI = (params) => API.get('/admin/items', { params });
export const adminRemoveItemAPI = (id) => API.put(`/admin/items/${id}/remove`);
export const adminGetItemDetailAPI = (id) => API.get(`/items/${id}`);
export const adminDeleteItemAPI = (id) => API.delete(`/items/${id}`);

// Request Management
export const adminGetRequestsAPI = (params) => API.get('/admin/requests', { params });

// Forum Management
export const getForumAccessRequestsAPI = (params) => API.get('/admin/forum/requests', { params });
export const handleForumAccessAPI = (id, data) => API.put(`/admin/forum/requests/${id}`, data);
export const adminGetForumPostsAPI = (params) => API.get('/admin/forum/posts', { params });
export const handleForumPostAPI = (id, data) => API.put(`/admin/forum/posts/${id}`, data);
export const togglePinPostAPI = (id) => API.put(`/admin/forum/posts/${id}/pin`);
export const revokeForumAccessAPI = (id) => API.put(`/admin/forum/revoke/${id}`);
export const adminDeleteForumPostAPI = (id) => API.delete(`/forum/${id}`);
export const adminCreateForumPostAPI = (data) => API.post('/forum', data);

// Report Management
export const adminGetReportsAPI = (params) => API.get('/admin/reports', { params });
export const resolveReportAPI = (id, data) => API.put(`/admin/reports/${id}`, data);

// Meetup Location Management
export const getMeetupLocationsAPI = () => API.get('/meetup');
export const createMeetupLocationAPI = (data) => API.post('/admin/meetup-locations', data);
export const updateMeetupLocationAPI = (id, data) => API.put(`/admin/meetup-locations/${id}`, data);
export const deleteMeetupLocationAPI = (id) => API.delete(`/admin/meetup-locations/${id}`);

// AI
export const generateContentAPI = (data) => API.post('/ai/generate-content', data);

export default API;