<template>
  <n-card title="脊柱侧弯" :bordered="false" size="small">
    <n-form-item
      :ref="ref => setRef(ref, 'bendGeneralInspection')"
      :rule="{ required: true, message: '请选择' }"
      label="一般检查"
      :label-width="labelWidth"
      path="inputSpineScreeningQuery.bendGeneralInspection"
    >
      <n-checkbox-group
        v-model:value="form.bendGeneralInspection"
        name="bendGeneralInspection"
        :disabled="unScreenFields.bendGeneralInspection"
        @update:value="(_, op) => changeHis(op.value, 'bendGeneralInspection')"
      >
        <n-space>
          <n-checkbox v-for="item in sourceData.ybjc" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-checkbox>
        </n-space>
      </n-checkbox-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'anteriorFlexionThoracic')"
      path="inputSpineScreeningQuery.anteriorFlexionThoracic"
      :rule="{ required: true, message: '请选择' }"
      label="前屈试验-胸段"
      :label-width="labelWidth"
    >
      <n-radio-group
        v-model:value="form.anteriorFlexionThoracic"
        :disabled="unScreenFields.anteriorFlexionThoracic"
        name="anteriorFlexionThoracic"
      >
        <n-space>
          <n-radio v-for="item in sourceData.qqxd" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'anteriorFlexionWaistChest')"
      label="前屈试验-腰胸段"
      :label-width="labelWidth"
      :rule="{ required: true, message: '请选择' }"
    >
      <n-radio-group
        v-model:value="form.anteriorFlexionWaistChest"
        name="anteriorFlexionWaistChest"
        :disabled="unScreenFields.anteriorFlexionWaistChest"
      >
        <n-space>
          <n-radio v-for="item in sourceData.qqyxd" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'anteriorLumbarFlexion')"
      label="前屈试验-腰段"
      :label-width="labelWidth"
      :rule="{ required: true, message: '请选择' }"
      path="inputSpineScreeningQuery.anteriorLumbarFlexion"
    >
      <n-radio-group
        v-model:value="form.anteriorLumbarFlexion"
        name="anteriorLumbarFlexion"
        :disabled="unScreenFields.anteriorLumbarFlexion"
      >
        <n-space>
          <n-radio v-for="item in sourceData.qqyd" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <template v-if="showQugan">
      <div class="n-card-header py-3 pr-4">
        <div class="n-card-header__main" role="heading">躯干旋转测量仪检查</div>
      </div>
      <n-form-item
        :ref="ref => setRef(ref, 'thoracicSegmentAtr')"
        label="胸段ATR"
        path="inputSpineScreeningQuery.thoracicSegmentAtr"
        :label-width="labelWidth"
        :rule="{ required: true, message: '请选择', trigger: ['change', 'blur'], type: 'number' }"
      >
        <n-radio-group
          v-model:value="form.thoracicSegmentAtr"
          name="thoracicSegmentAtr"
          :disabled="unScreenFields.thoracicSegmentAtr"
        >
          <n-space>
            <n-radio v-for="item in sourceData.xdATR" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item
        :ref="ref => setRef(ref, 'thoracolumbarSegmentAtr')"
        label="腰胸段ATR"
        path="inputSpineScreeningQuery.thoracolumbarSegmentAtr"
        :label-width="labelWidth"
        :rule="{ required: true, message: '请选择', trigger: ['change', 'blur'], type: 'number' }"
      >
        <n-radio-group
          v-model:value="form.thoracolumbarSegmentAtr"
          name="thoracolumbarSegmentAtr"
          :disabled="unScreenFields.thoracolumbarSegmentAtr"
        >
          <n-space>
            <n-radio v-for="item in sourceData.yxdATR" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item
        :ref="ref => setRef(ref, 'lumbarSegmentAtr')"
        label="腰段ATR"
        path="inputSpineScreeningQuery.lumbarSegmentAtr"
        :label-width="labelWidth"
        :rule="{ required: true, message: '请选择', trigger: ['change', 'blur'], type: 'number' }"
      >
        <n-radio-group
          v-model:value="form.lumbarSegmentAtr"
          name="lumbarSegmentAtr"
          :disabled="unScreenFields.lumbarSegmentAtr"
        >
          <n-space>
            <n-radio v-for="item in sourceData.ydATR" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
    </template>
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
const labelWidth = 130;
const elRefs = reactive({});
const emits = defineEmits(['update:data']);
const form = computed({
  get() {
    return props.data.inputSpineScreeningQuery;
  },
  set(value) {
    emits('update:data', { value });
  }
});
const showQugan = computed(() => {
  return spineRelField.some(key => form.value[key] != '1');
});

const setRef = (el, key) => {
  el && (elRefs[key] = el);
};

function changeHis(v, key) {
  if (v === '1' || !form.value[key]?.length) {
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
