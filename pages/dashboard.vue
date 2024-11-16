<template>
  <div>
    <h1>Dashboard (link security)</h1>
  </div>
  <div>
    <UTable v-model="selected" :rows="appointments" :columns="columns">
      <template #name-data="{ row }">
        <span :class="[selected.find(person => person.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{
          row.name }}</span>
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </div>

  <div v-if="selected.length > 0">
    <h3>Selected Person:</h3>
    <pre>{{ selected }}</pre> <!-- Esto mostrará el objeto de las filas seleccionadas -->
  </div>
</template>

<script setup lang="ts">
// pages/dashboard.vue
const { getDoctors, getAppointments,  } = useFirebaseAuth();

definePageMeta({
  middleware: 'authadmin' // Solo accesible si el usuario está logueado
});

// Interfaces para los datos de los doctores y citas
interface Doctor {
  name: string;
  value: string;
  disabled: boolean;
}

const doctors = ref<Doctor[]>([]);
const appointments = ref<{ doctor: string; date: string; name: string }[]>([]);

const columns = [{
  key: 'name',
  label: 'Doctor'
}, {
  key: 'date',
  label: 'Date'
}, {
  key: 'name',
  label: 'Paciente'
}, {
  key: 'actions'
}]

const items = row => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  },],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => console.log('Delete', row.id)
  }]
]

const selected = ref([])

// Obtener lista de doctores y citas al montar el componente
onMounted(async () => {
  doctors.value = await getDoctors();
  appointments.value = await getAppointments();
});

</script>
