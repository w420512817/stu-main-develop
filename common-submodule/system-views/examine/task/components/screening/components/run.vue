<template>
  <n-card :bordered="false" size="small">
    <n-form-item
      :ref="el => setRef(el, state.formKey)"
      :label="title"
      :label-style="{ 'font-weight': 600 }"
      label-width="auto"
      :path="`inputPhysicalScreeningQuery.${state.formKey}`"
    >
      <n-input-number
        v-model:value="form.inputPhysicalScreeningQuery[state.formKey]"
        placeholder="请输入"
        mr-3
        :precision="0"
        :show-button="false"
        :min="0"
        :disabled="unScreenFields[state.formKey]"
        @update:value="changeVal"
      >
        <template #suffix>分</template>
      </n-input-number>
      <n-input-number
        v-model:value="form.inputPhysicalScreeningQuery[state.formKey2]"
        placeholder="请输入"
        :max="60"
        :show-button="false"
        :min="0"
        :disabled="unScreenFields[state.formKey2]"
        @update:value="changeVal"
      >
        <template #suffix>秒</template>
      </n-input-number>
      <score-button v-if="score" :score="score" />
    </n-form-item>
  </n-card>
</template>
<script setup>
import { computed, reactive, inject } from 'vue';
import { object, string } from 'vue-types';
import { examPhysicalItems } from '../input.data.jsx';
import useScore from '../hooks/useScore';
import ScoreButton from './ScoreButton.vue';

const { score, getScore } = useScore();

const emits = defineEmits(['update:data']);
const props = defineProps({
  data: object().def({}),
  code: string().def(''),
  stuInfo: object().def({})
});
const unScreenFields = inject('unScreenFields');
const form = computed({
  get() {
    const data = props.data;
    return data;
  },
  set(value) {
    emits('update:data', value);
  }
});
const title = computed(() => {
  const str = examPhysicalItems.find(d => d.code == props.code)?.title ?? '';
  return str;
});
const state = computed(() => {
  const obj = examPhysicalItems.find(d => d.code == props.code) ?? {};
  console.log(obj, 'objobjobj');
  return obj;
});
const elRefs = reactive({});
const setRef = (el, key) => {
  el && (elRefs[key] = el);
};
const changeVal = async () => {
  const formKey = form.value.inputPhysicalScreeningQuery[state.value.formKey];
  const formKey2 = form.value.inputPhysicalScreeningQuery[state.value.formKey2];

  if (formKey && formKey2) {
    const time = formKey * 60 + formKey2;
    await getScore(state.value.formKey, time, props?.stuInfo);
  }
};

defineExpose({
  elRefs
});
</script>
