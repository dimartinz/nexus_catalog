<template>
  <v-app>
    <!-- 1. BARRA DE NAVEGACIÓN PRINCIPAL -->
    <v-app-bar app color="primary" dark>
      <!-- Título de la Aplicación -->
      <v-toolbar-title>Gestor de Catálogos</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Botones de Navegación -->
      <v-btn to="/" text>Inicio</v-btn>
      
      <!-- El botón de Catálogos solo aparece si el usuario está autenticado -->
      <v-btn to="/catalogs" text v-if="isAuthenticated">Catálogos</v-btn>

      <v-spacer></v-spacer>

      <!-- 2. SECCIÓN DE AUTENTICACIÓN (LADO DERECHO) -->
      <!-- Muestra un indicador de carga mientras el servicio de Auth0 se inicializa -->
      <div v-if="$auth.loading">
        <v-progress-circular indeterminate color="white"></v-progress-circular>
      </div>
      
      <!-- Cuando ya ha cargado, decide qué mostrar -->
      <div v-if="!$auth.loading">
        <!-- Si no está autenticado, muestra el botón de Login -->
        <LoginButton v-if="!isAuthenticated" />
        
        <!-- Si está autenticado, muestra el saludo y el botón de Logout -->
        <div v-if="isAuthenticated" class="d-flex align-center">
            <span class="mr-4" v-if="$auth.user">Hola, {{ $auth.user.name }}</span>
            <LogoutButton />
        </div>
      </div>
    </v-app-bar>

    <!-- 3. CONTENIDO PRINCIPAL DE LA PÁGINA -->
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// Importamos los nuevos componentes
import LoginButton from './components/LoginButton.vue';
import LogoutButton from './components/LogoutButton.vue';

export default {
  name: 'App',
  components: {
    LoginButton,
    LogoutButton,
  },
  computed: {
    // Creamos una propiedad computada para saber si el usuario está autenticado.
    // Accedemos directamente al estado del plugin de Auth0 (this.$auth).
    isAuthenticated() {
      if (this.$auth.loading) return false;
      return this.$auth.isAuthenticated;
    },
  },
};
</script>