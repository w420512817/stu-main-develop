<template>
  <n-card class="mb-3" :bordered="false" size="small">
    <template #header>
      <p font-bold text-14px>青春期发育</p>
    </template>
    <n-form-item
      v-if="sex == 1"
      :ref="ref => setRef(ref, 'ageOfSpermatogenesis')"
      path="inputCheckUpScreeningQuery.ageOfSpermatogenesis"
      label="男生：首次遗精"
      label-width="120"
    >
      <n-input-number
        v-model:value="form.inputCheckUpScreeningQuery.ageOfSpermatogenesis"
        placeholder="请输入"
        :min="1"
        :precision="0"
        :show-button="false"
        :disabled="unScreenFields.ageOfSpermatogenesis"
      >
        <template #suffix>岁</template>
      </n-input-number>
    </n-form-item>
    <n-form-item
      v-else
      :ref="ref => setRef(ref, 'ageOfMenarche')"
      path="inputCheckUpScreeningQuery.ageOfMenarche"
      label="女生：初潮岁数"
      label-width="120"
    >
      <n-input-number
        v-model:value="form.inputCheckUpScreeningQuery.ageOfMenarche"
        :min="0"
        :precision="0"
        :show-button="false"
        placeholder="请输入"
        :disabled="unScreenFields.ageOfMenarche"
      >
        <template #suffix>岁</template>
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
  sex: number().def(1)
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
const setRef = (el, key) => {
  el && (elRefs[key] = el);
};
defineExpose({
  elRefs
});
</script>
