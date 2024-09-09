<template>
  <exception-base :type="type" :show-btn="showBtn" />
</template>

<script setup>
import ExceptionBase from './component/ExceptionBase.vue';

defineProps({
  type: {
    type: String,
    default: '403'
  },
  showBtn: {
    type: Boolean,
    default: true
  }
});
</script>
<style scoped></style>
