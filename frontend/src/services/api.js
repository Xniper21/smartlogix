import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productosAPI = {
  listar: () => apiClient.get('/bff/inventario/productos'),
  crear: (producto) => apiClient.post('/bff/inventario/productos', producto),
  actualizar: (id, producto) => apiClient.put(`/bff/inventario/productos/${id}`, producto),
  verificarDisponibilidad: (productoId, cantidad) =>
    apiClient.get(`/bff/inventario/disponible/${productoId}/${cantidad}`),
};

export const pedidosAPI = {
  crear: (pedido) => apiClient.post('/bff/pedidos', pedido),
  listar: () => apiClient.get('/bff/pedidos'),
  obtener: (id) => apiClient.get(`/bff/pedidos/${id}`),
  eliminar: (id) => apiClient.delete(`/bff/pedidos/${id}`),
};

export const dashboardAPI = {
  stats: () => apiClient.get('/bff/dashboard'),
};

export const authAPI = {
  login: (credentials) => apiClient.post('/bff/auth/login', credentials),
  register: (userData) => apiClient.post('/bff/auth/register', userData),
};