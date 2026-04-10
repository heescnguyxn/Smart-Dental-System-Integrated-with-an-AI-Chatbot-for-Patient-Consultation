import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const paymentService = {
    createPayment: (data) => API.post('/payments', data),
    getPayments: () => API.get('/payments')
};

