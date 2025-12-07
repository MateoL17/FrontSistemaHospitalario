<script>
import { ref, computed, onMounted } from 'vue';
import PacienteService from '@/services/api';
import PacienteForm from './PacienteForm.vue';
import Swal from 'sweetalert2';

export default {
  name: 'PacienteList',
  components: {
    PacienteForm
  },
  setup() {
    const pacientes = ref([]);
    const showForm = ref(false);
    const editingPaciente = ref(null);
    const filter = ref('all');
    const loading = ref(false);

    // Computed properties
    const pacientesActivos = computed(() =>
        pacientes.value.filter(p => p.activo).length
    );

    const pacientesInactivos = computed(() =>
        pacientes.value.filter(p => !p.activo).length
    );

    const filteredPacientes = computed(() => {
      switch (filter.value) {
        case 'active':
          return pacientes.value.filter(p => p.activo);
        case 'inactive':
          return pacientes.value.filter(p => !p.activo);
        default:
          return pacientes.value;
      }
    });

    // Métodos de estilo
    const getRowClass = (paciente) =>
        !paciente.activo ? 'table-secondary paciente-inactivo' : '';

    const getEstadoBadgeClass = (activo) =>
        activo ? 'badge bg-success' : 'badge bg-danger';

    // Cargar pacientes
    const loadPacientes = async () => {
      loading.value = true;
      try {
        pacientes.value = await PacienteService.getAll();
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los pacientes.',
        });
      } finally {
        loading.value = false;
      }
    };

    // Editar paciente
    const editPaciente = (paciente) => {
      editingPaciente.value = { ...paciente };
      showForm.value = true;
    };

    // Manejar guardar (crear/actualizar)
    const handleSave = async (pacienteData) => {
      try {
        if (editingPaciente.value) {
          await PacienteService.update(pacienteData.cedula, pacienteData);
          Swal.fire({
            icon: 'success',
            title: 'Paciente Actualizado',
            text: 'Paciente actualizado correctamente',
            timer: 2000
          });
        } else {
          await PacienteService.create(pacienteData);
          Swal.fire({
            icon: 'success',
            title: 'Paciente Creado',
            text: 'Paciente creado correctamente',
            timer: 2000
          });
        }
        showForm.value = false;
        await loadPacientes();
      } catch {
        // El interceptor de axios maneja los errores
      }
    };

    // Activar paciente (para pacientes inactivos)
    const activarPaciente = async (cedula, nombre) => {
      const result = await Swal.fire({
        title: '¿Activar paciente?',
        html: `¿Estás seguro de que quieres <strong>activar</strong> al paciente <strong>${nombre}</strong>?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, activar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#198754'
      });

      if (result.isConfirmed) {
        try {
          await PacienteService.activate(cedula);
          Swal.fire({
            icon: 'success',
            title: '¡Activado!',
            text: `Paciente ${nombre} activado correctamente`,
            timer: 1500
          });
          await loadPacientes();
        } catch {
          // Error manejado por interceptor
        }
      }
    };

    // Eliminar paciente (BORRADO FÍSICO)
    const confirmDelete = async (cedula, nombre) => {
      const result = await Swal.fire({
        title: '¿Eliminar paciente PERMANENTEMENTE?',
        html: `Esta acción <strong>ELIMINARÁ PERMANENTEMENTE</strong> al paciente <strong>${nombre}</strong><br>
               <small class="text-danger">¡Esta acción no se puede deshacer!</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar permanentemente',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        try {
          await PacienteService.delete(cedula);
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: `Paciente ${nombre} eliminado permanentemente`,
            timer: 1500
          });
          await loadPacientes();
        } catch {
          // Error manejado por interceptor
        }
      }
    };

    // Cargar pacientes al montar el componente
    onMounted(loadPacientes);

    return {
      pacientes,
      showForm,
      editingPaciente,
      filter,
      loading,
      pacientesActivos,
      pacientesInactivos,
      filteredPacientes,
      getRowClass,
      getEstadoBadgeClass,
      editPaciente,
      handleSave,
      activarPaciente,
      confirmDelete,
      loadPacientes
    };
  }
}
</script>

<template>
  <div class="paciente-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="bi bi-people me-2"></i>Gestión de Pacientes
      </h2>

      <div class="d-flex align-items-center gap-3">
        <!-- Filtros -->
        <div class="btn-group">
          <button class="btn btn-outline-secondary"
                  :class="{ 'active': filter === 'all' }"
                  @click="filter = 'all'">
            <i class="bi bi-people-fill"></i> Todos
          </button>
          <button class="btn btn-outline-success"
                  :class="{ 'active': filter === 'active' }"
                  @click="filter = 'active'">
            <i class="bi bi-toggle-on"></i> Activos
          </button>
          <button class="btn btn-outline-danger"
                  :class="{ 'active': filter === 'inactive' }"
                  @click="filter = 'inactive'">
            <i class="bi bi-toggle-off"></i> Inactivos
          </button>
        </div>

        <!-- Botón nuevo paciente -->
        <button class="btn btn-primary" @click="showForm = true; editingPaciente = null;">
          <i class="bi bi-plus-circle me-1"></i> Nuevo Paciente
        </button>
      </div>
    </div>

    <!-- Contadores -->
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="card bg-light">
          <div class="card-body text-center">
            <h5 class="card-title">
              <i class="bi bi-people text-primary"></i> Total
            </h5>
            <p class="card-text display-6">{{ pacientes.length }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-light">
          <div class="card-body text-center">
            <h5 class="card-title">
              <i class="bi bi-toggle-on text-success"></i> Activos
            </h5>
            <p class="card-text display-6">{{ pacientesActivos }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-light">
          <div class="card-body text-center">
            <h5 class="card-title">
              <i class="bi bi-toggle-off text-danger"></i> Inactivos
            </h5>
            <p class="card-text display-6">{{ pacientesInactivos }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de pacientes -->
    <div class="table-responsive">
      <table class="table table-hover table-striped">
        <thead class="table-dark">
        <tr>
          <th width="15%">Cédula</th>
          <th width="20%">Nombre</th>
          <th width="25%">Correo</th>
          <th width="8%">Edad</th>
          <th width="20%">Dirección</th>
          <th width="7%">Estado</th>
          <th width="15%">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="paciente in filteredPacientes" :key="paciente.cedula"
            :class="getRowClass(paciente)">
          <td><strong>{{ paciente.cedula }}</strong></td>
          <td>
              <span v-if="!paciente.activo" class="text-muted me-2">
                <i class="bi bi-person-x" title="Paciente inactivo"></i>
              </span>
            {{ paciente.nombre }}
          </td>
          <td>
            <a :href="`mailto:${paciente.correo}`" class="text-decoration-none">
              <i class="bi bi-envelope me-1"></i>
              {{ paciente.correo }}
            </a>
          </td>
          <td>
            <span class="badge bg-info">{{ paciente.edad }} años</span>
          </td>
          <td>
            <small>
              <i class="bi bi-geo-alt me-1"></i>
              {{ paciente.direccion || 'Sin dirección' }}
            </small>
          </td>
          <td>
              <span :class="getEstadoBadgeClass(paciente.activo)">
                <i :class="paciente.activo ? 'bi bi-toggle-on' : 'bi bi-toggle-off'"></i>
                {{ paciente.activo ? 'Activo' : 'Inactivo' }}
              </span>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <!-- Botón Editar -->
              <button class="btn btn-outline-info"
                      @click="editPaciente(paciente)"
                      :title="'Editar ' + paciente.nombre">
                <i class="bi bi-pencil"></i>
              </button>

              <!-- Botón Activar (solo para inactivos) -->
              <button v-if="!paciente.activo"
                      class="btn btn-outline-success"
                      @click="activarPaciente(paciente.cedula, paciente.nombre)"
                      :title="'Activar ' + paciente.nombre">
                <i class="bi bi-person-check"></i>
              </button>

              <!-- Botón Eliminar (solo para activos) -->
              <button v-if="paciente.activo"
                      class="btn btn-outline-danger"
                      @click="confirmDelete(paciente.cedula, paciente.nombre)"
                      :title="'Eliminar ' + paciente.nombre">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensaje si no hay pacientes -->
    <div v-if="filteredPacientes.length === 0" class="alert alert-info text-center">
      <i class="bi bi-info-circle me-2"></i>
      <template v-if="filter === 'all'">
        No hay pacientes registrados actualmente.
      </template>
      <template v-else-if="filter === 'active'">
        No hay pacientes activos.
      </template>
      <template v-else>
        No hay pacientes inactivos.
      </template>
    </div>

    <!-- Resumen -->
    <div class="mt-3 text-muted small text-center">
      <i class="bi bi-filter me-1"></i>
      Mostrando {{ filteredPacientes.length }} de {{ pacientes.length }} pacientes
    </div>

    <!-- Modal/Formulario de paciente -->
    <div v-if="showForm" class="modal-backdrop fade show"></div>
    <div v-if="showForm" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <PacienteForm
              :paciente="editingPaciente"
              @save="handleSave"
              @cancel="showForm = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.paciente-list {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.table th {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
}

.table-hover tbody tr:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.paciente-inactivo td {
  color: #6c757d;
  font-style: italic;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-backdrop {
  opacity: 0.5;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}
</style>