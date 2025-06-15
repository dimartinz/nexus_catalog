<template>
  <div class="home text-center">
    <h1 class="text-h3 mb-4">Bienvenido al Gestor de Catálogos</h1>
    <p class="mt-4">
      Esta es una aplicación de demostración construida con Vue 2, Vuetify, Pinia, NestJS y Auth0.
    </p>
    <div v-if="!$auth.loading && !$auth.isAuthenticated">
      <p>Por favor, inicia sesión para continuar.</p>
      <LoginButton />
    </div>
    <div v-if="$auth.isAuthenticated">
      <p class="text-h6">¡Has iniciado sesión correctamente!</p>
      <p>Ahora puedes gestionar los catálogos.</p>
      <v-btn color="success" large to="/catalogs" class="mt-4">Ir a Catálogos</v-btn>
    </div>
     <div v-if="$auth.loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>
<script>
import LoginButton from '../components/LoginButton.vue';
export default {
  name: 'HomeView',
  components: { LoginButton },
};
</script>