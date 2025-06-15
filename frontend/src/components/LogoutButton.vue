<template>
    <v-btn color="error" @click="logout">Cerrar Sesión</v-btn>
</template>
<script>
export default {
    name: 'LogoutButton',
    methods: {
        logout() {
            this.$auth.logout({
                returnTo: window.location.origin
            });
        }
    }
}
</script>