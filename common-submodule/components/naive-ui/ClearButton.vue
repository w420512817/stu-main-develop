<template>
  <n-button v-bind="$attrs" :icon-placement="iconPlacement">
    <slot name="default">{{ label }}</slot>
    <template v-if="hasIcon" #icon>
      <slot name="icon">
        <icon />
      </slot>
    </template>
  </n-button>
</template>

<script setup>
import { computed } from 'vue';
import { string, oneOf } from 'vue-types';
import { iconifyRender } from '@common/utils/common/icon';

const props = defineProps({
  label: string().def('查看'),
  icon: string(),
  iconPlacement: oneOf(['left', 'right']).def('left')
});

const hasIcon = computed(() => !!props.icon);

const icon = hasIcon.value ? iconifyRender(props.icon) : undefined;
</script>
