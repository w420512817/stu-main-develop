<template>
  <n-card title="视力" size="small" :bordered="false">
    <n-form-item
      label="检查模式"
      path="inputEyesScreeningQuery.slSource"
      :rule="{ required: true, message: '请选择检查模式' }"
    >
      <n-radio-group v-model:value="form.inputEyesScreeningQuery.slSource" :disabled="unScreenFields.slSource">
        <n-space>
          <n-radio v-for="item in checkModeList" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>

    <n-form-item
      label="视力表类型"
      path="inputEyesScreeningQuery.eyeChartType"
      :rule="{ required: true, message: '请选择视力表类型' }"
    >
      <n-radio-group v-model:value="form.inputEyesScreeningQuery.eyeChartType" :disabled="unScreenFields.eyeChartType">
        <n-space>
          <n-radio v-for="item in eyeTypeList" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>

    <n-form-item
      label="戴镜类型"
      path="inputEyesScreeningQuery.isGlasses"
      :rule="{ required: true, message: '请选择戴镜类型' }"
    >
      <n-radio-group
        v-model:value="form.inputEyesScreeningQuery.isGlasses"
        :disabled="unScreenFields.isGlasses"
        @update:value="handleGlassesChange"
      >
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
        v-if="[0, 1, 2].includes(form.inputEyesScreeningQuery.isGlasses)"
        :ref="ref => setRef(ref, 'vision')"
        label="裸眼视力"
        path="inputEyesScreeningQuery.vision"
        show-require-mark
        :rule="{ required: true, trigger: ['blur', 'change'], validator: validateVision }"
      >
        <n-space>
          <div class="w-42">
            <n-select
              v-model:value="form.inputEyesScreeningQuery.odVision"
              :options="visionNumList"
              placeholder="请选择右眼裸眼视力"
              :disabled="unScreenFields.odVision"
              clearable
            />
          </div>
          <div class="w-42">
            <n-select
              v-model:value="form.inputEyesScreeningQuery.osVision"
              :options="visionNumList"
              placeholder="请选择左眼裸眼视力"
              :disabled="unScreenFields.osVision"
              clearable
            />
          </div>
        </n-space>
      </n-form-item>
      <template v-if="[1, 2, 3].includes(form.inputEyesScreeningQuery.isGlasses)">
        <n-form-item
          :ref="ref => setRef(ref, 'eyesight')"
          label="戴镜视力"
          path="inputEyesScreeningQuery.eyesight"
          show-require-mark
          :rule="[{ required: true, trigger: ['blur', 'change'], validator: validateEyesight }]"
        >
          <n-space>
            <div class="w-42">
              <n-select
                v-model:value="form.inputEyesScreeningQuery.odEyesight"
                :options="visionNumList"
                placeholder="请选择右眼戴镜视力"
                :disabled="unScreenFields.odEyesight"
                clearable
              />
            </div>
            <div class="w-42">
              <n-select
                v-model:value="form.inputEyesScreeningQuery.osEyesight"
                :options="visionNumList"
                placeholder="请选择左眼戴镜视力"
                :disabled="unScreenFields.osEyesight"
                clearable
              />
            </div>
          </n-space>
        </n-form-item>
        <n-form-item
          :ref="ref => setRef(ref, 'glasses')"
          label="戴镜度数"
          path="inputEyesScreeningQuery.glasses"
          :rule="{ required: true, trigger: ['blur', 'input'], validator: validateGlasses }"
        >
          <n-space>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.odGlasses"
                :disabled="unScreenFields.odGlasses"
                placeholder="输入右眼戴镜度数"
                clearable
              />
            </div>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.osGlasses"
                :disabled="unScreenFields.osGlasses"
                placeholder="输入左眼戴镜度数"
                clearable
              />
            </div>
          </n-space>
        </n-form-item>
      </template>
      <template v-if="showRemark">
        <n-form-item label="备注">
          <n-space vertical>
            <n-radio-group
              v-model:value="form.inputEyesScreeningQuery.remarkType"
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
        <n-form-item label=" ">
          <n-input
            v-model:value="form.inputEyesScreeningQuery.remark"
            class="!w-346px"
            maxlength="30"
            placeholder="无检查数据时必填备注，否则视为未筛查"
            :disabled="unScreenFields.remark"
          />
        </n-form-item>
      </template>
    </n-card>
  </n-card>
</template>

<script setup>
import { computed, watch, reactive, inject } from 'vue';
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

const unScreenFields = inject('unScreenFields');
const emits = defineEmits(['update:data']);
const allField = ['odVision', 'osVision', 'odEyesight', 'osEyesight', 'odGlasses', 'osGlasses'];
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
// const showRemark = computed(() => {
//   const flag = validateGlasses();
//   const flag2 = validateVision();
//   const flag3 = validateEyesight();
//   const show = flag && flag2 && flag3;
//   return !show;
// });

const showRemark = computed(() => {
  let data = form.value.inputEyesScreeningQuery;
  return allField.every(key => !data[key]);
});

const eyeTypeList = computed(() => {
  return form.value.inputEyesScreeningQuery.slSource === 1 ? eyeChartTypeListSelf : eyeChartTypeList;
});
const visionNumList = computed(() => {
  return form.value.inputEyesScreeningQuery.eyeChartType === 4 ? visionNumOpt : visionNum;
});

const handleGlassesChange = () => {
  const resetType = {
    odVision: null,
    osVision: null,
    odEyesight: null,
    osEyesight: null,
    odGlasses: null,
    osGlasses: null,
    remarkType: null,
    remark: null
  };
  Object.assign(form.value.inputEyesScreeningQuery, resetType);
};

const validateVision = formItem => {
  const formData = form.value.inputEyesScreeningQuery;
  if (formData.isGlasses !== 3) {
    if (!formData.odVision) {
      return formItem ? (formData.remarkType == null ? new Error('请选择右眼裸眼视力') : true) : false;
    } else if (!formData.osVision) {
      return formItem ? (formData.remarkType == null ? new Error('请选择左眼裸眼视力') : true) : false;
    }
  }
  return true;
};
const validateEyesight = formItem => {
  const formData = form.value.inputEyesScreeningQuery;
  if (formData.isGlasses !== 0) {
    if (!formData.odEyesight) {
      return formItem ? (formData.remarkType == null ? new Error('请选择右眼戴镜视力') : true) : false;
    } else if (!formData.osEyesight) {
      return formItem ? (formData.remarkType == null ? new Error('请选择左眼戴镜视力') : true) : false;
    }
  }
  return true;
};
const validateGlasses = formItem => {
  const formData = form.value.inputEyesScreeningQuery;
  if (formData.isGlasses !== 0) {
    if (!formData.odGlasses) {
      return formItem ? (formData.remarkType == null ? new Error('请输入右眼戴镜度数') : true) : false;
    } else {
      if (formData.odGlasses < 25 || formData.odGlasses > 2000 || formData.odGlasses % 25 !== 0) {
        return formItem ? new Error('戴镜度数范围 为25-2000，且必须是25的倍数') : false;
      }
    }
    if (!formData.osGlasses) {
      return formItem ? (formData.remarkType == null ? new Error('请输入左眼戴镜度数') : true) : false;
    } else {
      if (formData.osGlasses < 25 || formData.osGlasses > 2000 || formData.osGlasses % 25 !== 0) {
        return formItem ? new Error('戴镜度数范围 为25-2000，且必须是25的倍数') : false;
      }
    }
  }
  return true;
};

watch(
  () => form.value.inputEyesScreeningQuery.slSource,
  () => {
    form.value.inputEyesScreeningQuery.eyeChartType = 1;
  }
);

// 表单的值有变化 需清除备注的值
watch(
  allField.map(key => () => form.value.inputEyesScreeningQuery[key]),
  v => {
    if (v.some(v => v)) {
      form.value.inputEyesScreeningQuery.remarkType = null;
      form.value.inputEyesScreeningQuery.remark = null;
    }
  }
);

defineExpose({
  elRefs
});
</script>
<style scoped lang="less"></style>
