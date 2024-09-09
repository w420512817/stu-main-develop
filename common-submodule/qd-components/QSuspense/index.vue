<template>
  <div v-if="loading" h-full w-full flex-center min-h-100px>
    <n-spin size="medium" />
  </div>
  <div v-else v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script setup>
import { bool } from 'vue-types';
defineProps({
  loading: bool()
});
</script>
