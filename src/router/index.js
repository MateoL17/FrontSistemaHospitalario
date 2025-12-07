import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PacientesView from '@/views/PacientesView.vue';

/*
 * Author: Mateo Lasso
 * Fecha: 7-12-2025
 * Versión: 1.0
 * Descripción: Este archivo index.js configura el enrutador principal
 *              de la aplicación Vue con todas las rutas disponibles.
 * */

/*
 * Array que define todas las rutas de la aplicación
 * @type {Array}
 * */
const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/pacientes',
        name: 'Pacientes',
        component: PacientesView
    }
];

/*
 * Instancia del enrutador Vue Router
 * @type {Router}
 * */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;