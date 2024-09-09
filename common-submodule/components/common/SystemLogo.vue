<template>
  <icon-custom-logo-fill v-if="fill" />
  <icon-custom-logo-white v-else />
</template>

<script setup>
defineProps({
  fill: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped></style>
