import axios from 'axios';

/*
 * Author: Mateo Lasso
 * Fecha: 7-12-2025
 * Versión: 1.0
 * Descripción: Este archivo api.js es el cliente HTTP que maneja todas las
 *              comunicaciones con el backend a través de axios.
 * */

// Configurar axios globalmente
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

/*
 * Interceptor que maneja errores globalmente para todas las respuestas HTTP
 * @param response Parámetro que define la respuesta HTTP exitosa
 * @param error Parámetro que define el error HTTP ocurrido
 * @return Respuesta procesada o error rechazado
 * */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);

        // Mostrar error amigable
        if (error.response) {
            // Intentar obtener el mensaje de error del backend
            const backendError = error.response.data?.error ||
                error.response.data?.message ||
                error.response.data;

            let userMessage = '';

            switch (error.response.status) {
                case 400:
                    userMessage = backendError || 'Datos inválidos. Por favor verifica la información.';
                    break;
                case 404:
                    userMessage = backendError || 'Recurso no encontrado.';
                    break;
                case 409:
                    userMessage = backendError || 'La cédula ya está registrada.';
                    break;
                case 500:
                    userMessage = 'Error del servidor. Por favor intenta más tarde.';
                    break;
                default:
                    userMessage = backendError || `Error inesperado (${error.response.status})`;
            }

            // Mostrar alerta con el mensaje
            if (userMessage) {
                alert(userMessage);
            }
        } else if (error.request) {
            alert('No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté ejecutándose.');
        } else {
            alert('Error desconocido: ' + error.message);
        }

        return Promise.reject(error);
    }
);

// Servicios para Pacientes
const PacienteService = {
    /*
     * Método que obtiene todos los pacientes del servidor
     * @return Promesa que se resuelve con la lista de pacientes
     * */
    async getAll() {
        try {
            const response = await apiClient.get('/pacientes');
            return response.data;
        } catch (error) {
            console.error('Error fetching pacientes:', error);
            throw error;
        }
    },

    /*
     * Método que obtiene un paciente específico por su cédula
     * @param cedula Parámetro que define el número de cédula a buscar
     * @return Promesa que se resuelve con el paciente encontrado
     * */
    async getByCedula(cedula) {
        try {
            const response = await apiClient.get(`/pacientes/${cedula}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching paciente:', error);
            throw error;
        }
    },

    /*
     * Método que crea un nuevo paciente en el servidor
     * @param paciente Parámetro que define el objeto Paciente a crear
     * @return Promesa que se resuelve con el paciente creado
     * */
    async create(paciente) {
        try {
            const response = await apiClient.post('/pacientes', paciente);
            return response.data;
        } catch (error) {
            console.error('Error creating paciente:', error);
            throw error;
        }
    },

    /*
     * Método que actualiza un paciente existente
     * @param cedula Parámetro que define el número de cédula del paciente a actualizar
     * @param paciente Parámetro que define el objeto Paciente con los datos actualizados
     * @return Promesa que se resuelve con el paciente actualizado
     * */
    async update(cedula, paciente) {
        try {
            const response = await apiClient.put(`/pacientes/${cedula}`, paciente);
            return response.data;
        } catch (error) {
            console.error('Error updating paciente:', error);
            throw error;
        }
    },

    /*
     * Método que elimina permanentemente un paciente
     * @param cedula Parámetro que define el número de cédula del paciente a eliminar
     * @return Promesa que se resuelve cuando se completa la eliminación
     * */
    async delete(cedula) {
        try {
            const response = await apiClient.delete(`/pacientes/${cedula}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting paciente:', error);
            throw error;
        }
    },

    /*
     * Método que activa un paciente (cambia su estado a activo)
     * @param cedula Parámetro que define el número de cédula del paciente a activar
     * @return Promesa que se resuelve cuando se completa la activación
     * */
    async activate(cedula) {
        try {
            const response = await apiClient.put(`/pacientes/${cedula}/activar`);
            return response.data;
        } catch (error) {
            console.error('Error activating paciente:', error);
            throw error;
        }
    },

    /*
     * Método que desactiva un paciente (cambia su estado a inactivo)
     * @param cedula Parámetro que define el número de cédula del paciente a desactivar
     * @return Promesa que se resuelve cuando se completa la desactivación
     * */
    async deactivate(cedula) {
        try {
            const response = await apiClient.put(`/pacientes/${cedula}/desactivar`);
            return response.data;
        } catch (error) {
            console.error('Error deactivating paciente:', error);
            throw error;
        }
    }
};

export default PacienteService;