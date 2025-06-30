<template>
  <div class="relative">
    
    <!-- Encabezado con el título y botón cerrar -->
    <div class="flex items-start justify-between mb-2">
      <h2 class="text-lg font-semibold text-gray-900 flex-1 pr-4">
        {{ post.title }}
      </h2>
      <button
        @click="$emit('close')"
        class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <img
      v-if="post.fullImage"
      :src="post.fullImage.replace(/&amp;/g, '&')"
      class="w-full rounded mb-3"
      alt="Imagen"
    />

    <p class="text-sm text-gray-700 mb-2">
      {{ post.selftext || "Sin descripción disponible." }}
    </p>

    <div class="text-xs text-gray-500 mb-4">
      Publicado por <span class="font-medium">{{ post.author }}</span> •
      {{ post.timeAgo }} • 💬 {{ post.numComments }}
    </div>

    <!-- Sección de Comentarios -->
    <div v-if="post.comments && post.comments.length" class="mt-4">
      <h3 class="font-semibold text-base mb-3">Comentarios:</h3>
      <ul class="space-y-4">
        <CommentItem
          v-for="(comment, index) in post.comments"
          :key="index"
          :comment="comment"
        />
      </ul>
    </div>

    <div v-else class="text-gray-500 text-sm mt-2">Cargando comentarios...</div>
  </div>
</template>

<script>
import CommentItem from "@/components/CommentItem.vue";

export default {
  name: "PostDetail",
  components: { CommentItem },
  props: {
    post: Object,
  },
};
</script>
