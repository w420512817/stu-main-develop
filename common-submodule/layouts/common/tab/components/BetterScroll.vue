<template>
  <div ref="bsWrap" class="h-full text-left">
    <div ref="bsContent" class="inline-block" :class="{ 'h-full': !isScrollY }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { object } from 'vue-types';
import { useElementSize } from '@vueuse/core';
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';

const props = defineProps({
  /** better-scroll的配置: https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html */
  options: object()
});

const bsWrap = ref(null);
const instance = ref(null);
const bsContent = ref(null);
const isScrollY = computed(() => Boolean(props.options.scrollY));

// 鼠标滚轮支持
props.options.mouseWheel && BScroll.use(MouseWheel);

function initBetterScroll() {
  if (!bsWrap.value) return;
  instance.value = new BScroll(bsWrap.value, props.options);
}

// 滚动元素发生变化，刷新BS
const { width: wrapWidth } = useElementSize(bsWrap);
const { width, height } = useElementSize(bsContent);
watch([() => wrapWidth.value, () => width.value, () => height.value], () => {
  if (instance.value) {
    instance.value.refresh();
  }
});

onMounted(() => {
  initBetterScroll();
});

defineExpose({ instance });
</script>

<style scoped></style>
