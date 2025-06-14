import Vue from 'vue';
import createAuth0Client from '@auth0/auth0-spa-js';

let instance;

export const getInstance = () => instance;

const useAuth0 = ({
  onRedirectCallback = () => window.history.replaceState({}, document.title, window.location.pathname),
  redirectUri = window.location.origin,
  ...options
}) => {
  if (instance) return instance;

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
      loginWithRedirect(o) {
        return this.auth0Client.loginWithRedirect(o);
      },
      getIdTokenClaims(o) {
        return this.auth0Client.getIdTokenClaims(o);
      },
      getTokenSilently(o) {
        return this.auth0Client.getTokenSilently(o);
      },
      getTokenWithPopup(o) {
        return this.auth0Client.getTokenWithPopup(o);
      },
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

export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options);
  },
};