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
          <!-- Iterar sobre appointments para mostrar las citas -->
          <li v-for="(appointment, index) in appointments" :key="index">
            {{ appointment.doctor }} - {{ appointment.date }}
          </li>
        </ul>
        <div class="mt-4">
          <UButton label="Book Appointment" @click="isOpen = true" />

          <UModal v-model="isOpen">
            <div class="p-4">
              <!-- Formulario para pedir la cita médica -->
              <h4>Book a Medical Appointment</h4>

              <!-- Select para elegir el médico -->
              <div class="mb-4">
                <label for="doctor" class="block mb-2">Choose Doctor:</label>
                <USelect v-model="selectedDoctor" :options="doctors" option-attribute="name" placeholder="Select a Doctor" />
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
import { ref, onMounted } from 'vue';

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
const { currentUser, getDoctors, createAppointment, getAppointments } = useFirebaseAuth();

const doctors = ref<Doctor[]>([]);
const appointments = ref<{ doctor: string; date: string }[]>([]);

// Obtener lista de doctores y citas al montar el componente
onMounted(async () => {
  doctors.value = await getDoctors();
  appointments.value = await getAppointments(); // Asegúrate de que getAppointments devuelve un array de citas
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
