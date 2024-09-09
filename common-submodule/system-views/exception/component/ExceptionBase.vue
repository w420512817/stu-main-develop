<template>
  <div class="flex-col-center wh-full">
    <div class="text-400px text-primary">
      <icon-custom-no-permission v-if="type === '403'" />
      <icon-custom-not-found v-if="type === '404'" />
      <icon-custom-service-error v-if="type === '500'" />
    </div>

    <n-space v-if="showBtn">
      <n-button type="primary" @click="route.go(-1)">返回</n-button>
      <n-button type="primary" @click="go()">回到首页</n-button>
    </n-space>
  </div>
</template>

<script setup>
import { useGo } from '@common/hooks/usePage';

defineProps({
  type: {
    type: String,
    default: '404'
  },
  showBtn: {
    type: Boolean,
    default: true
  }
});

const { go, route } = useGo();
</script>
<style scoped></style>
