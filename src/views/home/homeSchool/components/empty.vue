<template>
  <div class="flex-center flex-col overflow-hidden">
    <img src="@/assets/image/dashbord/empty.png" class="w-180px h-147px mx-auto" />
    <span class="text-[#777] text-14px -mt-10">{{ empText }}</span>
  </div>
</template>

<script setup>
import { string } from 'vue-types';

defineProps({
  empText: string().def('暂无数据')
});
</script>
