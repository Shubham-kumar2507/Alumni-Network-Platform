import api from './axios'

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// Profile
export const profileApi = {
  getStudent: () => api.get('/profile/student'),
  updateStudent: (data) => api.put('/profile/student', data),
  getAlumni: () => api.get('/profile/alumni'),
  updateAlumni: (data) => api.put('/profile/alumni', data),
  syncSkills: (data) => api.post('/profile/skills', data),
  uploadAvatar: (formData) => api.post('/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadResume: (formData) => api.post('/profile/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// Alumni Discovery
export const alumniApi = {
  list: (params) => api.get('/alumni', { params }),
  get: (id) => api.get(`/alumni/${id}`),
}

// Connections
export const connectionApi = {
  send:       (data) => api.post('/connections', data),
  list:       ()     => api.get('/connections'),
  accept:     (id)   => api.patch(`/connections/${id}/accept`),
  reject:     (id)   => api.patch(`/connections/${id}/reject`),
  cancel:     (id)   => api.delete(`/connections/${id}/cancel`),   // cancel pending sent
  disconnect: (id)   => api.delete(`/connections/${id}`),           // remove accepted
}

// Mentorship
export const mentorApi = {
  request:      (data) => api.post('/mentors', data),
  list:         ()     => api.get('/mentors'),
  listMentees:  ()     => api.get('/mentors/mentees'),
  accept:       (id)   => api.patch(`/mentors/${id}/accept`),
  reject:       (id)   => api.patch(`/mentors/${id}/reject`),
  withdraw:     (id)   => api.delete(`/mentors/${id}/withdraw`),    // student cancels
  removeMentee: (id)   => api.delete(`/mentors/${id}/remove`),      // alumni ends
}

// Referrals
export const referralApi = {
  request: (data) => api.post('/referrals', data),
  list: () => api.get('/referrals'),
  accept: (id, data) => api.patch(`/referrals/${id}/accept`, data),
  reject: (id, data) => api.patch(`/referrals/${id}/reject`, data),
}

// Messages
export const messageApi = {
  chats: () => api.get('/messages/chats'),
  messages: (chatId) => api.get(`/messages/${chatId}`),
  send: (chatId, data) => api.post(`/messages/${chatId}`, data),
  startChat: (userId) => api.post('/messages/start', { user_id: userId }),
}

// Events
export const eventApi = {
  list: (params) => api.get('/events', { params }),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
}

// Admin
export const adminApi = {
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
  toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),
  events: () => api.get('/admin/events'),
}
