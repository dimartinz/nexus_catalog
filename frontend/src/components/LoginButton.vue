<template>
    <v-btn color="success" @click="login">Iniciar Sesión</v-btn>
</template>
<script>
export default {
    name: 'LoginButton',
    methods: {
        login() {
            this.$auth.loginWithRedirect();
        }
    }
}
</script>