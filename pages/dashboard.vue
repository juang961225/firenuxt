<template>
  <div>
    <h1>Dashboard (link security)</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth' // Asegura que solo los usuarios autenticados accedan a esta página
});
</script>
