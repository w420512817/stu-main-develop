<template>
  <div
    class="dark:bg-[#18181c] dark:text-white dark:text-opacity-82 transition-all duration-300 ease-in-out"
    :class="inverted ? 'bg-gradient-to-r from-[#2F5ACA] to-[#3866DE] text-white' : 'bg-white text-[#333639]'"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  inverted: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped></style>
