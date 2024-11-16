import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { ref } from "vue";
import type { User as FirebaseUser } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";

// Definir la estructura del usuario y doctor
interface Doctor {
  name: string;
  value: string;
  disabled?: boolean;
}

export const useFirebaseAuth = () => {
  const { $auth, $db } = useNuxtApp();
  const currentUser = ref<FirebaseUser | null>(null);
  const appointments = ref<Array<{ doctor: string, date: string, name: string }>>([]);

  // Solo usar localStorage si estamos en el cliente
  if (process.client) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      currentUser.value = JSON.parse(savedUser);
    }
  }

  // Observador de estado de autenticación configurado inmediatamente
  if ($auth) {
    onAuthStateChanged($auth, (user: FirebaseUser | null) => {
      currentUser.value = user;
      if (user && process.client) {
        localStorage.setItem('user', JSON.stringify(user)); // Guardamos el usuario en localStorage
      } else if (process.client) {
        localStorage.removeItem('user'); // Eliminamos el usuario de localStorage
      }
    });
  }

  const register = async (email: string, password: string, role: string) => {
    try {
      // Crea el usuario con el correo y la contraseña
      const userCredential = await createUserWithEmailAndPassword($auth, email, password);

      // Estructura del objeto con la información del usuario
      const userData = {
        email: email,
        role: role,
        name: email.split('@')[0],  // O puedes agregar otro campo para el nombre
        photoURL: null,  // Si necesitas añadir una foto de usuario
        phoneNumber: null,  // Si necesitas añadir un número de teléfono
        emailVerified: false,  // Si quieres marcar si el email está verificado
        createdAt: new Date().toISOString(), // Puedes agregar la fecha de creación
      };

      // Guarda el documento con el uid como ID
      await setDoc(doc($db, "users", userCredential.user.uid), userData);

      console.log("Usuario registrado:", userCredential.user);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
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
      if (process.client) {
        localStorage.removeItem('user'); // Eliminar usuario de localStorage
      }
      await navigateTo('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const getUserRole = async () => {
    if (currentUser.value) {
      try {
        const userDocRef = doc($db, "users", currentUser.value.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          console.log(userDocSnap.data()?.role);
          return userDocSnap.data()?.role;
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

  // Obtener lista de doctores
  const getDoctors = async (): Promise<Doctor[]> => {
    try {
      const doctorsRef = collection($db, "users");
      const q = query(doctorsRef, where("role", "==", "Doc"));
      const querySnapshot = await getDocs(q);

      const doctors: Doctor[] = [];
      if (querySnapshot.empty) {
        console.log("No se encontraron doctores con el rol 'Doc'.");
        return doctors;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email) {
          doctors.push({
            name: data.email, // O usar otro campo si está disponible
            value: data.email,
            disabled: false,
          });
        }
      });

      return doctors;
    } catch (error) {
      console.error("Error al obtener la lista de doctores:", error);
      return [];
    }
  };

  const getAppointments = async (): Promise<{ doctor: string, date: string }[]> => {
    try {
      const appointmentsRef = collection($db, "appointments");
      const querySnapshot = await getDocs(appointmentsRef);

      const userAppointments: { doctor: string, date: string, name: string }[] = [];

      if (querySnapshot.empty) {
        console.log("No se encontraron citas médicas.");
        return []; // Si no se encuentran citas, retorna un array vacío
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        if (data.doctor && data.date) {
          userAppointments.push({
            doctor: data.doctor,
            date: data.date,
            name: data.name,
          });
        } else {
          console.log(`La cita ${doc.id} no tiene los campos requeridos ('doctor' y 'date').`);
        }
      });

      return userAppointments;
    } catch (error) {
      console.error("Error al obtener las citas médicas:", error);
      return [];
    }
  };

  const createAppointment = async (doctor: string, date: string) => {
    try {
      const newAppointment = {
        doctor,
        date,
        userId: currentUser.value?.uid,
        name: currentUser.value?.email
      };

      // Asegúrate de que doctor y date son válidos y no contienen caracteres no permitidos
      const docId = `${doctor}-${date}`; // Crea un ID único para cada cita
      await setDoc(doc($db, "appointments", docId), newAppointment);

      // Agregar la cita a la lista local
      appointments.value.push({ doctor, date, name });
      console.log("Cita creada:", newAppointment);
    } catch (error) {
      console.error("Error al crear la cita:", error);
    }
  };


  return {
    currentUser,
    register,
    login,
    logout,
    getUserRole,
    getDoctors,
    getAppointments,
    createAppointment,
    appointments,
  };
};
