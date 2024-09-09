<template>
  <q-suspense v-bind="$attrs"> <slot></slot> </q-suspense>
</template>

<script setup>
import QSuspense from '../QSuspense/index.vue';
</script>
