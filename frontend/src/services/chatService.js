import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const chatService = {
    sendMessage: (message) => API.post('/chat/message', { message }),
    getHistory: () => API.get('/chat/history')
};

