import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { Auth0Plugin } from './plugins/auth'
import { ApiPlugin } from './plugins/api'

Vue.config.productionTip = false

// Instalar Pinia
Vue.use(PiniaVuePlugin)
const pinia = createPinia()

// Instalar el plugin de Auth0
Vue.use(Auth0Plugin, {
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
  audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
})

// Instalar el plugin de API (Axios)
// Pasa la instancia de Auth0 para poder obtener el token
Vue.use(ApiPlugin)

new Vue({
  router,
  vuetify,
  pinia,
  render: h => h(App)
}).$mount('#app')