<script>
export default {
  name: 'HomeView'
}
</script>

<template>
  <div class="home">
    <div class="hero-section text-center py-5">
      <h1 class="display-4 mb-4">Sistema de Gestión Hospitalaria</h1>
      <p class="lead mb-4">Sistema completo para la gestión de pacientes en entornos hospitalarios</p>

      <div class="row mt-5">
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <div class="card-body text-center">
              <i class="bi bi-person-plus display-4 text-primary mb-3"></i>
              <h3>Registro</h3>
              <p>Registro de nuevos pacientes y edicion de los mismos</p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <div class="card-body text-center">
              <i class="bi bi-search display-4 text-success mb-3"></i>
              <h3>Consulta</h3>
              <p>Consulta y gestiona la información de pacientes registrados</p>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <div class="card-body text-center">
              <i class="bi bi-graph-up display-4 text-warning mb-3"></i>
              <h3>Estadística</h3>
              <p>Seguimiento y estadística de los pacientes</p>
            </div>
          </div>
        </div>
      </div>

      <router-link to="/pacientes" class="btn btn-primary btn-lg mt-4">
        <i class="bi bi-arrow-right"></i> Comenzar Gestión
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  margin: 20px;
}

.card {
  transition: transform 0.3s;
  border: none;
}

.card:hover {
  transform: translateY(-10px);
}

.btn-primary {
  padding: 12px 30px;
  font-size: 1.1rem;
}
</style>