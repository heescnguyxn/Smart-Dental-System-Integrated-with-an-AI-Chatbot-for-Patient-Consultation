import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const appointmentService = {
    create: (data) => API.post('/appointments', data),
    getAll: () => API.get('/appointments'),
    getMy: () => API.get('/appointments/my'),
    getByDoctor: () => API.get('/appointments/doctor'),
    update: (id, data) => API.put(`/appointments/${id}`, data)
};

