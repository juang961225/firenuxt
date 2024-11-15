// middleware/auth.js

export default defineNuxtRouteMiddleware((to, from) => {
  const { currentUser } = useFirebaseAuth(); // Obtener el estado de autenticación

  if (!currentUser.value) {
    // Si el usuario no está autenticado, redirigirlo a /login
    return navigateTo('/login');
  }
});
