import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const supplyService = {
    getAll: () => API.get('/supplies'),
    create: (data) => API.post('/supplies', data),
    update: (id, data) => API.put(`/supplies/${id}`, data),
    delete: (id) => API.delete(`/supplies/${id}`)
};
