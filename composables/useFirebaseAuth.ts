import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Asegúrate de importar Firestore
import { ref, watch } from "vue";
import type { User } from "firebase/auth";

export const useFirebaseAuth = () => {
  const { $auth, $db } = useNuxtApp();
  const currentUser = ref<User | null>(null);

  // Usar watch para observar cuando $auth esté disponible
  watch(
    () => $auth, // Se observa el cambio de $auth
    (newAuth) => {
      if (newAuth) {
        setPersistence(newAuth, browserLocalPersistence)
          .then(() => {
            console.log("Persistencia configurada correctamente");
          })
          .catch((error) => {
            console.error("Error al establecer persistencia:", error);
          });
      }
    },
    { immediate: true } // Ejecutar de inmediato si $auth ya está disponible
  );

  watch(
    () => $auth,
    () => {
      if ($auth) {
        onAuthStateChanged($auth, (user: User | null) => {
          currentUser.value = user;
        });
      }
    },
    { immediate: true }
  );

  const register = async (email: string, password: string, role: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword($auth, email, password);
      await setDoc(doc($db, "users", userCredential.user.uid), {
        role: role
      });
      
      console.log(userCredential.user);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword($auth, email, password);
      console.log(userCredential.user);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await signOut($auth);
      await navigateTo('/login');
    } catch (error) {
      console.error(error);
    }
  };

  // Nuevo método para obtener el rol del usuario
  const getUserRole = async () => {
    if (currentUser.value) {
      try {
        const userDocRef = doc($db, "users", currentUser.value.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const role = userDocSnap.data()?.role;
          return role; // Retorna el rol del usuario
        } else {
          console.error("No se encontró el documento del usuario");
          return null;
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        return null;
      }
    }
    return null;
  };

  return {
    currentUser,
    register,
    login,
    logout,
    getUserRole // Agregado el método para consultar el rol
  };
};
