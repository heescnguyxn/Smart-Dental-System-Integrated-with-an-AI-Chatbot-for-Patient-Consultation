import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const medicalRecordService = {
    getByPatient: (patientId) => API.get(`/medical-records/patient/${patientId}`),
    getByAppointment: (appointmentId) => API.get(`/medical-records/appointment/${appointmentId}`),
    create: (data) => API.post('/medical-records', data),
    update: (id, data) => API.put(`/medical-records/${id}`, data)
};
