<template>
  <n-space align="center" :wrap="false">
    <n-button type="primary" @click="handleClick(AC_SEARCH)">查询</n-button>
    <n-button v-if="hasReset" @click="handleClick(AC_RESET)">重置</n-button>
    <slot></slot>
    <template v-if="hasCollapsed">
      <n-button text type="primary" icon-placement="right" strong @click="handleClick(AC_TRIGGER)">
        {{ overflow ? '展开' : '收起' }}
        <template #icon>
          <icon-carbon:chevron-down v-if="overflow" />
          <icon-carbon:chevron-up v-else />
        </template>
      </n-button>
    </template>
  </n-space>
</template>

<script setup>
import { bool, oneOf } from 'vue-types';
import { AC_SEARCH, AC_RESET, AC_TRIGGER } from '@common/enum/pageEnum';
import { useBreakpoint } from '@common/hooks/useBreakpoint';

const props = defineProps({
  hasReset: bool().def(true),
  breakpoint: oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'mxxl']), // 屏幕断点配置 @common/settings/theme
  overflow: bool().def(false)
});

const emits = defineEmits(['search', 'delete', 'reset', 'collapse']);

const { breakpoint } = useBreakpoint();

const hasCollapsed = props.breakpoint ? breakpoint.smaller(props.breakpoint) : false;

function handleClick(key) {
  switch (key) {
    case AC_SEARCH:
      emits('search');
      break;

    case AC_RESET:
      emits('reset');
      break;

    case AC_TRIGGER:
      emits('collapse');
      break;

    default:
      break;
  }
}
</script>

<style scope></style>
