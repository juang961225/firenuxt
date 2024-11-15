<template>
  <div>
    <h1>Dashboard (link security)</h1>
  </div>
</template>

<script setup lang="ts">
// pages/dashboard.vue

definePageMeta({
  middleware: 'authadmin' // Solo accesible si el usuario está logueado
});

</script>
