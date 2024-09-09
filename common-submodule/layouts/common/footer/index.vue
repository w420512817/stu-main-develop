<template>
  <div class="flex-center h-full">
    <span>Copyright ©{{ curYear }} 清大视光</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const curYear = ref(new Date().getFullYear());
defineOptions({ name: 'GlobalFooter' });
</script>

<style scoped></style>
