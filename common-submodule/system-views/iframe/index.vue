<template>
  <iframe class="wh-full" :src="currentRoute.meta.frameSrc"></iframe>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineOptions({ name: 'Iframe' });

const router = useRouter();
const { currentRoute } = router;
</script>

<style scoped></style>
