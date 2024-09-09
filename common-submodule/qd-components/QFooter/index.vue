<template>
  <q-card class="text-right my-3 pr-70px">
    <n-button type="primary" :loading="loading" @click="handleSubmit">保存</n-button>
    <n-button v-if="!noback" class="ml-4" ghost @click="handleBack">返回</n-button>
  </q-card>
</template>

<script setup>
import { useGo } from '@common/hooks/usePage';
import QCard from '@common/qd-components/QCard/index.vue';
import { bool, string } from 'vue-types';

const { route, go } = useGo();

const props = defineProps({
  noback: bool().def(false),
  backPath: string().def(null)
});

const emit = defineEmits(['save']);

const handleBack = () => {
  if (props.backPath) {
    console.log(props.backPath, 'props.backPath');
    go(props.backPath);
  } else {
    route.back();
  }
};

const handleSubmit = () => {
  emit('save');
};
</script>

<style lang="less" scoped></style>
