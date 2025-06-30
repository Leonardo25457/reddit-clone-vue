<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
    :style="{ backgroundImage: `url(${require('@/assets/images/reddit-login.jpg')})` }"
  >
    <div class="w-full max-w-md p-4">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";

export default {
  components: { LoginForm },
};
</script>
