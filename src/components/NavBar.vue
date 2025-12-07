<script>
/*
 * Author: Mateo Lasso
 * Fecha: 7-12-2025
 * Versión: 1.0
 * Descripción: Este componente denominado NavBar es la barra de navegación principal
 *              de la aplicación que proporciona acceso a las diferentes secciones.
 * */

export default {
  name: 'NavBar'
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <i class="bi bi-hospital"></i> Sistema Hospitalario
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              <i class="bi bi-house"></i> Inicio
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/pacientes">
              <i class="bi bi-people"></i> Pacientes
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-brand {
  font-weight: 600;
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
  margin: 0 10px;
  transition: all 0.3s;
}

.nav-link:hover, .nav-link.router-link-active {
  color: #fff !important;
  background: rgba(255,255,255,0.1);
  border-radius: 5px;
}

.nav-link i {
  margin-right: 5px;
}
</style>