<template>
  <v-dialog :value="dialog" @input="$emit('update:dialog', $event)" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('update:dialog', false)">Cancelar</v-btn>
        <v-btn color="red darken-1" @click="confirm">Confirmar</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
/**
 * Componente de diálogo de confirmación genérico.
 * Muestra un título, un texto y botones para cancelar o confirmar una acción.
 */
export default {
  name: 'ConfirmDialog',
  props: {
    /**
     * Controla la visibilidad del diálogo.
     */
    dialog: Boolean,
    /**
     * Título del diálogo de confirmación.
     */
    title: { type: String, default: 'Confirmar' },
    /**
     * Texto principal del diálogo de confirmación.
     */
    text: { type: String, default: '¿Estás seguro?' },
  },
  methods: {
      /**
       * Emite el evento 'confirm' y cierra el diálogo.
       */
      confirm() {
          this.$emit('confirm');
          this.$emit('update:dialog', false);
      }
  }
}
</script>