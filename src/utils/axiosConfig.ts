import axios, { AxiosInstance, AxiosError } from 'axios';

export const API_BASE_URL = 'https://bnr-archive-management-system.onrender.com';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export default api;


export const isAxiosError = axios.isAxiosError;