<script>
import NavBar from '@/components/NavBar.vue';

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