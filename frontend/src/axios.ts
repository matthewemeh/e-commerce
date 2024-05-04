import axios, { AxiosInstance } from 'axios';

// development
// const instance: AxiosInstance = axios.create({ baseURL: 'http://localhost:8080' });
const instance: AxiosInstance = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

export default instance;
