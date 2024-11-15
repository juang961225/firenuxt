import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(async (nuxtApp) => {
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

  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };

  let app;
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Configurar persistencia en local para mantener la sesión
  await setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Persistencia configurada correctamente");
    })
    .catch((error) => {
      console.error("Error al establecer persistencia:", error);
    });

  return {
    provide: {
      auth,
      db,
    },
  };
});
