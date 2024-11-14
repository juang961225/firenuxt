<template>
  <UContainer>
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <h1>Welcome to Nuxt UI Starter</h1>
          <div class="flex">
            <UButton class="mr-3" @click="logout">logout</UButton>
            <ColorScheme><USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" /></ColorScheme>
          </div>
        </div>
      </template>

      <slot/>

      <UNotifications />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const { logout } = useFirebaseAuth();
</script>
