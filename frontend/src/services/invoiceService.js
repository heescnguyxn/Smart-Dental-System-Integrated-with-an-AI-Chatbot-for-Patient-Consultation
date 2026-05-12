import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const invoiceService = {
    getAll: () => API.get('/payments/invoices'),
    getMy: () => API.get('/payments/invoices/my'),
    pay: (id, paymentData) => API.put(`/payments/invoices/${id}/pay`, paymentData),
};
