import Vue from 'vue';
import createAuth0Client from '@auth0/auth0-spa-js';

let instance;

/**
 * Obtiene la instancia singleton del servicio de autenticación.
 * @returns {Vue} La instancia del servicio de autenticación.
 */
export const getInstance = () => instance;

const useAuth0 = ({
  onRedirectCallback = () => window.history.replaceState({}, document.title, window.location.pathname),
  redirectUri = window.location.origin,
  ...options
}) => {
  if (instance) return instance;

  /**
 * Crea y configura la instancia singleton del servicio de autenticación utilizando Vue.
 * Esta instancia maneja el estado de autenticación y las interacciones con Auth0.
 *
 * @param {Object} options - Opciones de configuración para Auth0 y el plugin.
 * @param {Function} [options.onRedirectCallback] - Función a ejecutar después de manejar la redirección de Auth0.
 * @param {string} [options.redirectUri] - URI a la que Auth0 redirigirá después de la autenticación.
 */
  instance = new Vue({
    data() {
      return {
        loading: true,
        isAuthenticated: false,
        user: {},
        auth0Client: null,
        popupOpen: false,
        error: null,
      };
    },
    methods: {
      /**
 * Inicia el flujo de autenticación utilizando un popup.
 * @param {Object} [o] - Opciones adicionales para `loginWithPopup`.
 * @returns {Promise<void>}
 */
      async loginWithPopup(o) {
        this.popupOpen = true;
        try {
          await this.auth0Client.loginWithPopup(o);
        } catch (e) {
          console.error(e);
        } finally {
          this.popupOpen = false;
        }
        this.user = await this.auth0Client.getUser();
        this.isAuthenticated = true;
      },
      /**
 * Maneja la redirección de Auth0 después de un login o registro.
 * Procesa los parámetros de la URL y actualiza el estado de autenticación.
 * @returns {Promise<void>}
 */
      async handleRedirectCallback() {
        this.loading = true;
        try {
          await this.auth0Client.handleRedirectCallback();
          this.user = await this.auth0Client.getUser();
          this.isAuthenticated = true;
        } catch (e) {
          this.error = e;
        } finally {
          this.loading = false;

        }
      },
      /**
 * Inicia el flujo de autenticación utilizando una redirección.
 * @param {Object} [o] - Opciones adicionales para `loginWithRedirect`.
 * @returns {Promise<void>}
 */
      loginWithRedirect(o) {
        return this.auth0Client.loginWithRedirect(o);
      },
      /**
 * Obtiene los claims del token de ID.
 * @param {Object} [o] - Opciones adicionales para `getIdTokenClaims`.
 * @returns {Promise<Object>} Los claims del token de ID.
 */
      getIdTokenClaims(o) {
        return this.auth0Client.getIdTokenClaims(o);
      },
      /**
 * Obtiene un token de acceso de forma silenciosa (sin interacción del usuario).
 * @param {Object} [o] - Opciones adicionales para `getTokenSilently`.
 * @returns {Promise<string>} El token de acceso.
 */
      getTokenSilently(o) {
        return this.auth0Client.getTokenSilently(o);
      },
      /**
 * Obtiene un token de acceso utilizando un popup (si es necesario).
 * @param {Object} [o] - Opciones adicionales para `getTokenWithPopup`.
 * @returns {Promise<string>} El token de acceso.
 */
      getTokenWithPopup(o) {
        return this.auth0Client.getTokenWithPopup(o);
      },
      /**
 * Cierra la sesión del usuario.
 * @param {Object} [o] - Opciones adicionales para `logout`.
 * @returns {Promise<void>}
 */
      logout(o) {
        return this.auth0Client.logout(o);
      },
    },
    async created() {
      this.auth0Client = await createAuth0Client({
        ...options,
        domain: options.domain,
        client_id: options.clientId,
        audience: options.audience,
        redirect_uri: redirectUri,
      });

      try {
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
          const { appState } = await this.auth0Client.handleRedirectCallback();
          onRedirectCallback(appState);
        }
      } catch (e) {
        this.error = e;
      } finally {
        this.isAuthenticated = await this.auth0Client.isAuthenticated();
        this.user = await this.auth0Client.getUser();
        this.loading = false;
      }
    },
  });

  return instance;
};

/**
 * Plugin de Vue para integrar el servicio de autenticación de Auth0.
 * Proporciona la instancia del servicio a través de `Vue.prototype.$auth`.
 */
export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options);
  },
};