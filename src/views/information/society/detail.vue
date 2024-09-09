<template>
  <div vertical class="w-full">
    <n-card mb-3>
      <div class="flex justify-between w-full">
        <h2 class="font-bold text-4">{{ query.name }}</h2>
        <n-button size="small" type="primary" class="ml-16px px-2" @click="back">返回</n-button>
      </div>
    </n-card>
    <n-card class="h-full">
      <DetailForm :id="query.id" />
    </n-card>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
// hooks
import { useGo } from '@common/hooks/usePage';

// components
import DetailForm from './components/DetailForm.vue';

const { query } = useRoute();

const { route } = useGo();

const back = () => {
  route.go(-1);
};

defineOptions({ name: 'SocietyDetail' });
</script>

<style scoped lang="less"></style>
