<template>
  <n-card title="视力" size="small" :bordered="false">
    <n-form-item label="检查模式" path="inputCheckUpScreeningQuery.slSource" show-require-mark>
      <n-radio-group
        v-model:value="form.inputCheckUpScreeningQuery.slSource"
        :disabled="unScreenFields.slSource"
        @update:value="changeSlSource"
      >
        <n-space>
          <n-radio v-for="item in checkModeList" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>

    <n-form-item label="视力表类型" path="inputCheckUpScreeningQuery.eyeChartType" show-require-mark>
      <n-radio-group
        v-model:value="form.inputCheckUpScreeningQuery.eyeChartType"
        :disabled="unScreenFields.eyeChartType"
      >
        <n-space>
          <n-radio v-for="item in eyeTypeList" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>

    <n-form-item label="戴镜类型" path="inputCheckUpScreeningQuery.isGlasses" show-require-mark>
      <n-radio-group v-model:value="form.inputCheckUpScreeningQuery.isGlasses" :disabled="unScreenFields.isGlasses">
        <n-space>
          <n-radio v-for="item in wearGlassTypeList" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>

    <n-card title="视力度数" :bordered="false" size="small">
      <n-space class="ml-21 mb-3">
        <div class="w-42">右眼OD</div>
        <div class="w-42">左眼OS</div>
      </n-space>
      <n-form-item
        v-if="[0, 1, 2].includes(form.inputCheckUpScreeningQuery.isGlasses)"
        :ref="ref => setRef(ref, 'vision')"
        label="裸眼视力"
        path="inputCheckUpScreeningQuery.vision"
        :rule="{ trigger: ['blur', 'change'], validator: validateVision }"
      >
        <n-space>
          <div class="w-42">
            <n-select
              v-model:value="form.inputCheckUpScreeningQuery.odVision"
              :disabled="unScreenFields.odVision"
              :options="visionNumList"
              placeholder="请选择右眼裸眼视力"
            />
          </div>
          <div class="w-42">
            <n-select
              v-model:value="form.inputCheckUpScreeningQuery.osVision"
              :disabled="unScreenFields.osVision"
              :options="visionNumList"
              placeholder="请选择左眼裸眼视力"
            />
          </div>
        </n-space>
      </n-form-item>
      <template v-if="[1, 2, 3].includes(form.inputCheckUpScreeningQuery.isGlasses)">
        <n-form-item
          :ref="ref => setRef(ref, 'eyesight')"
          label="戴镜视力"
          path="inputCheckUpScreeningQuery.eyesight"
          :rule="[{ trigger: ['blur', 'change'], validator: validateEyesight }]"
        >
          <n-space>
            <div class="w-42">
              <n-select
                v-model:value="form.inputCheckUpScreeningQuery.odEyesight"
                :disabled="unScreenFields.odEyesight"
                :options="visionNumList"
                placeholder="请选择右眼戴镜视力"
              />
            </div>
            <div class="w-42">
              <n-select
                v-model:value="form.inputCheckUpScreeningQuery.osEyesight"
                :disabled="unScreenFields.osEyesight"
                :options="visionNumList"
                placeholder="请选择左眼戴镜视力"
              />
            </div>
          </n-space>
        </n-form-item>
        <n-form-item
          :ref="ref => setRef(ref, 'glasses')"
          label="戴镜度数"
          path="inputCheckUpScreeningQuery.glasses"
          :rule="{ trigger: ['blur', 'input'], validator: validateGlasses }"
        >
          <n-space>
            <div class="w-42">
              <n-input
                v-model:value="form.inputCheckUpScreeningQuery.odGlasses"
                :disabled="unScreenFields.odGlasses"
                placeholder="输入右眼戴镜度数"
              />
            </div>
            <div class="w-42">
              <n-input
                v-model:value="form.inputCheckUpScreeningQuery.osGlasses"
                :disabled="unScreenFields.osGlasses"
                placeholder="输入左眼戴镜度数"
              />
            </div>
          </n-space>
        </n-form-item>
      </template>

      <n-form-item v-if="showRemark" label="备注">
        <n-space vertical>
          <n-radio-group
            v-model:value="form.inputCheckUpScreeningQuery.remarkType"
            :disabled="unScreenFields.remarkType"
          >
            <n-space>
              <n-radio v-for="item in remarkList" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-space>
      </n-form-item>
      <n-form-item v-if="showRemark" label="备注" :label-style="{ color: 'transparent' }">
        <n-input
          v-model:value="form.inputCheckUpScreeningQuery.remark"
          :disabled="unScreenFields.remark"
          class="!w-346px"
          maxlength="30"
          placeholder="输入备注"
        />
      </n-form-item>
    </n-card>
  </n-card>
</template>

<script setup>
import { computed, reactive, inject } from 'vue';
import { object, bool } from 'vue-types';

import {
  checkModeList,
  eyeChartTypeList,
  eyeChartTypeListSelf,
  wearGlassTypeList,
  visionNumOpt,
  visionNum,
  remarkList
} from '../input.data';

const props = defineProps({
  data: object().def({}),
  disabled: bool().def(false)
});
const emits = defineEmits(['update:data']);

const unScreenFields = inject('unScreenFields');
const elRefs = reactive({});
const setRef = (el, key) => {
  el && (elRefs[key] = el);
};

const form = computed({
  get() {
    return props.data;
  },
  set(value) {
    emits('update:data', value);
  }
});
const showRemark = computed(() => {
  const flag = validateGlasses();
  const flag2 = validateVision();
  const flag3 = validateEyesight();
  const show = flag && flag2 && flag3;
  return !show;
});
const eyeTypeList = computed(() => {
  return form.value.inputCheckUpScreeningQuery.slSource === 1 ? eyeChartTypeListSelf : eyeChartTypeList;
});
const visionNumList = computed(() => {
  return form.value.inputCheckUpScreeningQuery.eyeChartType === 4 ? visionNumOpt : visionNum;
});

const validateVision = formItem => {
  const formData = form.value.inputCheckUpScreeningQuery;
  if (formData.isGlasses !== 3) {
    if (!formData.odVision) {
      return formItem ? true : false;
    } else if (!formData.osVision) {
      return formItem ? true : false;
    }
  }
  return true;
};
const validateEyesight = formItem => {
  const formData = form.value.inputCheckUpScreeningQuery;
  if (formData.isGlasses !== 0) {
    if (!formData.odEyesight) {
      return formItem ? true : false;
    } else if (!formData.osEyesight) {
      return formItem ? true : false;
    }
  }
  return true;
};
const validateGlasses = formItem => {
  const formData = form.value.inputCheckUpScreeningQuery;
  if (formData.isGlasses !== 0) {
    if (!formData.odGlasses) {
      return formItem ? true : false;
    } else {
      if (formData.odGlasses < 25 || formData.odGlasses > 2000 || formData.odGlasses % 25 !== 0) {
        return formItem ? new Error('戴镜度数范围 为25-2000，且必须是25的倍数') : false;
      }
    }
    if (!formData.osGlasses) {
      return formItem ? true : false;
    } else {
      if (formData.osGlasses < 25 || formData.osGlasses > 2000 || formData.osGlasses % 25 !== 0) {
        return formItem ? new Error('戴镜度数范围 为25-2000，且必须是25的倍数') : false;
      }
    }
  }
  return true;
};

function changeSlSource() {
  form.value.inputCheckUpScreeningQuery.eyeChartType = 1;
}

defineExpose({
  elRefs
});
</script>
<style scoped lang="less"></style>
