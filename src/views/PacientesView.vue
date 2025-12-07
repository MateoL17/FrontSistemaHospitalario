<script>
import PacienteList from '@/components/PacienteList.vue';

/*
 * Author: Mateo Lasso
 * Fecha: 7-12-2025
 * Versión: 1.0
 * Descripción: Este componente denominado PacientesView es la vista principal
 *              que contiene el componente de lista de pacientes.
 * */

export default {
  name: 'PacientesView',
  components: {
    PacienteList
  }
}
</script>

<template>
  <div class="pacientes-view">
    <PacienteList />
  </div>
</template>

<style scoped>
.pacientes-view {
  padding: 20px;
}
</style>