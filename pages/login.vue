<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Email" name="email">
      <UInput v-model.trim="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model.trim="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit" class="mt-4">
      login
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

// pages/login.vue

definePageMeta({
  middleware: 'authenticated' // Redirige a usuarios autenticados fuera de esta página
});

const toast = useToast()
const { login } = useFirebaseAuth()

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Must be at least 6 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})

// Definición de la interfaz para las notificaciones personalizadas
interface CustomNotification {
  title: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning' // Ajusta según los valores permitidos
  timeout?: number
  callback?: () => Promise<void>
}

// Función para agregar una notificación usando la interfaz CustomNotification
function addToastNotification(notification: CustomNotification) {
  toast.add(notification as Partial<CustomNotification>)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await login(event.data.email, event.data.password);
    
    addToastNotification({
      title: 'Redirecting to dashboard...',
      timeout: 1500,
      callback: async () => {
        await navigateTo({ path: '/' });
      }
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const firebaseError = error as { code: string };

      if (firebaseError.code === 'auth/wrong-password') {
        addToastNotification({
          title: 'Error: Incorrect password',
          description: 'The password entered is incorrect.',
          type: 'error'
        });
      } else if (firebaseError.code === 'auth/user-not-found') {
        addToastNotification({
          title: 'Error: User not found',
          description: 'No user found with the provided email.',
          type: 'error'
        });
      } else {
        addToastNotification({
          title: 'Login failed',
          description: 'An unexpected error occurred. Please try again later.',
          type: 'error'
        });
      }
    } else {
      addToastNotification({
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again later.',
        type: 'error'
      });
    }
  }
}

</script>

<style lang="scss" scoped></style>
