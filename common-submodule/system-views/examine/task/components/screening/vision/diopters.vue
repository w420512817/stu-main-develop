<template>
  <n-card title="屈光" size="small" :bordered="false">
    <n-card title="球镜、柱镜、轴位" :bordered="false" size="small">
      <n-space class="ml-21 mb-3">
        <div class="w-42">右眼OD</div>
        <div class="w-42">左眼OS</div>
      </n-space>

      <n-form-item
        :ref="ref => setRef(ref, 'sph')"
        label="球镜S"
        path="inputEyesScreeningQuery.sph"
        show-require-mark
        :rule="{ required: true, trigger: ['blur', 'input'], validator: validateSph }"
      >
        <n-space>
          <div class="w-42">
            <n-input
              v-model:value="form.inputEyesScreeningQuery.dpOdSph"
              :disabled="unScreenFields.dpOdSph"
              placeholder="输入右眼球镜S"
              @blur="validateToNum('dpOdSph')"
            />
          </div>
          <div class="w-42">
            <n-input
              v-model:value="form.inputEyesScreeningQuery.dpOsSph"
              :disabled="unScreenFields.dpOsSph"
              placeholder="输入左眼球镜S"
              @blur="validateToNum('dpOsSph')"
            />
          </div>
        </n-space>
      </n-form-item>
      <n-form-item
        :ref="ref => setRef(ref, 'cyl')"
        label="柱镜C"
        show-require-mark
        path="inputEyesScreeningQuery.cyl"
        :rule="{ required: true, trigger: ['blur', 'input'], validator: validateCyl }"
      >
        <n-space>
          <div class="w-42">
            <n-input
              v-model:value="form.inputEyesScreeningQuery.dpOdCyl"
              :disabled="unScreenFields.dpOdCyl"
              placeholder="输入右眼柱镜C"
              @blur="validateToNum('dpOdCyl')"
            />
          </div>
          <div class="w-42">
            <n-input
              v-model:value="form.inputEyesScreeningQuery.dpOsCyl"
              :disabled="unScreenFields.dpOsCyl"
              placeholder="输入左眼柱镜C"
              @blur="validateToNum('dpOsCyl')"
            />
          </div>
        </n-space>
      </n-form-item>
      <n-form-item
        :ref="ref => setRef(ref, 'axial')"
        label="轴位A"
        path="inputEyesScreeningQuery.axial"
        :rule="{ required: true, trigger: ['blur', 'input'], validator: validateAxial }"
        show-require-mark
      >
        <n-space>
          <div class="w-42">
            <n-input
              v-model:value="form.inputEyesScreeningQuery.dpOdAxial"
              :disabled="unScreenFields.dpOdAxial"
              placeholder="输入右眼轴位A"
            />
          </div>
          <div class="w-42">
            <n-input
              v-model:value="form.inputEyesScreeningQuery.dpOsAxial"
              :disabled="unScreenFields.dpOsAxial"
              placeholder="输入左眼轴位A"
            />
          </div>
        </n-space>
      </n-form-item>
      <n-form-item v-if="showRemark" label="备注">
        <n-space vertical>
          <n-radio-group
            v-model:value="form.inputEyesScreeningQuery.dpRemarkType"
            :disabled="unScreenFields.dpRemarkType"
          >
            <n-space>
              <n-radio v-for="item in remarkList" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
          <!-- <n-input
            v-if="form.dpRemarkType === 4"
            v-model:value="form.inputEyesScreeningQuery.dpRemark"
            maxlength="30"
            placeholder="输入其他备注"
          /> -->
        </n-space>
      </n-form-item>
      <n-form-item v-if="showRemark" label=" ">
        <n-input
          v-model:value="form.inputEyesScreeningQuery.dpRemark"
          class="!w-346px"
          maxlength="30"
          placeholder="无检查数据时必填备注，否则视为未筛查"
          :disabled="unScreenFields.dpRemark"
        />
      </n-form-item>
    </n-card>
    <n-card title="角膜曲率" :bordered="false" size="small">
      <n-space class="ml-21 mb-3">
        <div class="w-42">右眼OD</div>
        <div class="w-42">左眼OS</div>
      </n-space>
      <n-form-item
        :ref="ref => setRef(ref, 'r1')"
        label="R1"
        path="inputEyesScreeningQuery.r1"
        :rule="{ trigger: ['blur', 'input'], validator: validateR1 }"
      >
        <n-space vertical>
          <n-space>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.orbRightR1Mm"
                :disabled="unScreenFields.orbRightR1Mm"
                placeholder="输入右眼R1"
              >
                <template #suffix> mm </template>
              </n-input>
            </div>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.orbLeftR1Mm"
                :disabled="unScreenFields.orbLeftR1Mm"
                placeholder="输入左眼R1"
              >
                <template #suffix> mm </template>
              </n-input>
            </div>
          </n-space>
          <n-space>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.orbRightR1D"
                :disabled="unScreenFields.orbRightR1D"
                placeholder="输入右眼"
              >
                <template #suffix> D </template>
              </n-input>
            </div>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.orbLeftR1D"
                :disabled="unScreenFields.orbLeftR1D"
                placeholder="输入左眼"
              >
                <template #suffix> D </template>
              </n-input>
            </div>
          </n-space>
        </n-space>
      </n-form-item>
      <n-form-item
        :ref="ref => setRef(ref, 'r2')"
        label="R2"
        path="inputEyesScreeningQuery.r2"
        :rule="{ trigger: ['blur', 'input'], validator: validateR2 }"
      >
        <n-space vertical>
          <n-space>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.orbRightR2Mm"
                :disabled="unScreenFields.orbRightR2Mm"
                placeholder="输入右眼R2"
              >
                <template #suffix> mm </template>
              </n-input>
            </div>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.orbLeftR2Mm"
                :disabled="unScreenFields.orbLeftR2Mm"
                placeholder="输入左眼R2"
              >
                <template #suffix> mm </template>
              </n-input>
            </div>
          </n-space>
          <n-space>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.orbRightR2D"
                :disabled="unScreenFields.orbRightR2D"
                placeholder="输入右眼"
              >
                <template #suffix> D </template>
              </n-input>
            </div>
            <div class="w-42">
              <n-input
                v-model:value="form.inputEyesScreeningQuery.orbLeftR2D"
                :disabled="unScreenFields.orbLeftR2D"
                placeholder="输入左眼"
              >
                <template #suffix> D </template>
              </n-input>
            </div>
          </n-space>
        </n-space>
      </n-form-item>

      <n-form-item
        :ref="ref => setRef(ref, 'ax')"
        label="AX"
        path="inputEyesScreeningQuery.ax"
        :rule="{ trigger: ['blur', 'input'], validator: validateAx }"
      >
        <n-space>
          <div class="w-42">
            <n-input
              v-model:value="form.inputEyesScreeningQuery.orbRightAx"
              :disabled="unScreenFields.orbRightAx"
              placeholder="输入右眼AX"
            />
          </div>
          <div class="w-42">
            <n-input
              v-model:value="form.inputEyesScreeningQuery.orbLeftAx"
              :disabled="unScreenFields.orbLeftAx"
              placeholder="输入左眼AX"
            />
          </div>
        </n-space>
      </n-form-item>
    </n-card>
  </n-card>
</template>

<script setup>
import { computed, reactive, inject, watch } from 'vue';
import { object } from 'vue-types';

import { remarkList } from '../input.data';

const props = defineProps({
  data: object().def({})
});

const unScreenFields = inject('unScreenFields');
const allField = [
  'dpOdSph',
  'dpOsSph',
  'dpOdCyl',
  'dpOsCyl',
  'dpOdAxial',
  'dpOsAxial',
  'orbRightR1Mm',
  'orbLeftR1Mm',
  'orbRightR1D',
  'orbLeftR1D',
  'orbRightR2Mm',
  'orbLeftR2Mm',
  'orbRightR2D',
  'orbLeftR2D',
  'orbRightAx',
  'orbLeftAx'
];
const elRefs = reactive({});
const emits = defineEmits(['update:data']);
const form = computed({
  get() {
    return props.data;
  },
  set(value) {
    emits('update:data', value);
  }
});
// const showRemark = computed(() => {
//   const flag = validateSph();
//   const flag2 = validateCyl();
//   const flag3 = validateAxial();
//   const show = flag && flag2 && flag3;
//   return !show;
// });
const showRemark = computed(() => {
  let data = form.value.inputEyesScreeningQuery;
  return allField.every(key => !data[key]);
});

const setRef = (el, key) => {
  el && (elRefs[key] = el);
};

const validateToNum = key => {
  const formData = form.value.inputEyesScreeningQuery;
  if (formData[key]) {
    let val = Number(formData[key]).toFixed(2);
    if (val > 0) {
      formData[key] = '+' + val;
    } else {
      formData[key] = String(val);
    }
  }
};

const testMirrorFn = val => {
  val = Number(val);
  const flag = val < -20.0 || val > 20.0 || (val * 100) % 25 !== 0;
  return flag;
};

const validateSph = formItem => {
  const formData = form.value.inputEyesScreeningQuery;
  if (!formData.dpOdSph) {
    return formItem ? (formData.dpRemarkType == null ? new Error('请输入右眼球镜') : true) : false;
  } else {
    if (testMirrorFn(formData.dpOdSph)) {
      return formItem ? new Error('右眼球镜范围为 -20.00 - 20.00，且必须是0.25的倍数') : false;
    }
  }
  if (!formData.dpOsSph) {
    return formItem ? (formData.dpRemarkType == null ? new Error('请输入左眼球镜') : true) : false;
  } else {
    if (testMirrorFn(formData.dpOsSph)) {
      return formItem ? new Error('左眼球镜范围为 -20.00 - 20.00，且必须是0.25的倍数') : false;
    }
  }
  return true;
};
const testCylFn = val => {
  val = Number(val);
  return val < -20.0 || val > 0 || (val * 100) % 25 !== 0;
};
const validateCyl = formItem => {
  const formData = form.value.inputEyesScreeningQuery;
  if (!formData.dpOdCyl) {
    return formItem ? (formData.dpRemarkType == null ? new Error('请输入右眼柱镜') : true) : false;
  } else {
    if (testCylFn(formData.dpOdCyl)) {
      return formItem ? new Error('右眼柱镜范围为 -20.00 - 0，且必须是0.25的倍数') : false;
    }
  }
  if (!formData.dpOsCyl) {
    return formItem ? (formData.dpRemarkType == null ? new Error('请输入左眼柱镜') : true) : false;
  } else {
    if (testCylFn(formData.dpOsCyl)) {
      return formItem ? new Error('左眼柱镜范围为 -20.00 - 0，且必须是0.25的倍数') : false;
    }
  }
  return true;
};
const validateAxial = formItem => {
  const formData = form.value.inputEyesScreeningQuery;
  if (!formData.dpOdAxial) {
    return formItem ? (formData.dpRemarkType == null ? new Error('请输入右眼轴位') : true) : false;
  } else {
    if (!/^[1-9]\d*$|^0$/.test(formData.dpOdAxial) || formData.dpOdAxial > 180) {
      return formItem ? new Error('右眼轴位范围为 0 - 180') : false;
    }
  }
  if (!formData.dpOsAxial) {
    return formItem ? (formData.dpRemarkType == null ? new Error('请输入左眼轴位') : true) : false;
  } else {
    if (!/^[1-9]\d*$|^0$/.test(formData.dpOsAxial) || formData.dpOsAxial > 180) {
      return formItem ? new Error('左眼轴位范围为 0 - 180') : false;
    }
  }
  return true;
};
const testCorneaFn = val => {
  return val && !/^[1-9]\d*$|^0$/.test(val);
};
const validateR1 = () => {
  const formData = form.value.inputEyesScreeningQuery;
  if (
    testCorneaFn(formData.orbRightR1Mm) ||
    testCorneaFn(formData.orbLeftR1Mm) ||
    testCorneaFn(formData.orbRightR1D) ||
    testCorneaFn(formData.orbLeftR1D)
  ) {
    return new Error(`请输入整数`);
  }
  return true;
};
const validateR2 = () => {
  const formData = form.value.inputEyesScreeningQuery;
  if (
    testCorneaFn(formData.orbRightR2Mm) ||
    testCorneaFn(formData.orbLeftR2Mm) ||
    testCorneaFn(formData.orbRightR2D) ||
    testCorneaFn(formData.orbLeftR2D)
  ) {
    return new Error(`请输入整数`);
  }
  return true;
};
const validateAx = () => {
  const formData = form.value.inputEyesScreeningQuery;
  if (testCorneaFn(formData.orbRightAx) || testCorneaFn(formData.orbLeftAx)) {
    return new Error(`请输入整数`);
  }
  return true;
};

// 表单的值有变化 需清除备注的值
watch(
  allField.map(key => () => form.value.inputEyesScreeningQuery[key]),
  v => {
    if (v.some(v => v)) {
      form.value.inputEyesScreeningQuery.dpRemarkType = null;
      form.value.inputEyesScreeningQuery.dpRemark = null;
    }
  }
);

defineExpose({
  elRefs
});
</script>
<style scoped lang="less"></style>
