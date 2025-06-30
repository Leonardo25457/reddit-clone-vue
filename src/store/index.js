import Vue from "vue";
import Vuex from "vuex";
import { auth, googleProvider } from "@/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    authError: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setAuthError(state, error) {
      state.authError = error;
    },
  },
  actions: {
    async loginWithEmail({ commit }, { email, password }) {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        commit("setUser", user);
        commit("setAuthError", null);
      } catch (error) {
        commit("setAuthError", formatError(error));
      }
    },

    async registerWithEmail({ commit }, { email, password }) {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        commit("setUser", user);
        commit("setAuthError", null);
      } catch (error) {
        commit("setAuthError", formatError(error));
      }
    },

    async loginWithGoogle({ commit }) {
      try {
        const { user } = await signInWithPopup(auth, googleProvider);
        commit("setUser", user);
        commit("setAuthError", null);
      } catch (error) {
        commit("setAuthError", formatError(error));
      }
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("setUser", null);
    },

    listenAuth({ commit }) {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          commit("setUser", user);
          resolve(user);
        });
      });
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    authError: (state) => state.authError,
  },
});

// Utilidad opcional para mejorar los mensajes de error
function formatError(error) {
  const code = error.code || "";

  if (code === "auth/email-already-in-use") return "Este correo ya está registrado.";
  if (code === "auth/invalid-email") return "Correo inválido.";
  if (code === "auth/weak-password") return "La contraseña debe tener al menos 6 caracteres.";
  if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential")
    return "Credenciales incorrectas.";

  return "Ocurrió un error inesperado.";
}
