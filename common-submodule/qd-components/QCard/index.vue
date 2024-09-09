<template>
  <n-card
    v-bind="$attrs"
    :title="title"
    class="mb-md"
    :header-style="`font-size: 18px;height: 52px;${!inner ? 'border-bottom: 1px solid #eee;' : ''}`"
  >
    <slot></slot>
  </n-card>
</template>

<script setup>
import { string, bool } from 'vue-types';

defineProps({
  title: string().def(null),
  inner: bool().def(false)
});
</script>

<style lang="less" scoped>
:deep(.n-card-header__main) {
  font-weight: 700 !important;
}

:deep(.n-card__content) {
  padding-top: 16px;
}
</style>
