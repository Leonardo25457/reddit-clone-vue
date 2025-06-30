<template>
  <li class="ml-4 border-l border-gray-200 pl-4 mt-3">
    <div class="flex items-start gap-2">
      <img
        src="https://www.redditstatic.com/avatars/avatar_default_02_46A508.png"
        alt="avatar"
        class="w-8 h-8 rounded-full"
      />

      <div>
        <div class="text-sm font-semibold text-gray-900 flex items-center gap-1">
          {{ comment.author }}
          <span class="text-xs text-gray-500 font-normal">• {{ timeAgo }}</span>
        </div>

        <p class="text-sm text-gray-800 mt-1">
          {{ comment.body }}
        </p>

        <div class="flex gap-4 text-xs text-gray-500 mt-2 items-center">
          <button class="flex items-center gap-1 hover:text-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            Votar
          </button>

          <button class="flex items-center gap-1 hover:text-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h11M3 6h11M3 14h7" />
            </svg>
            Responder
          </button>

          <button class="flex items-center gap-1 hover:text-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v16h16V4H4zm4 4h8M8 12h8m-8 4h5" />
            </svg>
            Compartir
          </button>
        </div>
      </div>
    </div>

    <!-- Botón de mostrar/ocultar replies -->
    <div v-if="comment.replies && comment.replies.length" class="ml-12 mt-2">
      <button
        @click="expanded = !expanded"
        class="text-xs text-blue-500 hover:underline flex items-center gap-1"
      >
        <svg
          :class="['w-4 h-4 transform transition-transform', expanded ? 'rotate-90' : 'rotate-0']"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {{ expanded ? `${comment.replies.length} respuestas menos` : `${comment.replies.length} respuestas más` }}
      </button>
    </div>

    <ul
      v-if="comment.replies && comment.replies.length && expanded"
      class="mt-3"
    >
      <CommentItem
        v-for="(reply, index) in comment.replies"
        :key="index"
        :comment="reply"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: "CommentItem",
  props: {
    comment: Object,
  },
  data() {
    return {
      expanded: true,
    };
  },
  computed: {
    timeAgo() {
      const seconds = Math.floor((Date.now() - this.comment.createdUtc * 1000) / 1000);
      if (seconds < 60) return `hace ${seconds}s`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `hace ${minutes}m`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `hace ${hours}h`;
      const days = Math.floor(hours / 24);
      return `hace ${days}d`;
    },
  },
};
</script>
