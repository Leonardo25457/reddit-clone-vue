<template>
  <div class="max-w-2xl mx-auto p-4">
    <PostItem
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @select="selectPost"
      @dismiss="dismissPost"
    />
    <div class="flex justify-between mb-4 mt-4">
      <button
        @click="dismissAll"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Descartar todo
      </button>
      <button
        v-if="after"
        @click="loadMore"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Cargar más
      </button>
    </div>
  </div>
</template>

<script>
import PostItem from "./PostItem.vue";

export default {
  props: ["posts", "after"],
  components: { PostItem },
  methods: {
    selectPost(post) {
      this.$emit("select", post);
    },
    dismissPost(postId) {
      this.$emit("dismiss", postId);
    },
    loadMore() {
      this.$emit("loadMore");
    },
    dismissAll() {
      this.$emit("dismissAll");
    },
  },
};
</script>
