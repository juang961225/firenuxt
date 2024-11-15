// middleware/authenticated.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { currentUser, getUserRole } = useFirebaseAuth(); // Obtener el estado de autenticación

  // Esperar a que se obtenga el rol del usuario
  const userRole = currentUser?.value ? await getUserRole() : null;

  if (!currentUser?.value || userRole !== 'Admin') {
    // Redirigir al usuario si no está autenticado o no tiene el rol adecuado
    return navigateTo('/'); // Cambia a la ruta que prefieras
  }
});
