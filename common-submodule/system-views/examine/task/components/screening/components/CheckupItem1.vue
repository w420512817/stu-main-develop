<template>
  <n-card :bordered="false" size="small">
    <n-form-item
      v-for="(item, index) in state.formItemConfig"
      :key="index"
      :ref="el => setRef(el, item.key)"
      :label="item.title"
      label-placement="top"
      :label-style="{ 'font-weight': 600 }"
      :path="`inputCheckUpScreeningQuery.${item.key}`"
      :rule="{
        required: false,
        message: `请选择`,
        trigger: ['blur', item.type == 1 ? 'input' : 'change'],
        type: item.type == 1 ? 'string' : item.type == 3 ? 'array' : 'number'
      }"
    >
      <n-input
        v-if="item.type == 1"
        v-model:value="form.inputCheckUpScreeningQuery[item.key]"
        class="!w-300px"
        placeholder="请输入"
        :disabled="unScreenFields[item.key]"
      >
        <template #suffix>{{ item.suffix }}</template>
      </n-input>
      <n-radio-group
        v-if="item.type == 2"
        v-model:value="form.inputCheckUpScreeningQuery[item.key]"
        :disabled="unScreenFields[item.key]"
      >
        <n-space>
          <n-radio v-for="subItem in item.options" :key="subItem.value" :value="subItem.value">
            {{ subItem.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
      <n-checkbox-group
        v-if="item.type == 3"
        v-model:value="form.inputCheckUpScreeningQuery[item.key]"
        :disabled="unScreenFields[item.key]"
        @update:value="(val, option) => updateCheckbox(val, option, item.key, item.options)"
      >
        <n-space item-style="display: flex;">
          <n-checkbox
            v-for="subItem in item.options"
            :key="subItem.value"
            :value="subItem.value"
            :label="subItem.label"
          />
        </n-space>
      </n-checkbox-group>
      <n-input-number
        v-if="item.type == 4"
        v-model:value="form.inputCheckUpScreeningQuery[item.key]"
        w-300px
        :placeholder="`请输入${item.message}`"
        :min="item.min"
        :max="item.max"
        :precision="item.precision"
        :show-button="false"
        :disabled="unScreenFields[item.key]"
      >
        <template #suffix>{{ item.suffix }}</template>
      </n-input-number>
    </n-form-item>
  </n-card>
</template>

<script setup>
import { computed, reactive, inject } from 'vue';
import { object, string, number } from 'vue-types';
import { examCheckupItems } from '../input.data.jsx';

const emits = defineEmits(['update:data']);
const props = defineProps({
  data: object().def({}),
  code: string().def(''),
  required: number().def(1)
});

const unScreenFields = inject('unScreenFields');
const elRefs = reactive({});
const state = computed(() => {
  const obj = examCheckupItems.find(d => d.code == props.code) ?? {};
  return obj;
});

const form = computed({
  get() {
    return props.data;
  },
  set(value) {
    emits('update:data', value);
  }
});
const setRef = (el, key) => {
  el && (elRefs[key] = el);
};
const updateCheckbox = (a, option, key, list) => {
  if (option.actionType == 'check') {
    const item = list.find(d => d.value == option.value);
    const isExclusive = !!item.exclusive;

    if (isExclusive) {
      form.value.inputCheckUpScreeningQuery[key] = [option.value];
    } else {
      const groups = list.filter(d => item.group && item.group == d.group && d.value != option.value).map(d => d.value);
      const exlsives = list.filter(d => !!d.exclusive).map(d => d.value);

      form.value.inputCheckUpScreeningQuery[key] = form.value.inputCheckUpScreeningQuery[key].filter(
        d => !groups.includes(d) && !exlsives.includes(d)
      );
    }
  }
};

defineExpose({
  elRefs
});
</script>
