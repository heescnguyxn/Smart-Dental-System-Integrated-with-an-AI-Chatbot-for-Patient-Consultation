import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const prescriptionService = {
    getByPatient: (patientId) => API.get(`/prescriptions/patient/${patientId}`),
    getByMedicalRecord: (medicalRecordId) => API.get(`/prescriptions/medical-record/${medicalRecordId}`),
    create: (data) => API.post('/prescriptions', data),
    update: (id, data) => API.put(`/prescriptions/${id}`, data)
};
