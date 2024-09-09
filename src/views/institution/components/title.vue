<template>
  <div class="flex justify-between w-full">
    <h2 class="font-bold">{{ props.title }}</h2>
    <n-button size="small" class="ml-16px px-2" type="primary" @click="go(props.backPath)">返回</n-button>
  </div>
</template>
<script setup>
import { string } from 'vue-types';
import { useGo } from '@common/hooks/usePage';
const props = defineProps({
  backPath: string().def(''),
  title: string().def('')
});
const { go } = useGo();
</script>
