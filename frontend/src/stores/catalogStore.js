import { defineStore } from 'pinia';
import Vue from 'vue';

export const useCatalogStore = defineStore('catalogs', {
  state: () => ({
    catalogs: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCatalogs() {
      if (this.catalogs.length > 0) {
        console.log('Cargando catálogos desde el caché de Pinia.');
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const { data } = await Vue.prototype.$api.get('/catalogs');
        this.catalogs = data;
      } catch (err) {
        this.error = err;
        console.error('Error al obtener catálogos:', err);
      } finally {
        this.loading = false;
      }
    },

    async addCatalog(newCatalogData) {
      try {
        const { data } = await Vue.prototype.$api.post('/catalogs', newCatalogData);
        this.catalogs.push(data);
      } catch (err) {
        console.error('Error al crear el catálogo:', err);
      }
    },

    async updateCatalog(updatedCatalogData) {
      try {
        // CORRECCIÓN: Crear un objeto 'limpio' con solo los campos permitidos.
        const { _id, name, description, price, isActive } = updatedCatalogData;
        const payload = { name, description, price, isActive };
        
        const { data } = await Vue.prototype.$api.patch(`/catalogs/${_id}`, payload);
        
        const index = this.catalogs.findIndex(c => c._id === _id);
        if (index !== -1) {
          this.$patch(state => {
            state.catalogs.splice(index, 1, data);
          });
        }
      } catch (err) {
        console.error('Error al actualizar el catálogo:', err);
      }
    },

    async removeCatalog(catalogId) {
      try {
        await Vue.prototype.$api.delete(`/catalogs/${catalogId}`);
        this.catalogs = this.catalogs.filter(c => c._id !== catalogId);
      } catch (err) {
        console.error('Error al eliminar el catálogo:', err);
      }
    },
  },
});