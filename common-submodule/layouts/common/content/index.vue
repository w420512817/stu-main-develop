<template>
  <div :class="{ 'p-4': showPadding }" class="h-full bg-[#f0f2f5] transition duration-300 ease-in-out">
    <router-view v-slot="{ Component, route }">
      <transition
        :name="pageAnimateMode"
        mode="out-in"
        :appear="true"
        @before-leave="handleBeforeLeave"
        @after-enter="handleAfterEnter"
      >
        <keep-alive :include="getCaches">
          <component :is="Component" v-if="appStore.reloadFlag" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { theme } from '@common/settings/theme';
import { useAppStore, useTabStore } from '@/store';

defineProps({
  showPadding: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['hide-main-overflow']);

const appStore = useAppStore();
const tabStore = useTabStore();

const pageAnimateMode = theme.page.animate ? theme.page.animateMode : undefined;

const getCaches = computed(() => {
  if (!theme.tab.visible) {
    return [];
  }
  return tabStore.getCachedTabList;
});

function handleBeforeLeave() {
  emit('hide-main-overflow', true);
}
function handleAfterEnter() {
  emit('hide-main-overflow', false);
}
</script>

<style scoped></style>
