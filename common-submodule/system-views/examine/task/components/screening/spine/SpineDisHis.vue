<template>
  <n-card title="疾病史" :bordered="false" size="small">
    <n-form-item :ref="ref => setRef(ref, 'historyDisease')" :label-width="labelWidth" label=" ">
      <n-checkbox-group
        v-model:value="form.historyDisease"
        name="historyDisease"
        :disabled="unScreenFields.historyDisease"
        @update:value="(v, op) => changeHis(op.value, 'historyDisease')"
      >
        <n-space>
          <n-checkbox v-for="item in sourceData.jbs" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-checkbox>
        </n-space>
      </n-checkbox-group>
    </n-form-item>
  </n-card>
</template>

<script setup>
import { computed, reactive, inject } from 'vue';
import { object } from 'vue-types';
import { sourceData, spineRelField } from '../input.data';

const props = defineProps({
  data: object().def({})
});

const unScreenFields = inject('unScreenFields');
const labelWidth = 55;
const elRefs = reactive({});
const emits = defineEmits(['update:data']);
const form = computed({
  get() {
    return props.data.inputSpineScreeningQuery;
  },
  set(value) {
    emits('update:data', { inputSpineScreeningQuery: value });
  }
});
const setRef = (el, key) => {
  el && (elRefs[key] = el);
};

function changeHis(v, key) {
  if (v === '1') {
    form.value[key] = ['1'];
  } else {
    let i = form.value[key].indexOf('1');
    i !== -1 && form.value[key].splice(i, 1);
  }

  key === 'bendGeneralInspection' && checkShowDeviceTest();
}

function checkShowDeviceTest() {
  const needDeviceTest = spineRelField.some(key => {
    return form.value[key] != '1';
  });
  form.value.spinalMovementTest = needDeviceTest ? 1 : 0;
}

defineExpose({
  elRefs
});
</script>
<style scoped lang="less"></style>
