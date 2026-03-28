import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const getMeAPI = () => API.get('/auth/me');
export const checkStatusAPI = () => API.get('/auth/check-status');
export const forgotPasswordAPI = (data) => API.post('/auth/forgot-password', data);
export const resetPasswordAPI = (token, data) => API.put(`/auth/reset-password/${token}`, data);
export const changePasswordAPI = (data) => API.put('/auth/change-password', data);

// User APIs
export const getProfileAPI = () => API.get('/users/profile');
export const updateProfileAPI = (data) => API.put('/users/profile', data);
export const getPublicProfileAPI = (userId) => API.get(`/users/public/${userId}`);
export const getTrustScoreAPI = (userId) => API.get(`/users/trust-score/${userId || ''}`);
export const getMyListingsAPI = (params) => API.get('/users/my-listings', { params });
export const getDashboardStatsAPI = () => API.get('/users/dashboard');

// Item APIs
export const createItemAPI = (data) => API.post('/items', data);
export const getItemsAPI = (params) => API.get('/items', { params });
export const getItemAPI = (id) => API.get(`/items/${id}`);
export const updateItemAPI = (id, data) => API.put(`/items/${id}`, data);
export const deleteItemAPI = (id) => API.delete(`/items/${id}`);
export const getFeaturedItemsAPI = () => API.get('/items/featured');
export const getCategoriesAPI = () => API.get('/items/categories');

// Request APIs
export const createRequestAPI = (data) => API.post('/requests', data);
export const getReceivedRequestsAPI = (params) => API.get('/requests/received', { params });
export const getSentRequestsAPI = (params) => API.get('/requests/sent', { params });
export const getRequestAPI = (id) => API.get(`/requests/${id}`);
export const acceptRequestAPI = (id) => API.put(`/requests/${id}/accept`);
export const rejectRequestAPI = (id) => API.put(`/requests/${id}/reject`);
export const completeRequestAPI = (id) => API.put(`/requests/${id}/complete`);
export const cancelRequestAPI = (id, data) => API.put(`/requests/${id}/cancel`, data);

// Chat APIs
export const createChatAPI = (data) => API.post('/chats', data);
export const getMyChatsAPI = () => API.get('/chats');
export const sendMessageAPI = (data) => API.post('/chats/message', data);
export const getMessagesAPI = (chatId, params) => API.get(`/chats/messages/${chatId}`, { params });
export const getUnreadChatCountAPI = () => API.get('/chats/unread-count');

// Forum APIs
export const requestForumAccessAPI = (data) => API.post('/forum/request-access', data);
export const createForumPostAPI = (data) => API.post('/forum', data);
export const getForumPostsAPI = (params) => API.get('/forum', { params });
export const getForumPostAPI = (id) => API.get(`/forum/${id}`);
export const updateForumPostAPI = (id, data) => API.put(`/forum/${id}`, data);
export const deleteForumPostAPI = (id) => API.delete(`/forum/${id}`);
export const toggleLikePostAPI = (id) => API.put(`/forum/${id}/like`);
export const addCommentAPI = (id, data) => API.post(`/forum/${id}/comments`, data);
export const deleteCommentAPI = (postId, commentId) => API.delete(`/forum/${postId}/comments/${commentId}`);
export const getMyForumPostsAPI = () => API.get('/forum/my-posts');

// Review APIs
export const createReviewAPI = (data) => API.post('/reviews', data);
export const getUserReviewsAPI = (userId, params) => API.get(`/reviews/user/${userId}`, { params });
export const canReviewAPI = (requestId) => API.get(`/reviews/can-review/${requestId}`);

// Report APIs
export const createReportAPI = (data) => API.post('/reports', data);
export const getMyReportsAPI = () => API.get('/reports/my-reports');

// Meetup APIs
export const getMeetupLocationsAPI = () => API.get('/meetup');
export const getSuggestedLocationsAPI = (params) => API.get('/meetup/suggestions', { params });
export const useLocationAPI = (id) => API.put(`/meetup/${id}/use`);

// AI APIs
export const generateContentAPI = (data) => API.post('/ai/generate-content', data);
export const generateDescriptionAPI = (data) => API.post('/ai/generate-description', data);
export const chatWithAIAPI = (data) => API.post('/ai/chat', data);

// Notification APIs
export const getNotificationsAPI = (params) => API.get('/notifications', { params });
export const markNotificationReadAPI = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsReadAPI = () => API.put('/notifications/read-all');
export const deleteNotificationAPI = (id) => API.delete(`/notifications/${id}`);
export const getUnreadNotificationCountAPI = () => API.get('/notifications/unread-count');

export default API;