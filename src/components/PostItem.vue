<template>
  <div
    class="flex bg-white border border-gray-200 rounded-lg p-3 mb-3 shadow hover:shadow-md cursor-pointer transition duration-200 hover:border-gray-400"
    :class="{ 'opacity-60': post.read }"
  >
    <!-- Miniatura en el Post ( iconos )-->
    <div class="flex-shrink-0 mr-3">
      <img
        v-if="post.thumbnail"
        :src="cleanThumbnail"
        class="w-16 h-16 object-cover rounded cursor-pointer"
        alt="Thumbnail"
        @click.stop="emitThumbnail"
      />
      <div
        v-else
        class="w-16 h-16 bg-gray-100 flex items-center justify-center text-gray-400"
      >
        No Img
      </div>
    </div>

    <!-- Contenido del Post -->
    <div class="flex-1">
      <h3
        class="font-medium text-gray-900 text-base hover:underline cursor-pointer"
        @click="select"
      >
        {{ post.title }}
      </h3>
      <div class="text-xs text-gray-500 mt-1">
        Por <span class="font-medium">{{ post.author }}</span> • {{ post.timeAgo }} • 💬 {{ post.numComments }}
      </div>

      <div class="mt-2 flex gap-2">
        <button
          @click.stop="confirmDismiss"
          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
        >
          Descartar
        </button>

        <button
          v-if="post.fullImage"
          @click.stop="saveImage"
          class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
        >
          Guardar imagen
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  props: ["post"],
  computed: {
    cleanThumbnail() {
      return this.post.thumbnail?.replace(/&amp;/g, "&");
    },
  },
  methods: {
    select() {
      this.$emit("select", this.post);
    },
    confirmDismiss() {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Este post será descartado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, descartar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "my-confirm-btn",
          cancelButton: "my-cancel-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.dismiss();
          Swal.fire("¡Descartado!", "El post ha sido eliminado.", "success");
        }
      });
    },
    dismiss() {
      this.$emit("dismiss", this.post.id);
    },
    emitThumbnail() {
      if (this.post.fullImage) {
        this.$emit("dismissImage", this.post.fullImage.replace(/&amp;/g, "&"));
      }
    },
    saveImage() {
      const link = document.createElement("a");
      link.href = this.post.fullImage.replace(/&amp;/g, "&");
      link.download = `${this.post.id}.jpg`;
      link.target = "_blank";
      link.click();
    },
  },
};
</script>
