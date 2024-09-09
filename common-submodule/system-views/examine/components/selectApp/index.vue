<template>
  <n-card title="应用选择" class="h-98%">
    <div class="h-full shadow-sm flex justify-around flex-wrap">
      <div
        v-for="item in list"
        :key="item.value"
        class="w-1/5 h-150px flex flex-col items-center justify-center shadow-sm cursor-pointer"
        @click="goApp(item.value)"
      >
        <img class="absolute w-1/5 h-150px z-1" :src="item.img" alt="" />
        <div class="relative z-2" style="color: #343e7a; font-size: 22px">{{ item.label }}</div>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { object, string } from 'vue-types';
import { useGo } from '@common/hooks/usePage';

const props = defineProps({
  list: object().def({}),
  path: string().def({})
});

const { go } = useGo();

function goApp(d) {
  go({ path: props.path, query: { appType: d } });
}
</script>
