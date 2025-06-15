<template>
  <div>
    <h1 class="text-h4 mb-4">Gestión de Catálogos</h1>
    <CatalogList />
  </div>
</template>

<script>
import CatalogList from '../components/CatalogList.vue';

export default {
  name: 'CatalogsView',
  components: {
    CatalogList,
  },
};
</script>