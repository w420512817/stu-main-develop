<template>
  <n-card title="牙周" :bordered="false">
    <n-form-item
      :ref="ref => setRef(ref, 'healthyGums')"
      label="未见明显异常："
      path="inputCariesScreeningQuery.healthyGums"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.healthyGums"
        :disabled="props.disabled || unScreenFields.healthyGums"
      >
        <n-space>
          <n-radio :value="1"> 是 </n-radio>
          <n-radio :value="0"> 否 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'gingivitis')"
      label="牙龈炎："
      path="inputCariesScreeningQuery.gingivitis"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.gingivitis"
        name="gingivitis"
        :disabled="props.disabled || unScreenFields.gingivitis"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'periodontitis')"
      label="牙周炎："
      path="inputCariesScreeningQuery.periodontitis"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.periodontitis"
        name="periodontitis"
        :disabled="props.disabled || unScreenFields.periodontitis"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'tartar')"
      label="牙结石："
      path="inputCariesScreeningQuery.tartar"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.tartar"
        name="tartar"
        :disabled="props.disabled || unScreenFields.tartar"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'superficialPeriodontalPocket')"
      label="浅牙周袋："
      path="inputCariesScreeningQuery.superficialPeriodontalPocket"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.superficialPeriodontalPocket"
        name="superficialPeriodontalPocket"
        :disabled="props.disabled || unScreenFields.superficialPeriodontalPocket"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'deepPeriodontalPocket')"
      label="深牙周袋："
      path="inputCariesScreeningQuery.deepPeriodontalPocket"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.deepPeriodontalPocket"
        name="deepPeriodontalPocket"
        :disabled="props.disabled || unScreenFields.deepPeriodontalPocket"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'boilingMottledTooth')"
      label="氟斑牙："
      path="inputCariesScreeningQuery.boilingMottledTooth"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.boilingMottledTooth"
        name="boilingMottledTooth"
        :disabled="props.disabled || unScreenFields.boilingMottledTooth"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'malocclusion')"
      label="错颌："
      path="inputCariesScreeningQuery.malocclusion"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.malocclusion"
        name="malocclusion"
        :disabled="props.disabled || unScreenFields.malocclusion"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'enamelHypoplasia')"
      label="牙釉质发育不全："
      path="inputCariesScreeningQuery.enamelHypoplasia"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.enamelHypoplasia"
        name="enamelHypoplasia"
        :disabled="props.disabled || unScreenFields.enamelHypoplasia"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'denture')"
      label="义齿："
      path="inputCariesScreeningQuery.denture"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.denture"
        name="denture"
        :disabled="props.disabled || unScreenFields.denture"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item
      :ref="ref => setRef(ref, 'otherDiseases')"
      label="其他牙病："
      path="inputCariesScreeningQuery.otherDiseases"
      :show-require-mark="props.required === 1"
      :rule="{
        required: props.required === 1,
        message: '请选择',
        trigger: ['blur', 'change'],
        type: 'number'
      }"
    >
      <n-radio-group
        v-model:value="form.inputCariesScreeningQuery.otherDiseases"
        name="otherDiseases"
        :disabled="props.disabled || unScreenFields.otherDiseases"
      >
        <n-space>
          <n-radio :value="0"> 无 </n-radio>
          <n-radio :value="1"> 有 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
  </n-card>
</template>

<script setup>
import { computed, reactive, watch, inject } from 'vue';
import { object, bool, number } from 'vue-types';

const props = defineProps({
  data: object().def({}),
  disabled: bool().def(false),
  required: number().def(null)
});
const emits = defineEmits(['update:data']);

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

function setRadioValue(v) {
  const arr = Object.keys(elRefs);
  arr.splice(arr.indexOf('healthyGums'), 1);
  if (v == 1) {
    arr.forEach(item => {
      form.value.inputCariesScreeningQuery[item] = 0;
      elRefs[item].validate();
    });
  }
}

watch(
  () => form.value.inputCariesScreeningQuery.healthyGums,
  val => {
    setRadioValue(val);
  }
);

defineExpose({
  elRefs
});
</script>

<style scoped></style>
