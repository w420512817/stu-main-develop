<template>
  <div class="flex justify-between w-full">
    <h2 class="font-bold">{{ props.title }}</h2>
    <div>
      <h4 class="leading-4 font-bold text-right mb-2">{{ props.statusSt }}</h4>
      <div>
        <n-button size="small" type="primary" class="px-2" @click="go(props.editPath)"> 编辑 </n-button>
        <n-button size="small" class="ml-16px px-2" @click="go(props.backPath)">返回</n-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { string } from 'vue-types';
import { useGo } from '@common/hooks/usePage';
const props = defineProps({
  backPath: string().def(''),
  editPath: string().def(''),
  title: string().def(''),
  statusSt: string().def('')
});
const { go } = useGo();
</script>
