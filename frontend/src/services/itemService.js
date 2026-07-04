import api from './api';

export const getItems = async () => (await api.get('/items')).data;
