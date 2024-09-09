<template>
  <svg aria-hidden="true" width="1em" height="1em">
    <use :xlink:href="symbolId" fill="currentColor" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon-custom'
  },
  icon: String
});

const symbolId = computed(() => `#${props.prefix}-${props.icon}`);
</script>

<style scoped></style>
