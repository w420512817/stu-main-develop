<template>
  <div>
    <span v-if="!revert"> {{ label }}： </span>
    <span v-if="$slots.default" underline> &nbsp; <slot></slot> &nbsp;</span>
    <span v-if="revert"> {{ label }} </span>
  </div>
</template>

<script setup>
import { bool, string } from 'vue-types';

defineProps({
  label: string().def({}),
  revert: bool().def(false)
});
</script>

<style lang="scss" scoped></style>
