import { defineStore } from 'pinia';
import Vue from 'vue';

export const useCatalogStore = defineStore('catalogs', {
  /**
 * Estado de la store de catálogos.
 * @returns {Object} El estado inicial.
 * @property {Array<Object>} catalogs - Lista de objetos de catálogo.
 * @property {boolean} loading - Indica si se está cargando información.
 * @property {Error|null} error - Almacena cualquier error que ocurra durante las operaciones.
 */
  state: () => ({
    catalogs: [],
    loading: false,
    error: null,
  }),
  /**
 * Acciones para interactuar con la store de catálogos.
 */
  actions: {
    /**
 * Obtiene la lista de catálogos desde la API.
 * Si los catálogos ya están en caché (el array `catalogs` no está vacío), no realiza la petición.
 * @returns {Promise<void>}
 */
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
    /**
 * Añade un nuevo catálogo a través de la API y lo agrega al estado local.
 * @param {Object} newCatalogData - Los datos del nuevo catálogo a crear.
 * @returns {Promise<void>}
 */

    async addCatalog(newCatalogData) {
      try {
        const { data } = await Vue.prototype.$api.post('/catalogs', newCatalogData);
        this.catalogs.push(data);
      } catch (err) {
        console.error('Error al crear el catálogo:', err);
      }
    },
    /**
 * Actualiza un catálogo existente a través de la API y actualiza el estado local.
 * Se crea un payload limpio para evitar enviar campos no permitidos.
 * @param {Object} updatedCatalogData - Los datos actualizados del catálogo. Debe incluir `_id`.
 * @returns {Promise<void>}
 */

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
    /**
 * Elimina un catálogo a través de la API y lo remueve del estado local.
 * @param {string} catalogId - El ID del catálogo a eliminar.
 * @returns {Promise<void>}
 */

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