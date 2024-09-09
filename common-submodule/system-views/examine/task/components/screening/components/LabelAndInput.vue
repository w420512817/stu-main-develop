<template>
  <n-card :bordered="false" size="small">
    <n-form-item
      :ref="el => setRef(el, state.formKey)"
      :label="title"
      :path="`inputPhysicalScreeningQuery.${state.formKey}`"
      :label-style="{ 'font-weight': 600 }"
      label-width="auto"
      :rule="{
        message: `请输入`,
        trigger: ['blur', 'input'],
        type: 'string'
      }"
    >
      <n-input
        v-model:value="form.inputPhysicalScreeningQuery[state.formKey]"
        :allow-input="state.allowI"
        class="!w-300px"
        :disabled="unScreenFields[state.formKey]"
        @update:value="handleInput"
      >
        <template #suffix>{{ state.suffix }}</template>
      </n-input>
      <score-button v-if="score" :score="score" />
    </n-form-item>
  </n-card>
</template>
<script setup>
import { computed, reactive, inject } from 'vue';
import { object, string, number } from 'vue-types';
import { examPhysicalItems } from '../input.data.jsx';
import ScoreButton from './ScoreButton.vue';
import useScore from '../hooks/useScore';

const { score, getScore } = useScore();

const emits = defineEmits(['update:data']);
const props = defineProps({
  data: object().def({}),
  code: string().def(''),
  required: number().def(1),
  stuInfo: object().def({})
});
const unScreenFields = inject('unScreenFields');
const elRefs = reactive({});
const title = computed(() => {
  const str = examPhysicalItems.find(d => d.code == props.code)?.title ?? '';
  return str;
});
const state = computed(() => {
  const obj = examPhysicalItems.find(d => d.code == props.code) ?? {};
  return obj;
});

const handleInput = async value => {
  await getScore(state.value?.formKey, value, props?.stuInfo);
};

const form = computed({
  get() {
    return props.data;
  },
  set(value) {
    emits('update:data', value);
  }
});
const setRef = (el, key) => {
  el && (elRefs[key] = el);
};

defineExpose({
  elRefs
});
</script>
