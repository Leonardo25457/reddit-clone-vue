<template>
  <div>
    <nav
      class="flex items-center justify-between px-4 md:px-8 py-3 bg-white shadow border-b sticky top-0 z-50"
    >
      <!-- Logo desktop -->
      <div class="hidden md:flex items-center gap-2">
        <img
          src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png"
          alt="Reddit"
          class="w-9 h-9"
        />
        <span class="font-bold text-3xl text-orange-600">reddit</span>
      </div>

      <!-- Botón hamburguesa mobile -->
      <button @click="showMobileMenu = !showMobileMenu" class="md:hidden text-gray-600">
        <svg
          v-if="!showMobileMenu"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Buscador desktop -->
      <div class="hidden md:flex flex-1 justify-center mx-4 max-w-lg relative">
        <div
          :class="[
            'flex items-center w-full bg-white px-3 py-1.5 rounded-full border transition-shadow',
            searchTerm ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200',
          ]"
        >
          <svg
            class="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <input
            v-model="searchTerm"
            @input="debouncedSearch"
            @focus="showDropdown = true"
            @blur="hideDropdown"
            type="text"
            placeholder="Buscar en Reddit"
            class="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400"
          />
          <button
            v-if="searchTerm"
            @click="clearSearch"
            class="ml-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <!-- Dropdown sugerencias para el search -->
        <div
          v-if="showDropdown && (suggestions.length || subreddits.length)"
          class="suggestions-box"
        >
          <div
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="suggestion-item"
            @mousedown.prevent="selectSuggestion(suggestion)"
          >
            <svg
              class="w-4 h-4 text-gray-500 mr-2"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            {{ suggestion }}
          </div>

          <div v-if="subreddits.length" class="community-label">Comunidades</div>

          <div
            v-for="sub in subreddits"
            :key="sub.id"
            class="suggestion-item"
            @mousedown.prevent="selectSuggestion(`r/${sub.display_name}`)"
          >
            <img
              :src="
                sub.icon_img ||
                'https://www.redditstatic.com/avatars/avatar_default_02_46A508.png'
              "
              class="w-5 h-5 rounded-full mr-2"
            />
            <span class="flex-1">r/{{ sub.display_name }}</span>
            <span class="text-xs text-gray-500">{{
              formatSubscribers(sub.subscribers)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Botones sesión desktop -->
      <div class="hidden md:flex items-center gap-2">
        <button
          class="items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
        >
          Descargar la app
        </button>

        <template v-if="isAuthenticated">
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
            >
              <img
                src="https://www.redditstatic.com/avatars/avatar_default_02_46A508.png"
                alt="avatar"
                class="w-8 h-8 rounded-full"
              />
              <svg
                class="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Menú usuario -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-sm"
            >
              <div
                class="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <img
                  src="https://www.redditstatic.com/avatars/avatar_default_02_46A508.png"
                  alt="avatar"
                  class="w-8 h-8 rounded-full"
                />
                <div class="flex flex-col">
                  <span class="font-medium text-gray-800">{{ userEmail }}</span>
                </div>
              </div>
              <hr />

              <button
                @click="logoutAndRedirect"
                class="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <button
            @click="$emit('login')"
            class="px-4 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600"
          >
            Iniciar sesión
          </button>
        </template>
      </div>
    </nav>

    <!-- Menú mobile (sin cambios) -->
    <div
      v-if="showMobileMenu"
      class="flex flex-col items-center text-center px-4 py-4 bg-white shadow-md md:hidden gap-4"
    >
      <div class="flex items-center gap-2">
        <img
          src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png"
          alt="Reddit"
          class="w-9 h-9"
        />
        <span class="font-bold text-3xl text-orange-600">reddit</span>
      </div>
      <div
        class="flex items-center w-full bg-white px-4 py-2 rounded-full border shadow-sm"
      >
        <svg
          class="w-5 h-5 text-gray-500 mr-2"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <input
          v-model="searchTerm"
          @input="debouncedSearch"
          type="text"
          placeholder="Buscar en Reddit"
          class="w-full bg-transparent focus:outline-none"
        />
        <button v-if="searchTerm" @click="clearSearch" class="clear-btn">✕</button>
      </div>
      <button class="w-full text-sm bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200">
        Descargar la app
      </button>
      <template v-if="isAuthenticated">
        <span class="text-orange-500 font-medium">Hola, {{ userEmail }}</span>
        <button
          @click="logoutAndRedirect"
          class="w-full px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          Salir
        </button>
      </template>
      <template v-else>
        <button
          @click="$emit('login')"
          class="w-full px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
        >
          Iniciar sesión
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import debounce from "lodash.debounce";

export default {
  name: "AppNavbar",
  data() {
    return {
      searchTerm: "",
      suggestions: [],
      subreddits: [],
      showDropdown: false,
      showMobileMenu: false,
      showUserMenu: false,
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    userEmail() {
      return this.$store.state.user?.email || "";
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    logoutAndRedirect() {
      this.$emit("logout");
    },
    async fetchSuggestions() {
      if (!this.searchTerm.trim()) {
        this.suggestions = [];
        this.subreddits = [];
        return;
      }
      try {
        const res = await axios.get(
          `https://www.reddit.com/search.json?q=${encodeURIComponent(
            this.searchTerm
          )}&limit=4`
        );
        this.suggestions = res.data.data.children
          .map((c) => c.data.title)
          .filter(Boolean);

        const srRes = await axios.get(
          `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(
            this.searchTerm
          )}&limit=4`
        );
        this.subreddits = srRes.data.data.children.map((c) => c.data);
      } catch (error) {
        console.error("Error al obtener sugerencias:", error);
      }
    },
    debouncedSearch: debounce(function () {
      this.fetchSuggestions();
      this.showDropdown = true;
      this.$emit("search", this.searchTerm.trim());
    }, 500),
    selectSuggestion(suggestion) {
      this.searchTerm = suggestion;
      this.suggestions = [];
      this.subreddits = [];
      this.showDropdown = false;
      this.showMobileMenu = false;
      this.$router.replace({ path: "/", query: { q: suggestion } });
      setTimeout(() => this.$router.replace({ path: "/" }), 1000);
      this.$emit("search", suggestion);
    },
    clearSearch() {
      this.searchTerm = "";
      this.suggestions = [];
      this.subreddits = [];
      this.showDropdown = false;
      if (this.$route.query.q) {
        this.$router.replace({ path: "/" });
      }
      this.$emit("search", "");
    },
    hideDropdown() {
      setTimeout(() => (this.showDropdown = false), 150);
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.showUserMenu = false;
      }
    },
    formatSubscribers(num) {
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M miembros";
      if (num >= 1_000) return (num / 1_000).toFixed(0) + "K miembros";
      return num + " miembros";
    },
  },
};
</script>

<style scoped>
.input-focused {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
.clear-btn {
  margin-left: 0.5rem;
  color: #6b7280;
  transition: color 0.2s;
}
.clear-btn:hover {
  color: #374151;
}
.suggestions-box {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 20rem;
  overflow-y: auto;
  z-index: 50;
}
.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.suggestion-item:hover {
  background: #f9fafb;
}
.community-label {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.5rem 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
}
</style>
