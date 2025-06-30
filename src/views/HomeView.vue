<template>
  <div class="flex flex-col md:flex-row md:justify-center gap-4 p-4 relative">
    <!-- Listado de posts -->
    <div class="flex-1 max-w-3xl mx-auto">
      <transition-group name="fade" tag="div">
        <PostItem
          v-for="(post, index) in posts"
          :key="post.id + '-' + index"
          :post="post"
          @select="showDetails"
          @dismiss="dismissPost"
          @dismissImage="openImageModal"
        />
      </transition-group>

      <!-- Botones de acciones -->
      <div class="flex justify-between mb-4 mt-4" v-if="posts.length || isSearchMode">
        <button
          @click="dismissAll"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Descartar todo
        </button>

        <button
          v-if="after && posts.length && !isSearchMode"
          @click="loadMore"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cargar más
        </button>
      </div>
    </div>
    <!-- Estado vacío llamativo -->
    <div
      v-if="!posts.length && !isSearchMode"
      class="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg w-full h-[700px]"
    >
      <img
        src="@/assets/images/reddit_happy.png"
        alt="Sin publicaciones"
        class="w-300 h-300 mb-4 opacity-50"
      />
      <h2 class="text-xl font-semibold text-black drop-shadow-lg">
        No hay publicaciones
      </h2>
      <p class="text-black mb-4 drop-shadow-lg">
        Parece que no hay publicaciones disponibles. ¡Carga algunas para comenzar!
      </p>
      <button
        @click="fetchPosts(true)"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Cargar publicaciones
      </button>
    </div>

    <!-- Panel lateral solo desktop -->
    <div
      v-if="selectedPost && !isMobile"
      class="w-full md:w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 sticky top-20 self-start h-[50rem] overflow-hidden"
    >
      <div class="h-full overflow-y-auto pr-2">
        <PostDetail :post="selectedPost" @close="selectedPost = null" />
      </div>
    </div>

    <!-- Modal detalle mobile -->
    <div
      v-if="selectedPost && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-lg p-4 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
      >
        <PostDetail :post="selectedPost" @close="selectedPost = null" />
      </div>
    </div>

    <!-- Modal de imagen completa -->
    <div
      v-if="imageModal"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      @click="imageModal = null"
    >
      <img :src="imageModal" class="max-h-[90vh] max-w-[90vw] object-contain" />
    </div>
  </div>
</template>

<script>
import PostItem from "@/components/PostItem.vue";
import PostDetail from "@/components/PostDetail.vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  components: { PostItem, PostDetail },
  data() {
    return {
      posts: [],
      after: null,
      selectedPost: null,
      isSearchMode: false,
      isMobile: false,
      imageModal: null,
    };
  },
  created() {
    this.loadData();
    this.checkScreenSize();
  },
  mounted() {
    window.addEventListener("resize", this.checkScreenSize);
    window.addEventListener("keydown", this.handleEscape);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
    window.removeEventListener("keydown", this.handleEscape);
  },
  watch: {
    "$route.query.q": {
      immediate: true,
      handler(newQuery) {
        if (newQuery && newQuery.trim()) {
          this.searchPosts(newQuery);
        } else {
          this.fetchPosts(true);
        }
      },
    },
  },
  methods: {
    checkScreenSize() {
      this.isMobile = window.innerWidth < 768;
    },
    handleEscape(e) {
      if (e.key === "Escape" && this.isMobile && this.selectedPost) {
        this.selectedPost = null;
      }
      if (e.key === "Escape" && this.imageModal) {
        this.imageModal = null;
      }
    },
    openImageModal(url) {
      this.imageModal = url;
    },
    loadData() {
      if (this.$route.query.q) {
        this.searchPosts(this.$route.query.q);
      } else {
        this.fetchPosts(true);
      }
    },
    async fetchPosts(reset = false) {
      if (reset) {
        this.posts = [];
        this.after = null;
      }
      this.isSearchMode = false;
      try {
        const url = `https://www.reddit.com/r/all/top.json?limit=50${
          this.after ? `&after=${this.after}` : ""
        }`;
        const res = await axios.get(url);
        const newPosts = res.data.data.children.map((c) => this.formatPost(c));
        this.posts = [...this.posts, ...newPosts];
        this.after = res.data.data.after;
      } catch (error) {
        console.error("Error al cargar posts:", error);
      }
    },
    async loadMore() {
      if (this.after) {
        this.fetchPosts();
      }
    },
    async searchPosts(term) {
      this.isSearchMode = true;
      try {
        const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(
          term
        )}&limit=50`;
        const res = await axios.get(url);
        this.posts = res.data.data.children.map((c) => this.formatPost(c));
        this.after = null;
      } catch (error) {
        console.error("Error en búsqueda:", error);
      }
    },
    formatPost(c) {
      return {
        id: c.data.id,
        title: c.data.title,
        author: c.data.author,
        timeAgo: this.timeSince(c.data.created_utc),
        thumbnail: c.data.thumbnail?.startsWith("http") ? c.data.thumbnail : null,
        fullImage: c.data.preview?.images?.[0]?.source?.url?.startsWith("http")
          ? c.data.preview.images[0].source.url.replace(/&amp;/g, "&")
          : null,
        numComments: c.data.num_comments,
        selftext: c.data.selftext,
        read: false,
      };
    },
    async showDetails(post) {
      post.read = true;
      this.selectedPost = { ...post, comments: [] };
      try {
        const res = await axios.get(`https://www.reddit.com/comments/${post.id}.json`);
        this.selectedPost.comments = this.mapComments(res.data[1].data.children);
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
        this.selectedPost.comments = [];
      }
    },
    mapComments(children) {
      return children
        .filter((c) => c.kind === "t1")
        .map((c) => ({
          author: c.data.author,
          body: c.data.body,
          score: c.data.score,
          createdUtc: c.data.created_utc,
          replies: c.data.replies ? this.mapComments(c.data.replies.data.children) : [],
        }));
    },
    dismissPost(postId) {
      this.posts = this.posts.filter((p) => p.id !== postId);
      if (this.selectedPost && this.selectedPost.id === postId) {
        this.selectedPost = null;
      }
    },
    dismissAll() {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, descartar todo",
        cancelButtonText: "Cancelar",
        buttonsStyling: false,
        customClass: {
          confirmButton: "my-confirm-btn",
          cancelButton: "my-cancel-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.posts = [];
          this.selectedPost = null;

          if (this.isSearchMode) {
            this.isSearchMode = false;
            this.$router.replace({ path: "/" });
            this.fetchPosts(true);
          }

          Swal.fire({
            title: "¡Descartado!",
            text: "Todos los posts han sido eliminados.",
            icon: "success",
          });
        }
      });
    },
    timeSince(createdUtc) {
      const seconds = Math.floor(Date.now() / 1000) - createdUtc;
      const hours = Math.floor(seconds / 3600);
      return `hace ${hours}h`;
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
