// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { currentUser, getUserRole } = useFirebaseAuth();
  
  // Espera que currentUser se actualice
  await nextTick();

  if (!currentUser.value) {
    return navigateTo('/login'); // Redirige al login si no hay usuario
  }

  // Obtén el rol del usuario logueado
  const userRole = await getUserRole();
  console.log(userRole);
  
  // Verifica si el rol es 'Admin', si no, redirige
  if (userRole !== 'Admin') {
    return navigateTo('/'); // Redirige a la página principal si no es administrador
  }
});
