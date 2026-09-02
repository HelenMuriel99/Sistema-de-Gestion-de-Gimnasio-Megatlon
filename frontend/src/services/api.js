import axios from 'axios';

// La URL donde corre el Spring Boot de Fabrizzio
const API_URL = 'http://localhost:8080/api/v1';

// Creamos una instancia de Axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: Antes de que salga CUALQUIER petición hacia el backend, 
// verificamos si hay un token guardado y lo agregamos al encabezado.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;