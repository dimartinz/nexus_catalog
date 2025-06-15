import { getInstance } from './index';

/**
 * Guardia de ruta para proteger rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a la página de login de Auth0.
 *
 * @param {Object} to - El objeto de ruta al que se está navegando.
 * @param {Object} from - El objeto de ruta desde el que se está navegando.
 * @param {Function} next - La función para resolver la navegación.
 */
export const authGuard = (to, from, next) => {
  // Obtiene la instancia del servicio de autenticación.
  const authService = getInstance();

  // Define la función principal de verificación de autenticación.
  const fn = () => {
    // Si el usuario está autenticado, permite la navegación.
    if (authService.isAuthenticated) {
      return next();
    }
    // Si no está autenticado, redirige a la página de login de Auth0,
    // guardando la URL de destino en el estado de la aplicación para redirigir después del login.
    authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
  };

  // Si el servicio de autenticación ya ha terminado de cargar, ejecuta la función de verificación.
  if (!authService.loading) {
    return fn();
  }

  // Si el servicio de autenticación aún está cargando, espera a que termine
  // y luego ejecuta la función de verificación.
  authService.$watch('loading', loading => {
    if (loading === false) {
      return fn();
    }
  });
};