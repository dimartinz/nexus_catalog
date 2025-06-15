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
export default {
  name: 'ConfirmDialog',
  props: {
    dialog: Boolean,
    title: { type: String, default: 'Confirmar' },
    text: { type: String, default: '¿Estás seguro?' },
  },
  methods: {
      confirm() {
          this.$emit('confirm');
          this.$emit('update:dialog', false);
      }
  }
}
</script>