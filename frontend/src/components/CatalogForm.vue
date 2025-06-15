<template>
  <v-dialog :value="dialog" @input="$emit('update:dialog', $event)" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editableCatalog.name"
              label="Nombre del Catálogo"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="editableCatalog.price"
              label="Precio"
              type="number"
              prefix="$"
              :rules="[rules.required, rules.min(0)]"
              required
            ></v-text-field>
            <v-textarea
              v-model="editableCatalog.description"
              label="Descripción"
              rows="3"
            ></v-textarea>
             <v-switch
              v-model="editableCatalog.isActive"
              label="Activo"
            ></v-switch>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('update:dialog', false)">Cancelar</v-btn>
        <v-btn color="blue darken-1" :disabled="!valid" @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'CatalogForm',
  props: {
    dialog: Boolean,
    catalog: Object,
  },
  data: () => ({
    valid: true,
    editableCatalog: {},
    rules: {
      required: v => !!v || 'Este campo es requerido.',
      min: min => v => v >= min || `El valor debe ser al menos ${min}`,
    },
  }),
  computed: {
    formTitle() {
      return this.catalog && this.catalog._id ? 'Editar Catálogo' : 'Nuevo Catálogo';
    }
  },
  watch: {
    dialog(val) {
      if (val) {
        // Al abrir, resetea la validación y copia los datos
        this.$refs.form?.resetValidation();
        this.editableCatalog = { isActive: true, ...this.catalog };
      }
    }
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.$emit('save', this.editableCatalog);
      }
    }
  }
}
</script>