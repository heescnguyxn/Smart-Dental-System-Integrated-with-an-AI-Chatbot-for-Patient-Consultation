import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

const getProfile = async () => {
    const response = await API.get('/users/profile');
    return response.data;
};

const updateProfile = async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    return response.data;
};

const userService = {
    getProfile,
    updateProfile
};

export default userService;
