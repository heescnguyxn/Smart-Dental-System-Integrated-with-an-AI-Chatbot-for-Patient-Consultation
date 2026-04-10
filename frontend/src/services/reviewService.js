import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const reviewService = {
    create: (data) => API.post('/reviews', data),
    getByDoctor: (doctorId) => API.get(`/reviews/doctor/${doctorId}`)
};

