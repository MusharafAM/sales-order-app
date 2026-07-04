import api from './api';

export const getClients = async () => (await api.get('/clients')).data;
