// middleware/authenticated.js

export default defineNuxtRouteMiddleware((to, from) => {
  const { currentUser } = useFirebaseAuth(); // Obtener el estado de autenticación

  if (currentUser.value) {
    // Si el usuario ya está logueado, redirigirlo a /dashboard o /home
    return navigateTo('/dashboard');  // O la ruta que prefieras para usuarios autenticados
  }
});
