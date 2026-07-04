import api from './api';

export const getOrders = async () => (await api.get('/salesorders')).data;

export const getOrderById = async (id) => (await api.get(`/salesorders/${id}`)).data;

export const createOrder = async (data) => (await api.post('/salesorders', data)).data;

export const updateOrder = async (id, data) => (await api.put(`/salesorders/${id}`, data)).data;
