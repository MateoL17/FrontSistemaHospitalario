import axios from 'axios';

// Configurar axios globalmente
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

// Interceptor para manejar errores globalmente
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
    // Obtener todos los pacientes
    async getAll() {
        try {
            const response = await apiClient.get('/pacientes');
            return response.data;
        } catch (error) {
            console.error('Error fetching pacientes:', error);
            throw error;
        }
    },

    // Obtener paciente por cédula
    async getByCedula(cedula) {
        try {
            const response = await apiClient.get(`/pacientes/${cedula}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching paciente:', error);
            throw error;
        }
    },

    // Crear nuevo paciente
    async create(paciente) {
        try {
            const response = await apiClient.post('/pacientes', paciente);
            return response.data;
        } catch (error) {
            console.error('Error creating paciente:', error);
            throw error;
        }
    },

    // Actualizar paciente
    async update(cedula, paciente) {
        try {
            const response = await apiClient.put(`/pacientes/${cedula}`, paciente);
            return response.data;
        } catch (error) {
            console.error('Error updating paciente:', error);
            throw error;
        }
    },

    // Eliminar paciente (borrado lógico)
    async delete(cedula) {
        try {
            const response = await apiClient.delete(`/pacientes/${cedula}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting paciente:', error);
            throw error;
        }
    },

    // Activar paciente
    async activate(cedula) {
        try {
            const response = await apiClient.put(`/pacientes/${cedula}/activar`);
            return response.data;
        } catch (error) {
            console.error('Error activating paciente:', error);
            throw error;
        }
    },

    // Desactivar paciente
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