<template>
  <n-card :bordered="false" size="small">
    <template v-if="props.code === 'tz_jzwqybjc'">
      <div class="font-bold text-16px m-b-3">脊柱侧弯</div>
      <n-form-item
        :ref="ref => setRef(ref, 'bendGeneralInspection')"
        label="一般检查"
        label-placement="top"
        :label-style="{ 'font-weight': 600 }"
        path="inputCheckUpScreeningQuery.bendGeneralInspection"
      >
        <n-checkbox-group
          v-model:value="form.bendGeneralInspection"
          name="radiogroup1"
          :disabled="unScreenFields.bendGeneralInspection"
          @update:value="(v, op) => changeHis(op.value, 'bendGeneralInspection')"
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
        label="前屈-胸段"
        label-placement="top"
        :label-style="{ 'font-weight': 600 }"
        path="inputCheckUpScreeningQuery.anteriorFlexionThoracic"
      >
        <n-radio-group
          v-model:value="form.anteriorFlexionThoracic"
          name="anteriorFlexionThoracic"
          :disabled="unScreenFields.anteriorFlexionThoracic"
          @update:value="checkShowDeviceTest"
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
        label="前屈-腰胸段"
        label-placement="top"
        :label-style="{ 'font-weight': 600 }"
        path="inputCheckUpScreeningQuery.anteriorFlexionWaistChest"
      >
        <n-radio-group
          v-model:value="form.anteriorFlexionWaistChest"
          name="anteriorFlexionWaistChest"
          :disabled="unScreenFields.anteriorFlexionWaistChest"
          @update:value="checkShowDeviceTest"
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
        label="前屈-腰段"
        label-placement="top"
        :label-style="{ 'font-weight': 600 }"
        path="inputCheckUpScreeningQuery.anteriorLumbarFlexion"
      >
        <n-radio-group
          v-model:value="form.anteriorLumbarFlexion"
          name="anteriorLumbarFlexion"
          :disabled="unScreenFields.anteriorLumbarFlexion"
          @update:value="checkShowDeviceTest"
        >
          <n-space>
            <n-radio v-for="item in sourceData.qqyd" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <template v-if="form.spinalMovementTest == 1">
        <div class="font-bold text-16px m-b-3">躯干旋转测量仪检查</div>
        <n-form-item
          :ref="ref => setRef(ref, 'thoracicSegmentAtr')"
          label="胸段ATR"
          label-placement="top"
          :label-style="{ 'font-weight': 600 }"
          path="inputCheckUpScreeningQuery.thoracicSegmentAtr"
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
          label-placement="top"
          :label-style="{ 'font-weight': 600 }"
          path="inputCheckUpScreeningQuery.thoracolumbarSegmentAtr"
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
          :ref="ref => setRef(ref, 'thoracolumbarSegmentAtr')"
          label="腰段ATR"
          label-placement="top"
          :label-style="{ 'font-weight': 600 }"
          path="inputCheckUpScreeningQuery.lumbarSegmentAtr"
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
    </template>

    <template v-else-if="props.code === 'tz_jzqhwqybjc'">
      <div class="font-bold text-base m-b-3">脊柱前后弯曲</div>
      <n-form-item
        :ref="ref => setRef(ref, 'thoracolumbarSegmentAtr')"
        label="一般检查"
        label-placement="top"
        :label-style="{ 'font-weight': 600 }"
        path="inputCheckUpScreeningQuery.bfBendGeneralInspection"
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
        v-if="form.bfBendGeneralInspection && form.bfBendGeneralInspection != '1'"
        :ref="ref => setRef(ref, 'thoracolumbarSegmentAtr')"
        label="俯卧试验"
        label-placement="top"
        :label-style="{ 'font-weight': 600 }"
        path="inputCheckUpScreeningQuery.proneTest"
      >
        <n-radio-group v-model:value="form.proneTest" name="proneTest" :disabled="unScreenFields.proneTest">
          <n-space>
            <n-radio v-for="item in sourceData.fwsy" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
    </template>

    <template v-else-if="props.code === 'tz_jzjbs'">
      <div class="font-bold text-base m-b-3">脊柱疾病史</div>
      <n-form-item
        :ref="ref => setRef(ref, 'historyDisease')"
        label="疾病史"
        label-placement="top"
        :label-style="{ 'font-weight': 600 }"
        path="inputCheckUpScreeningQuery.historyDisease"
      >
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
    </template>
  </n-card>
</template>
<script setup>
import { computed, reactive, inject } from 'vue';
import { object, string } from 'vue-types';

import { sourceData, spineRelField } from '../input.data';

const emits = defineEmits(['update:data']);
const props = defineProps({
  data: object().def({}),
  code: string().def('')
});

const unScreenFields = inject('unScreenFields');
const form = computed({
  get() {
    return props.data.inputCheckUpScreeningQuery;
  },
  set(val) {
    emits('update:data', { inputCheckUpScreeningQuery: val });
  }
});

const elRefs = reactive({});

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

const setRef = (el, key) => {
  el && (elRefs[key] = el);
};

defineExpose({
  elRefs
});
</script>
