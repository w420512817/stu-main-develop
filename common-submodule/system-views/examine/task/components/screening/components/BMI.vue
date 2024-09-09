<template>
  <n-card :bordered="false" size="small">
    <n-form-item
      :ref="ref => setRef(ref, 'weight')"
      label="体重"
      label-width="66"
      :label-style="{ 'font-weight': 600 }"
      path="inputPhysicalScreeningQuery.weight"
    >
      <n-input-number
        v-model:value="form.inputPhysicalScreeningQuery.weight"
        :precision="2"
        placeholder="请输入"
        :show-button="false"
        :disabled="unScreenFields.weight"
        @update:value="changeVal"
      >
        <template #suffix>kg</template>
      </n-input-number>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'height')"
      label="身高"
      label-width="66"
      :label-style="{ 'font-weight': 600 }"
      path="inputPhysicalScreeningQuery.height"
    >
      <n-input-number
        v-model:value="form.inputPhysicalScreeningQuery.height"
        placeholder="请输入"
        :precision="2"
        :min="100"
        :max="200"
        :show-button="false"
        :disabled="unScreenFields.height"
        @update:value="changeVal"
      >
        <template #suffix>cm</template>
      </n-input-number>
    </n-form-item>
    <n-form-item path="bmi" label="体重指数" label-width="66" :label-style="{ 'font-weight': 600 }">
      <n-input
        v-model:value="form.inputPhysicalScreeningQuery.bmi"
        class="!w-300px"
        placeholder="系统自动计算"
        disabled
      />
      <score-button v-if="score" :score="score" />
    </n-form-item>
  </n-card>
</template>
<script setup>
import { computed, reactive, inject } from 'vue';
import { object, number } from 'vue-types';
import useScore from '../hooks/useScore';

import ScoreButton from './ScoreButton.vue';

const emits = defineEmits(['update:data']);
const props = defineProps({
  data: object().def({}),
  required: number().def(1),
  stuInfo: object().def({})
});

const { score, getScore } = useScore();
const unScreenFields = inject('unScreenFields');
const form = computed({
  get() {
    return props.data;
  },
  set(value) {
    emits('update:data', value);
  }
});
const elRefs = reactive({});

const changeVal = async value => {
  if (form.value?.inputPhysicalScreeningQuery?.weight && form.value?.inputPhysicalScreeningQuery?.height) {
    // 计算体重指数
    const bim = (
      form.value.inputPhysicalScreeningQuery.weight / Math.pow(form.value.inputPhysicalScreeningQuery.height / 100, 2)
    ).toFixed(2);

    form.value.inputPhysicalScreeningQuery.bmi = bim;
    await getScore('bmi', value, props?.stuInfo);
  }
};
const setRef = (el, key) => {
  el && (elRefs[key] = el);
};
defineExpose({
  elRefs
});
</script>
