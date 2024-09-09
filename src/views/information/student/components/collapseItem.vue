<template>
  <div>
    <p
      class="flex justify-between leading-8 items-center hover:bg-info_active px-2 cursor-pointer select-none"
      :class="{ 'text-primary': selectKey == row.key }"
      @click="clickItem(row)"
    >
      <span text-3 :class="{ 'text-4': row.depth == 1, 'text-3.5': row.depth == 2, 'font-bold': row.depth == 1 }">{{
        row.label
      }}</span>
      <template v-if="row.children">
        <icon-carbon:chevron-down v-if="toggle" />
        <icon-carbon:chevron-right v-else />
      </template>
      <template v-else><icon-ion:md-more /></template>
    </p>
    <div v-show="row.children && toggle">
      <collapseItem
        v-for="subItem in row.children"
        :key="subItem.key"
        :item="subItem"
        :select-id="selectKey"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { object, number } from 'vue-types';

const props = defineProps({
  item: object().def({}),
  selectId: number() // 选中行的key
});
const emits = defineEmits('update-value');

const selectKey = computed(() => {
  return props.selectId;
});
const row = computed(() => {
  return props.item;
});
const toggle = ref(true);

function clickItem(row) {
  toggle.value = !toggle.value;
  emits('update-value', row);
}
</script>
