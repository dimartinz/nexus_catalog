// frontend/src/plugins/api.js

import axios from 'axios';
import Vue from 'vue'; // Importamos Vue para acceder a sus prototipos

// Crea una instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Usa un interceptor para añadir el token de Auth0 a cada petición
apiClient.interceptors.request.use(async (config) => {
  // Accedemos directamente a la instancia global de $auth que vive en Vue.
  // Esta es una forma mucho más fiable de obtener el servicio.
  const authService = Vue.prototype.$auth;

  if (authService && authService.isAuthenticated) {
    try {
      const token = await authService.getTokenSilently();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('No se pudo obtener el token para la petición de API', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export const ApiPlugin = {
  // La función de instalación ahora es más simple
  install(Vue) {
    // Hacemos la instancia de Axios disponible en toda la app como this.$api
    Vue.prototype.$api = apiClient;
  }
};