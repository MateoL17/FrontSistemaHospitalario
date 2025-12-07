<script>
import PacienteList from '@/components/PacienteList.vue';

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