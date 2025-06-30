<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-xl w-full max-w-md relative shadow-lg">

      <!-- Cerrar Modal -->
      <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-500 hover:text-black text-xl">
        &times;
      </button>

      <h2 class="text-2xl font-semibold mb-4 text-center">Iniciar sesión</h2>

      <p class="text-center text-gray-500 text-sm mb-4">
        Al continuar, aceptas nuestro
        <span class="text-blue-600 hover:underline cursor-pointer">Acuerdo de Usuario</span>
        y reconoces que entiendes la
        <span class="text-blue-600 hover:underline cursor-pointer">Política de Privacidad</span>.
      </p>

      <!-- Login Google -->
      <button @click="loginGoogle"
        class="w-full mb-3 flex items-center justify-center border rounded-full px-4 py-2 hover:bg-gray-100">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5 mr-2" />
        Continuar con Google
      </button>

      <div class="flex items-center my-3">
        <div class="flex-grow h-px bg-gray-300"></div>
        <span class="mx-2 text-gray-500 text-sm">o</span>
        <div class="flex-grow h-px bg-gray-300"></div>
      </div>

      <!-- Login Email -->
      <div class="mb-3">
        <input v-model="email" @blur="emailTouched = true" type="email"
          placeholder="Correo electrónico o nombre de usuario"
          :class="[
            'w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none text-sm border',
            emailTouched && !validEmail(email) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
          ]" />
        <p v-if="emailTouched && !validEmail(email)" class="text-red-500 text-xs mt-1">
          Ingresa un correo válido.
        </p>
      </div>

      <!-- Password -->
      <div class="mb-3 relative">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" @blur="passwordTouched = true"
          placeholder="Contraseña"
          :class="[
            'w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none text-sm border pr-10',
            passwordTouched && !validPassword(password) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
          ]" />
        <button type="button" @click="showPassword = !showPassword"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 px-3 text-gray-500">
          <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.944-9.543-7a10.054 10.054 0 012.211-3.592M6.177 6.177A9.98 9.98 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.972 9.972 0 01-4.128 5.246M3 3l18 18" />
          </svg>
        </button>
      </div>

      <!-- Botón principal -->
      <button @click="submitForm"
        class="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 mb-2 flex justify-center items-center text-sm font-medium">
        <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3.293-3.293-1.414-1.414L12 2l-3.293 3.293 1.414 1.414L12 4V0a8 8 0 00-8 8h4z" />
        </svg>
        <span>{{ isRegister ? "Registrarse" : "Iniciar sesión" }}</span>
      </button>

      <div class="text-center mt-4 text-sm">
        <span>{{ isRegister ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?" }}</span>
        <button class="text-blue-600 hover:underline ml-1" @click="toggleMode">
          {{ isRegister ? "Iniciar sesión" : "Regístrate" }}
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loading: false,
      isRegister: false,
      emailTouched: false,
      passwordTouched: false,
    };
  },
  computed: {
    ...mapGetters(["authError", "isAuthenticated"]),
  },
  methods: {
    ...mapActions(["loginWithEmail", "loginWithGoogle", "registerWithEmail"]),

    validEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },
    validPassword(password) {
      const regex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
      return regex.test(password);
    },
    async submitForm() {
      if (this.loading) return;

      if (!this.validEmail(this.email)) {
        this.showErrorToast("Ingresa un correo válido.");
        return;
      }

      if (!this.validPassword(this.password)) {
        this.showErrorToast(
          "La contraseña debe tener al menos 6 caracteres, una mayúscula y un símbolo."
        );
        return;
      }

      this.loading = true;

      if (this.isRegister) {
        await this.registerWithEmail({ email: this.email, password: this.password });
      } else {
        await this.loginWithEmail({ email: this.email, password: this.password });
      }

      this.loading = false;

      this.$nextTick(() => {
        if (this.authError) {
          this.showErrorToast(this.authError);
        } else {
          this.showSuccessToast(this.isRegister ? "Registro exitoso" : "Inicio de sesión exitoso");
          this.$router.push({ name: 'home' });
        }
      });
    },
    async loginGoogle() {
      if (this.loading) return;
      this.loading = true;

      await this.loginWithGoogle();

      this.loading = false;

      if (this.authError) {
        this.showErrorToast(this.authError);
      } else {
        this.showSuccessToast("Inicio de sesión exitoso");
        this.$router.push({ name: 'home' });
      }
    },
    showErrorToast(message) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
    },
    showSuccessToast(message) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
    },
    toggleMode() {
      this.isRegister = !this.isRegister;
    },
  },
};
</script>
