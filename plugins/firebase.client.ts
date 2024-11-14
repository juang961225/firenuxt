import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  const {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
  } = useRuntimeConfig().public;

  // Verificar que todas las variables de entorno están presentes
  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    console.error("Error: Las configuraciones de Firebase no están completas.");
    return;
  }

  // Configuración de Firebase
  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };

  // Inicialización de Firebase con reintentos en caso de fallo
  let app;
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Proveer $auth y $db para que estén disponibles en el contexto de Nuxt
  return {
    provide: {
      auth,
      db,
    },
  };
});
