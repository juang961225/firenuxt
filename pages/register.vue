<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Email" name="email">
      <UInput v-model.trim="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model.trim="state.password" type="password" />
    </UFormGroup>

    <UFormGroup label="Role" name="role">
      <USelect v-model="state.role" color="primary" variant="outline" :options="['User', 'Doc', 'Admin']" />
    </UFormGroup>

    <UButton type="submit" class="mt-4">
      Register
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const { register } = useFirebaseAuth();

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Must be at least 6 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  role: undefined,
  email: undefined,
  password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data.role);
  
  try {
    await register(event.data.email, event.data.password, event.data.role);
    toast.add({
      title: 'redirect to dasboard...',
      timeout: 2500,
      callback: async () => {
        console.log('redirect to dasboard...');
        // ... or as a route object
        await navigateTo({ path: '/dashboard' })
      }
    })
  } catch (error) {
    console.log(error);

  }
}

</script>

<style lang="scss" scoped></style>
