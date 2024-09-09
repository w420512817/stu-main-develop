<template>
  <n-card title="脊柱前后弯曲" :bordered="false" size="small">
    <n-form-item
      :ref="ref => setRef(ref, 'bfBendGeneralInspection')"
      label="一般检查"
      path="inputSpineScreeningQuery.bfBendGeneralInspection"
      :rule="{ required: true, message: '请选择' }"
      :label-width="labelWidth"
    >
      <n-radio-group
        v-model:value="form.bfBendGeneralInspection"
        name="bfBendGeneralInspection"
        :disabled="unScreenFields.bfBendGeneralInspection"
      >
        <n-space>
          <n-radio v-for="item in sourceData.ybjc2" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      v-if="form.bfBendGeneralInspection != '1'"
      :ref="ref => setRef(ref, 'proneTest')"
      label="俯卧试验"
      path="inputSpineScreeningQuery.proneTest"
      :rule="{ required: true, message: '请选择', type: 'number', trigger: ['change', 'blur'] }"
      :label-width="labelWidth"
    >
      <n-radio-group v-model:value="form.proneTest" name="proneTest" :disabled="unScreenFields.proneTest">
        <n-space>
          <n-radio v-for="item in sourceData.fwsy" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
  </n-card>
</template>

<script setup>
import { computed, reactive, inject } from 'vue';
import { object } from 'vue-types';
import { sourceData } from '../input.data';

const props = defineProps({
  data: object().def({})
});

const unScreenFields = inject('unScreenFields');
const labelWidth = 130;
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

defineExpose({
  elRefs
});
</script>
<style scoped lang="less"></style>
