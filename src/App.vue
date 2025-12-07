<script>
import NavBar from '@/components/NavBar.vue';

/*
 * Author: Mateo Lasso
 * Fecha: 7-12-2025
 * Versión: 1.0
 * Descripción: Este componente denominado App es el componente raíz principal
 *              de la aplicación Vue que contiene la barra de navegación y el router.
 * */

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<template>
  <div id="app">
    <NavBar />
    <div class="container-fluid mt-3">
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background: #f8f9fa;
}

body {
  margin: 0;
  padding: 0;
}
</style>