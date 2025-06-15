import axios from 'axios';
import Vue from 'vue'; // Importamos Vue para acceder a sus prototipos

/**
 * Plugin de Vue para integrar un cliente API basado en Axios.
 */

// Crea una instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor de peticiones de Axios.
 * Añade el token de acceso de Auth0 a la cabecera 'Authorization' de cada petición
 * si el usuario está autenticado.
 * @param {Object} config - La configuración de la petición.
 */
apiClient.interceptors.request.use(async (config) => {
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

/**
 * Objeto plugin para Vue.
 * Instala el cliente API (`apiClient`) en el prototipo de Vue como `$api`,
 * haciéndolo accesible en cualquier componente o instancia de Vue.
 */
export const ApiPlugin = {
  install(Vue) {
    Vue.prototype.$api = apiClient;
  }
};