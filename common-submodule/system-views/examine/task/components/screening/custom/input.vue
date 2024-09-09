<template>
  <n-form-item
    ref="scItemRef"
    :label="info.screeningItemName"
    :path="`screenOptions[${idx[0]}].itemList[${idx[1]}].number`"
    :rule="{
      required: info.selection === 1,
      message: `请${isInput ? '输入' : '选择'}${info.screeningItemName}`,
      trigger: ['blur', isInput ? 'input' : 'change'],
      type: isInput ? 'string' : 'array',
      key: idx[0]
    }"
  >
    <n-input
      v-if="isInput"
      ref="scRef"
      v-model:value="info.number"
      :disabled="unScreenFields[info.screeningItemCode]"
      :placeholder="`请输入${info.screeningItemName}`"
    >
      <template v-if="info.itemUnit" #suffix> {{ info.itemUnit }} </template>
    </n-input>
    <n-checkbox-group
      v-if="isCheckBox"
      v-model:value="info.number"
      :disabled="unScreenFields[info.screeningItemCode]"
      @update:value="updateCheckFn"
    >
      <n-space>
        <n-checkbox v-for="(item, i) in info.itemOptionsList" :key="i" :value="item.optionsId">
          {{ item.optionsName }}
        </n-checkbox>
      </n-space>
    </n-checkbox-group>
    <n-select
      v-if="isSelect"
      v-model:value="info.number"
      :disabled="unScreenFields[info.screeningItemCode]"
      :placeholder="`请选择${info.screeningItemName}`"
      :options="info.itemOptionsList"
      label-field="optionsName"
      value-field="optionsId"
      multiple
      @update:value="updateFn"
    />
  </n-form-item>
</template>

<script setup>
import { computed, ref, inject } from 'vue';
import { object, array } from 'vue-types';
import { cloneDeep } from 'lodash-es';

const props = defineProps({
  data: object().def({}),
  idx: array().def([])
});
const emits = defineEmits(['update:data']);

const unScreenFields = inject('unScreenFields');
const selectOpts = ref([]);
const scRef = ref(null);
const scItemRef = ref(null);
const info = computed({
  get() {
    return props.data;
  },
  set(value) {
    emits('update:data', value);
  }
});
const isInput = computed(() => {
  return info.value.itemInput === 2;
});
const isCheckBox = computed(() => {
  return info.value.itemInput === 1 && info.value.itemStyle === 2;
});
const isSelect = computed(() => {
  return info.value.itemInput === 1 && info.value.itemStyle === 1;
});

const updateCheckFn = (value, option) => {
  if (option.actionType === 'uncheck') {
    return;
  }
  let arr = cloneDeep(value);
  let item = info.value.itemOptionsList.find(o => o.optionsId === option.value);
  if (item.optionsExclusive === 1) {
    info.value.number = [item.optionsId];
    return;
  } else {
    value.map((ele, i) => {
      let opt = info.value.itemOptionsList.find(o => o.optionsId === ele);
      if (opt.optionsExclusive === 1) {
        arr.splice(i, 1);
      }
    });
    info.value.number = arr;
    return;
  }
};
const updateFn = (value, option) => {
  let arr = cloneDeep(option);
  for (let i = 0; i < option.length; i++) {
    let item = option[i];
    let index = selectOpts.value.findIndex(o => o.optionsId === item.optionsId);
    if (index === -1 && item.optionsExclusive === 1) {
      info.value.number = [item.optionsId];
      selectOpts.value = [item];
      return;
    } else if (index > -1 && item.optionsExclusive === 1) {
      arr.splice(index, 1);
    }
  }
  info.value.number = arr.map(ele => ele.optionsId);
  selectOpts.value = arr;
};
defineExpose({
  scRef,
  scItemRef
});
</script>
<style scoped lang="less"></style>
