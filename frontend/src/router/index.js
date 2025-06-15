import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { authGuard } from '../plugins/auth/authGuard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/catalogs',
    name: 'catalogs',
    component: () => import(/* webpackChunkName: "catalogs" */ '../views/Catalogs.vue'),
    // Guardia de ruta para proteger el acceso
    beforeEnter: authGuard
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router