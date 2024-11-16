<template>
  <div>
    <h1>Home page</h1>
    <p>
      Welcome {{ currentUser ? currentUser.email : 'Guest' }}
    </p>
    <br />
    <UContainer>
      <UCard>
        <h2 class="mb-4 text-primary-400 font-bold">Your medical appointments</h2>
        <ul>
          <UTable :rows="filteredAppointments" />
        </ul>
        <div v-if="userRole == 'User'" class="mt-4">
          <UButton label="Book Appointment" @click="isOpen = true" />

          <UModal v-model="isOpen">
            <div class="p-4">
              <!-- Formulario para pedir la cita médica -->
              <h4>Book a Medical Appointment</h4>

              <!-- Select para elegir el médico -->
              <div class="mb-4">
                <label for="doctor" class="block mb-2">Choose Doctor:</label>
                <USelect v-model="selectedDoctor" :options="doctors" option-attribute="name"
                  placeholder="Select a Doctor" />
              </div>

              <!-- Input para seleccionar la fecha -->
              <div class="mb-4">
                <label for="date" class="block mb-2">Choose Date:</label>
                <UInput type="date" v-model="selectedDate" />
              </div>

              <!-- Botón para enviar el formulario -->
              <UButton label="Submit" @click="handleSubmit" />
            </div>
          </UModal>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Interfaces para los datos de los doctores y citas
interface Doctor {
  name: string;
  value: string;
  disabled: boolean;
}

const isOpen = ref(false);
const selectedDoctor = ref('');
const selectedDate = ref('');

// Importa las funciones necesarias de tu composable
const { currentUser, getDoctors, createAppointment, getAppointments, getUserRole } = useFirebaseAuth();

const userRole = ref(''); // Inicializamos userRole como una referencia
const doctors = ref<Doctor[]>([]);
const appointments = ref<{ doctor: string; date: string; name:string}[]>([]);

const filteredAppointments = computed(() => {
  if (!currentUser.value) return []; // Si no hay usuario autenticado, devolver una lista vacía

  const userEmail = currentUser.value.email?.trim().toLowerCase(); // Obtener el correo del usuario

  if (userRole.value === 'Doc') {
    // Si el usuario es un doctor, mostrar solo las citas asignadas a ese doctor
    return appointments.value.filter(
      appointment => appointment.doctor.trim().toLowerCase() === userEmail
    );
  } else if (userRole.value === 'User') {
    // Si el usuario es un paciente (rol User), mostrar solo las citas que correspondan a su correo electrónico
    return appointments.value.filter(
      appointment => appointment.name.trim().toLowerCase() === userEmail // Usamos 'patient' en lugar de 'name'
    );
  }

  // Para otros roles, devolver todas las citas
  return appointments.value;
});



// Obtener lista de doctores y citas al montar el componente
onMounted(async () => {
  if (currentUser.value) {
    userRole.value = await getUserRole(); // Usar .value para asignar el valor a la referencia
  } else {
    userRole.value = ''; // Asignamos un valor por defecto en caso de que currentUser sea null o undefined
  }
  doctors.value = await getDoctors();
  appointments.value = await getAppointments();
});

// Función que se ejecuta al hacer submit para crear una nueva cita
const handleSubmit = async () => {
  console.log('Fecha seleccionada:', selectedDate.value);
  console.log('Médico seleccionado:', selectedDoctor.value);

  await createAppointment(selectedDoctor.value, selectedDate.value); // Espera a que se cree la cita

  // Después de crear la cita, vuelve a obtener las citas
  appointments.value = await getAppointments();

  // Cerrar el modal
  isOpen.value = false;
};
</script>
