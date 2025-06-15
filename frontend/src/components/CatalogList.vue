<template>
  <v-card>
    <v-card-title>
      Lista de Catálogos
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn v-if="isAdmin" color="primary" @click="openCreateDialog">Nuevo Catálogo</v-btn>
    </v-card-title>

    <v-alert v-if="error" type="error" dense dismissible class="mx-4 mt-2">
      {{ typeof error === 'string' ? error : (error.message || 'Ha ocurrido un error al procesar los catálogos.') }}
    </v-alert>

    
    <v-data-table
      :headers="headers"
      :items="catalogs"
      :search="search"
      :loading="loading"
      loading-text="Cargando datos..."
      class="elevation-1"
    >
      <template v-slot:[`item.price`]="{ item }">
        <span>${{ item.price.toLocaleString('es-CL') }}</span>
      </template>
      <template v-slot:[`item.isActive`]="{ item }">
        <v-chip :color="item.isActive ? 'green' : 'red'" dark>{{ item.isActive ? 'Sí' : 'No' }}</v-chip>
      </template>
      <template v-if="isAdmin" v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="openEditDialog(item)">mdi-pencil</v-icon>
        <v-icon small @click="openDeleteDialog(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <CatalogForm 
      :dialog.sync="dialog" 
      :catalog="editedItem"
      @save="saveCatalog"
    />

    <ConfirmDialog 
      :dialog.sync="dialogDelete"
      title="Confirmar Eliminación"
      text="¿Estás seguro de que deseas eliminar este catálogo? Esta acción no se puede deshacer."
      @confirm="deleteCatalogConfirm"
    />
  </v-card>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useCatalogStore } from '../stores/catalogStore';
import CatalogForm from './CatalogForm.vue';
import ConfirmDialog from './ConfirmDialog.vue';

export default {
  name: 'CatalogList',
  components: { CatalogForm, ConfirmDialog },
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    editedItem: null,
    itemToDelete: null,
  }),
  computed: {
    ...mapState(useCatalogStore, ['catalogs', 'loading', 'error']),
    headers() {
        const headers = [
            { text: 'Nombre', value: 'name' },
            { text: 'Precio', value: 'price' },
            { text: 'Descripción', value: 'description' },
            { text: 'Activo', value: 'isActive' },
        ];
        if (this.isAdmin) {
            headers.push({ text: 'Acciones', value: 'actions', sortable: false, align: 'end' });
        }
        return headers;
    },
    isAdmin() {
      if (!this.$auth.isAuthenticated) return false;
      // Es más seguro verificar que $auth.user exista antes de acceder a sus propiedades
      const user = this.$auth.user;
      console.log(user)
      if (!user) return false;
      const roles = user['https://api.catalog-manager.com/roles'] || [];
      return roles.includes('admin');
    }
  },
  methods: {
    ...mapActions(useCatalogStore, ['fetchCatalogs', 'addCatalog', 'updateCatalog', 'removeCatalog']),
    openCreateDialog() {
      this.editedItem = {};
      this.dialog = true;
    },
    openEditDialog(item) {
      this.editedItem = { ...item };
      this.dialog = true;
    },
    openDeleteDialog(item) {
      this.itemToDelete = item;
      this.dialogDelete = true;
    },
    async saveCatalog(catalogData) {
      // Considerar limpiar errores previos si tienes una acción para ello en tu store
      // if (this.clearError) this.clearError(); 
      if (catalogData._id) {
        await this.updateCatalog(catalogData);
      } else {
        await this.addCatalog(catalogData);
      }
      if (!this.error) { // Solo cerrar el diálogo si no hubo error
        this.dialog = false;
      }
    },
    async deleteCatalogConfirm() {
      // Considerar limpiar errores previos
      // if (this.clearError) this.clearError();
      if (this.itemToDelete) {
        await this.removeCatalog(this.itemToDelete._id);
      }
      if (!this.error) { // Solo cerrar el diálogo si no hubo error
        this.dialogDelete = false;
      }
    },
  },
  created() {
    // Considerar limpiar errores previos al cargar el componente
    // if (this.clearError) this.clearError();
    this.fetchCatalogs();
  },
};
</script>