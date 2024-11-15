<template>
  <UContainer>
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <UHorizontalNavigation v-if="currentUser" :links="links" class="w-1/2 border-b border-gray-200 dark:border-gray-800" />
          <div></div>
          <div class="flex h-fit">
            <!-- Solo mostrar el botón de logout si hay un usuario autenticado -->
            <UButton
              class="mr-3"
              @click="logout"
              v-if="currentUser"
            >
              logout
            </UButton>
            <UButton
              class="mr-3"
              @click="navigateTo('/register')"
              v-if="!currentUser && !isRegisterPage"
            >
              Register
            </UButton>
            <UButton
              class="mr-3"
              @click="navigateTo('/login')"
              v-if="!currentUser && !isLoginPage"
            >
              login
            </UButton>
            <ColorScheme>
              <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
            </ColorScheme>
          </div>
        </div>
      </template>

      <slot />

      <UNotifications />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'; // Ajusta la ruta si es necesario

// Obtener el estado de la autenticación del usuario
const { logout, currentUser } = useFirebaseAuth();  // Obtener currentUser de useFirebaseAuth
const route = useRoute();

// Determinamos si estamos en la página de login o register
const isLoginPage = computed(() => route.path === '/login');
const isRegisterPage = computed(() => route.path === '/register');

// Links para la navegación
const links = [
  [{
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/'
  }, {
    label: 'Dashboard',
    icon: 'i-heroicons-chart-bar',
    to: '/dashboard'
  }]
];

// Comprobación reactiva de la ruta actual y el estado de currentUser
// Los botones deben actualizarse cada vez que el estado de currentUser o la ruta cambien
</script>
