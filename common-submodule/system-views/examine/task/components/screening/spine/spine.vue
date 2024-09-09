<template>
  <n-card title="正脊" size="small" :bordered="false">
    <n-card title="脊柱侧弯" :bordered="false" size="small">
      <n-form-item :ref="ref => setRef(ref, 'bendGeneralInspection')" label="一般检查">
        <n-checkbox-group
          v-model:value="form.bendGeneralInspection"
          name="bendGeneralInspection"
          @update:value="(_, op) => changeHis(op.value, 'bendGeneralInspection')"
        >
          <n-space>
            <n-checkbox v-for="item in sourceData.ybjc" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-checkbox>
          </n-space>
        </n-checkbox-group>
      </n-form-item>
      <n-form-item :ref="ref => setRef(ref, 'anteriorFlexionThoracic')" label="前屈试验-胸段">
        <n-radio-group v-model:value="form.anteriorFlexionThoracic" name="anteriorFlexionThoracic">
          <n-space>
            <n-radio v-for="item in sourceData.qqxd" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item :ref="ref => setRef(ref, 'anteriorFlexionWaistChest')" label="前屈试验-腰胸段">
        <n-radio-group v-model:value="form.anteriorFlexionWaistChest" name="anteriorFlexionWaistChest">
          <n-space>
            <n-radio v-for="item in sourceData.qqyxd" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item :ref="ref => setRef(ref, 'anteriorLumbarFlexion')" label="前屈试验-腰段">
        <n-radio-group v-model:value="form.anteriorLumbarFlexion" name="anteriorLumbarFlexion">
          <n-space>
            <n-radio v-for="item in sourceData.qqyd" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <template v-if="showQugan">
        <div class="font-bold text-base m-b-3">躯干旋转测量仪检查</div>
        <n-form-item :ref="ref => setRef(ref, 'thoracicSegmentAtr')" label="胸段ATR" path="thoracicSegmentAtr">
          <n-radio-group v-model:value="form.thoracicSegmentAtr" name="thoracicSegmentAtr">
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
          path="thoracolumbarSegmentAtr"
        >
          <n-radio-group v-model:value="form.thoracolumbarSegmentAtr" name="thoracolumbarSegmentAtr">
            <n-space>
              <n-radio v-for="item in sourceData.yxdATR" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item :ref="ref => setRef(ref, 'lumbarSegmentAtr')" label="腰段ATR" path="lumbarSegmentAtr">
          <n-radio-group v-model:value="form.lumbarSegmentAtr" name="lumbarSegmentAtr">
            <n-space>
              <n-radio v-for="item in sourceData.ydATR" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
      </template>
    </n-card>
    <n-card title="脊柱前后弯曲" :bordered="false" size="small">
      <n-form-item :ref="ref => setRef(ref, 'bfBendGeneralInspection')" label="一般检查">
        <n-radio-group v-model:value="form.bfBendGeneralInspection" name="bfBendGeneralInspection">
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
        path="proneTest"
      >
        <n-radio-group v-model:value="form.proneTest" name="proneTest">
          <n-space>
            <n-radio v-for="item in sourceData.fwsy" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
    </n-card>
    <n-card title="疾病史" :bordered="false" size="small">
      <n-form-item :ref="ref => setRef(ref, 'historyDisease')" label="疾病史" :show-label="false">
        <n-checkbox-group
          v-model:value="form.historyDisease"
          name="historyDisease"
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
  </n-card>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { object } from 'vue-types';
import { sourceData, spineRelField } from '../input.data';

const props = defineProps({
  data: object().def({})
});

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
