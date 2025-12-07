import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importar Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importar estilos globales
import './assets/global.css';

/*
 * Author: Mateo Lasso
 * Fecha: 7-12-2025
 * Versión: 1.0
 * Descripción: Este archivo main.js es el punto de entrada principal de la aplicación Vue
 *              que inicializa la aplicación y configura los plugins necesarios.
 * */

const app = createApp(App);

app.use(router);
app.mount('#app');
