<template>
  <n-card title="恒牙" :bordered="false">
    <n-form-item
      :ref="ref => setRef(ref, 'totalPermanentNum')"
      label="恒牙总数："
      path="inputCariesScreeningQuery.totalPermanentNum"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请输入',
        trigger: ['blur', 'input'],
        type: 'number'
      }"
    >
      <n-input-number
        v-model:value="formValue.inputCariesScreeningQuery.totalPermanentNum"
        :max="32"
        :min="0"
        :precision="0"
        :show-button="false"
        class="!w-200px"
        type="text"
        :disabled="props.disabled || unScreenFields.totalPermanentNum"
      >
        <template #suffix>颗</template>
      </n-input-number>
    </n-form-item>
  </n-card>
</template>

<script setup>
import { computed, reactive, inject } from 'vue';
import { object, bool, number } from 'vue-types';

const props = defineProps({
  data: object().def({}),
  disabled: bool().def(false),
  required: number().def(null),
  max: number().def(0)
});
const emits = defineEmits(['update:data']);

const unScreenFields = inject('unScreenFields');
const formValue = computed({
  get() {
    return props.data;
  },
  set(value) {
    emits('update:data', value);
  }
});
const elRefs = reactive({});
const setRef = (el, key) => {
  el && (elRefs[key] = el);
};
defineExpose({
  elRefs
});
</script>

<style scoped></style>
