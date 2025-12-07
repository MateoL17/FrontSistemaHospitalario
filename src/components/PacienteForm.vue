<script>
import { ref, computed, reactive, watch } from 'vue';
import PacienteService from '@/services/api';

export default {
  name: 'PacienteForm',
  props: {
    paciente: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const formData = reactive({
      cedula: '',
      nombre: '',
      correo: '',
      edad: null,
      direccion: '',
      activo: true
    });

    const errors = reactive({});
    const saving = ref(false);

    // Si hay un paciente para editar, cargar sus datos
    if (props.paciente) {
      Object.assign(formData, props.paciente);
    }

    // Validar cédula en tiempo real
    const validateCedula = () => {
      if (!formData.cedula) {
        errors.cedula = 'La cédula es requerida';
        return;
      }

      if (formData.cedula.length !== 10) {
        errors.cedula = 'La cédula debe tener 10 dígitos';
        return;
      }

      if (!/^\d{10}$/.test(formData.cedula)) {
        errors.cedula = 'La cédula debe contener solo números';
        return;
      }

      delete errors.cedula;
    };

    // Validar formulario completo
    const validateForm = () => {
      let valid = true;
      const newErrors = {};

      // Validar cédula
      if (!formData.cedula) {
        newErrors.cedula = 'La cédula es requerida';
        valid = false;
      } else if (formData.cedula.length !== 10) {
        newErrors.cedula = 'La cédula debe tener 10 dígitos';
        valid = false;
      } else if (!/^\d{10}$/.test(formData.cedula)) {
        newErrors.cedula = 'La cédula debe contener solo números';
        valid = false;
      }

      // Validar nombre
      if (!formData.nombre || formData.nombre.trim().length < 3) {
        newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        valid = false;
      }

      // Validar correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.correo || !emailRegex.test(formData.correo)) {
        newErrors.correo = 'Correo electrónico inválido';
        valid = false;
      }

      // Validar edad
      if (!formData.edad || formData.edad < 1 || formData.edad > 120) {
        newErrors.edad = 'La edad debe estar entre 1 y 120 años';
        valid = false;
      }

      // Actualizar errores
      Object.assign(errors, newErrors);
      return valid;
    };

    // Computed para validación del formulario
    const isFormValid = computed(() => {
      return formData.cedula &&
          formData.cedula.length === 10 &&
          /^\d{10}$/.test(formData.cedula) &&
          formData.nombre &&
          formData.nombre.trim().length >= 3 &&
          formData.correo &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo) &&
          formData.edad &&
          formData.edad >= 1 &&
          formData.edad <= 120;
    });

    // Manejar envío del formulario
    const handleSubmit = async () => {
      if (!validateForm()) {
        return;
      }

      saving.value = true;
      try {
        emit('save', { ...formData });
      } catch (error) {
        console.error('Error en formulario:', error);
      } finally {
        saving.value = false;
      }
    };

    // Watch para validación automática de cédula
    watch(() => formData.cedula, (newCedula) => {
      if (newCedula && newCedula.length === 10) {
        validateCedula();
      }
    });

    return {
      formData,
      errors,
      saving,
      validateCedula,
      handleSubmit,
      isFormValid
    };
  }
}
</script>

<template>
  <div class="paciente-form">
    <div class="modal-header bg-primary text-white">
      <h5 class="modal-title">
        <i class="bi" :class="paciente ? 'bi-person-gear' : 'bi-person-plus'"></i>
        {{ paciente ? 'Editar Paciente' : 'Nuevo Paciente' }}
      </h5>
      <button type="button" class="btn-close btn-close-white" @click="$emit('cancel')"></button>
    </div>

    <div class="modal-body p-4">
      <!-- Estado actual (solo para edición) -->
      <div v-if="paciente" class="alert" :class="formData.activo ? 'alert-success' : 'alert-danger'">
        <i class="bi" :class="formData.activo ? 'bi-check-circle' : 'bi-x-circle'"></i>
        <strong>Estado actual:</strong> {{ formData.activo ? 'ACTIVO' : 'INACTIVO' }}
      </div>

      <form @submit.prevent="handleSubmit" class="row g-3">
        <!-- Cédula -->
        <div class="col-md-6">
          <label for="cedula" class="form-label">
            <i class="bi bi-card-checklist text-primary"></i> Cédula *
          </label>
          <input type="text"
                 class="form-control"
                 id="cedula"
                 v-model="formData.cedula"
                 :disabled="!!paciente"
                 :class="{ 'is-invalid': errors.cedula }"
                 @blur="validateCedula"
                 placeholder="Ej: 1718123293">
          <div class="invalid-feedback" v-if="errors.cedula">
            <i class="bi bi-exclamation-triangle"></i> {{ errors.cedula }}
          </div>
          <div class="form-text">
            Cédula de 10 dígitos
          </div>
        </div>

        <!-- Nombre -->
        <div class="col-md-6">
          <label for="nombre" class="form-label">
            <i class="bi bi-person text-primary"></i> Nombre Completo *
          </label>
          <input type="text"
                 class="form-control"
                 id="nombre"
                 v-model="formData.nombre"
                 :class="{ 'is-invalid': errors.nombre }"
                 placeholder="Ej: Juan Pérez">
          <div class="invalid-feedback" v-if="errors.nombre">
            {{ errors.nombre }}
          </div>
        </div>

        <!-- Correo -->
        <div class="col-md-6">
          <label for="correo" class="form-label">
            <i class="bi bi-envelope text-primary"></i> Correo Electrónico *
          </label>
          <input type="email"
                 class="form-control"
                 id="correo"
                 v-model="formData.correo"
                 :class="{ 'is-invalid': errors.correo }"
                 placeholder="ejemplo@correo.com">
          <div class="invalid-feedback" v-if="errors.correo">
            {{ errors.correo }}
          </div>
        </div>

        <!-- Edad -->
        <div class="col-md-6">
          <label for="edad" class="form-label">
            <i class="bi bi-calendar3 text-primary"></i> Edad *
          </label>
          <input type="number"
                 class="form-control"
                 id="edad"
                 v-model.number="formData.edad"
                 min="1" max="120"
                 :class="{ 'is-invalid': errors.edad }"
                 placeholder="18">
          <div class="invalid-feedback" v-if="errors.edad">
            {{ errors.edad }}
          </div>
          <div class="form-text">
            Ingrese la edad del paciente
          </div>
        </div>

        <!-- Dirección -->
        <div class="col-12">
          <label for="direccion" class="form-label">
            <i class="bi bi-geo-alt text-primary"></i> Dirección
          </label>
          <textarea class="form-control"
                    id="direccion"
                    rows="2"
                    v-model="formData.direccion"
                    placeholder="Av. Principal #123, Ciudad"></textarea>
          <div class="form-text">
            Dirección completa del paciente
          </div>
        </div>

        <!-- Checkbox de estado (solo para edición) -->
        <div v-if="paciente" class="col-12">
          <div class="form-check form-switch">
            <input class="form-check-input"
                   type="checkbox"
                   id="activo"
                   v-model="formData.activo"
                   role="switch">
            <label class="form-check-label" for="activo">
              <strong>Paciente activo</strong>
              <small class="text-muted ms-2">(Si está desactivado, aparecerá en gris)</small>
            </label>
          </div>
        </div>
      </form>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
        <i class="bi bi-x-circle me-1"></i> Cancelar
      </button>
      <button type="button"
              class="btn btn-primary"
              @click="handleSubmit"
              :disabled="!isFormValid || saving">
        <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
        <i v-else :class="paciente ? 'bi bi-check-circle' : 'bi bi-save'"></i>
        {{ saving ? 'Guardando...' : (paciente ? 'Actualizar' : 'Guardar') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.paciente-form {
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  border-bottom: none;
  padding: 1.5rem;
}

.modal-title {
  font-weight: 600;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.form-label {
  font-weight: 500;
  color: #495057;
}

.form-control, .form-select {
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 10px 12px;
  transition: all 0.3s;
}

.form-control:focus, .form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
}

.invalid-feedback {
  display: block;
}

.form-text {
  font-size: 0.85em;
  color: #6c757d;
}

.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}

.form-switch .form-check-input {
  width: 3em;
  height: 1.5em;
}

.btn-primary {
  background: linear-gradient(135deg, #0d6efd, #0a58ca);
  border: none;
  padding: 10px 24px;
  font-weight: 500;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4);
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
}

.btn-secondary:hover {
  background-color: #5c636a;
}

.spinner-border {
  vertical-align: middle;
}
</style>