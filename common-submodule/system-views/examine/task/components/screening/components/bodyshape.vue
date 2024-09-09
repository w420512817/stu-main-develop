<template>
  <n-card size="small" :bordered="false">
    <n-form-item
      :ref="ref => setRef(ref, 'weight')"
      label="体重"
      label-width="66"
      path="inputCheckUpScreeningQuery.weight"
    >
      <n-input-number
        v-model:value="form.inputCheckUpScreeningQuery.weight"
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
      path="inputCheckUpScreeningQuery.height"
    >
      <n-input-number
        v-model:value="form.inputCheckUpScreeningQuery.height"
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
    <n-form-item path="bmi" label="BMI" label-width="66">
      <n-input
        v-model:value="form.inputCheckUpScreeningQuery.bmi"
        placeholder="系统自动计算"
        class="!w-300px"
        disabled
      />
    </n-form-item>

    <n-form-item :ref="ref => setRef(ref, 'bust')" label="胸围" label-width="66" path="inputCheckUpScreeningQuery.bust">
      <n-input-number
        v-model:value="form.inputCheckUpScreeningQuery.bust"
        placeholder="请输入"
        :disabled="unScreenFields.bust"
        :show-button="false"
      >
        <template #suffix>cm</template>
      </n-input-number>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'waistline')"
      label="腰围"
      label-width="66"
      :min="0"
      path="inputCheckUpScreeningQuery.waistline"
    >
      <n-input-number
        v-model:value="form.inputCheckUpScreeningQuery.waistline"
        placeholder="请输入"
        :show-button="false"
        :disabled="unScreenFields.waistline"
      >
        <template #suffix>cm</template>
      </n-input-number>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'hipline')"
      label="臀围"
      label-width="66"
      :min="0"
      path="inputCheckUpScreeningQuery.hipline"
    >
      <n-input-number
        v-model:value="form.inputCheckUpScreeningQuery.hipline"
        placeholder="请输入"
        :disabled="unScreenFields.hipline"
        :show-button="false"
      >
        <template #suffix>cm</template>
      </n-input-number>
    </n-form-item>
  </n-card>
</template>
<script setup>
import { computed, reactive, inject } from 'vue';
import { object, number } from 'vue-types';

const emits = defineEmits(['update:data']);
const props = defineProps({
  data: object().def({}),
  required: number().def(1)
});
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
const changeVal = () => {
  let { weight, height } = form.value?.inputCheckUpScreeningQuery || {};
  if (weight && height) {
    form.value.inputCheckUpScreeningQuery.bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
  }
};
const setRef = (el, key) => {
  el && (elRefs[key] = el);
};
defineExpose({
  elRefs
});
</script>
