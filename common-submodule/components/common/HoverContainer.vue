<template>
  <div v-if="tooltipContent">
    <n-tooltip :placement="placement" trigger="hover">
      <template #trigger>
        <div class="flex-center h-full cursor-pointer" :class="[inverted ? 'hover:bg-primary' : 'hover:bg-[#f6f6f6]']">
          <slot></slot>
        </div>
      </template>
      {{ tooltipContent }}
    </n-tooltip>
  </div>
  <div v-else class="flex-center cursor-pointer" :class="[inverted ? 'hover:bg-primary' : 'hover:bg-[#f6f6f6]']">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  tooltipContent: {
    type: String,
    default: ''
  },
  placement: {
    type: String,
    default: 'bottom'
  },
  inverted: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped></style>
