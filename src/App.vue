<template>
  <div>
    <AppNavbar
      v-if="showNavbar"
      @login="showModal = true"
      @logout="logout"
      @search="performSearch"
    />

    <!-- Solo se renderiza <main> si NO estamos en la vista de Login -->
    <main v-if="!isLoginRoute" class="max-w-7xl mx-auto px-4 py-6">
      <router-view />
    </main>

    <!-- Si estamos en Login, renderiza el router-view directo sin contenedor -->
    <router-view v-else />

    <LoginModal v-if="showModal" @close="showModal = false" />
  </div>
</template>

<script>
import AppNavbar from "@/components/Navbar.vue";
import LoginModal from "@/components/LoginModal.vue";
import { mapActions, mapGetters } from "vuex";
import Swal from "sweetalert2";

export default {
  components: { AppNavbar, LoginModal },
  data() {
    return { showModal: false, firstLoad: true };
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    isLoginRoute() {
      return this.$route.name === "login";
    },
    showNavbar() {
      return this.isAuthenticated && this.$route.name !== "login";
    },
  },
  watch: {
    isAuthenticated(newVal, oldVal) {
      if (this.firstLoad) {
        this.firstLoad = false;
        return;
      }
      if (newVal && !oldVal) {
        this.showModal = false;
        this.showToast("Inicio de sesión exitoso ✅", "success");
      }
      if (!newVal && oldVal) {
        this.showToast("Sesión cerrada 👋", "error");
      }
    },
  },
  created() {
    this.listenAuth();
  },
  methods: {
    ...mapActions({
      logoutAction: "logout",
      listenAuth: "listenAuth",
    }),

    showToast(message, type) {
      Swal.fire({
        position: "top-end",
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    },

    performSearch(term) {
      const currentQuery = this.$route.query.q || "";
      if (term === currentQuery) return;
      this.$router.push({ name: "home", query: { q: term } });
    },
    async logout() {
      await this.logoutAction();
      this.showToast("Sesión cerrada 👋", "error");
      this.$router.push({ name: "login" });
    },
  },
};
</script>
