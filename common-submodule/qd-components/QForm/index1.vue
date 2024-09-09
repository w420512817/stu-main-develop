<template>
  <!-- {{ formData }} -->

  <n-form ref="formRef" :inline="inline" label-placement="left" label-width="auto" :model="formData" :rules="rules">
    <div class="flex flex-col">
      <n-grid v-if="config.layout" :x-gap="config.layout.gap" :cols="config.layout.cols">
        <!-- TODO:暂时使用index之后考虑key -->
        <template v-for="({ element, item, type, slot }, index) in config.columns" :key="index">
          <n-gi v-if="type === 'custom'" :span="item?.span">
            <slot :name="slot"></slot>
          </n-gi>
          <n-gi v-else :span="item?.span">
            <n-form-item v-bind="item">
              <!-- :label="item.label"
              :path="item.path"
              :label-width="item['label-width']"
              :show-require-mark="item['show-require-mark']"
              require-mark-placement="left"
              :rules="item.rules" -->
              <!-- {{ item.path }}
              {{ formData[item.path] }} -->
              <!-- <n-input :value="getKeys(item.path)" :placeholder="item.placeholder" @input="e => handleChange(e, item)"> -->
              <!-- <n-input v-model:value="formData[item.path]" :placeholder="item.placeholder">
              <template v-if="item.prefix" #prefix> {{ item.prefix }} </template>
              <template v-if="item.suffix" #suffix> {{ item.suffix }} </template>
            </n-input> -->
              <!-- {{ formData[item.path] }} -->
              <!-- <component :is="componentsTypes[type]" v-model:value="formData[item.path]" :item="element" /> -->
              <component
                :is="componentsTypes[type]"
                :value="getKeys(item.path)"
                :item="element"
                @update:value="e => handleChange(e, item)"
              />
            </n-form-item>
            <!-- <n-form-item
            v-if="item.type === 'select'"
            :label="item.label"
            :path="item.path"
            :show-require-mark="item['show-require-mark']"
            require-mark-placement="left"
          >
            <n-select
              v-model:value="formData[item.path]"
              :label-field="item['label-field']"
              :value-field="item['value-field']"
              :placeholder="item.placeholder"
              :options="item.options"
            />
          </n-form-item> -->
            <!-- <n-form-item
            v-if="item.type === 'dropSelect'"
            :label="item.label"
            :path="item.path"
            :show-require-mark="true"
            require-mark-placement="left"
          >
            <drop-select
              ref="floorRef"
              v-model:value="formValue.floorId"
              :list-api="formValue.id ? FloorDropSelectBox : selectBoxByBuildId"
              :params="{ schoolId: formValue.schoolId, buildingId: formValue.buildingId }"
              keyword="name"
              label-field="name"
              value-field="id"
              filterable
              clearable
              placeholder="请选择楼层"
              @update:value="updateFloor"
            />
          </n-form-item> -->
          </n-gi>
        </template>
      </n-grid>
      <slot></slot>
    </div>

    <!-- <n-button @click="handelClick">验证</n-button> -->
  </n-form>
</template>

<script setup>
// https://www.jianshu.com/p/de7036b4fce5
import { object, bool } from 'vue-types';
import { ref, computed, watch, onMounted } from 'vue';
import QInput from './components/Input.vue';
import QInputNumber from './components/InputNumber.vue';
import QSelect from './components/Select.vue';
import DropSelect from './components/DropSelectAttr.vue';
import QDataPicker from './components/DataPicker.vue';
import QSwitch from './components/Switch.vue';
import QCheckBoxGroup from './components/CheckBoxGroup.vue';
import QRadioGroup from './components/RadioGroup.vue';
import QSlider from './components/Slider.vue';
import QTransfer from './components/Transfer.vue';
import QAutoComplete from './components/AutoComplete.vue';
import QTreeSelect from './components/TreeSelect.vue';
import QCascader from './components/Cascader.vue';
import QTimePicker from './components/TimePicker.vue';
import QColorPicker from './components/ColorPicker.vue';

const emit = defineEmits(['update:formValue']);

const props = defineProps({
  config: object().def(() => {}),
  inline: bool().def(false),
  formValue: object().def(() => {}),
  rules: object().def(() => {})
});
const formRef = ref();
const formData = ref({ ...props.formValue });

const componentsTypes = {
  input: QInput,
  select: QSelect,
  dropSelect: DropSelect,
  dataPicker: QDataPicker,
  switch: QSwitch,
  checkBoxGroup: QCheckBoxGroup,
  radioGroup: QRadioGroup,
  inputNumber: QInputNumber,
  slider: QSlider,
  transfer: QTransfer,
  autoComplete: QAutoComplete,
  treeSelect: QTreeSelect,
  cascader: QCascader,
  timePicker: QTimePicker,
  colorPicker: QColorPicker
};

// console.log(props, 'props');

const getKeys = computed(() => {
  return function (path) {
    // console.log(formData.value, 'formData');
    // console.log(path, 'path');
    // console.log(formData.value[path]);
    const pathArr = path.split('.');
    // console.log(pathArr, path, 'aapath');
    const value = pathArr.reduce((pre, next) => {
      return pre[next];
    }, formData.value);
    // console.log(value, 'value888');
    return value;
  };
});

const validate = callback => {
  formRef.value.validate(err => {
    console.log(err, 'err');
    callback(err);
  });
};

const handleChange = (e, item) => {
  // console.log('数据改变');
  const pathArr = item.path.split('.');
  pathArr.reduce((pre, next, index) => {
    // 如果下标小于数组长度就返回，如果等于就取值
    if (index < pathArr.length - 1) {
      return pre[next];
    }
    pre[next] = e;
    // return pre[next];
  }, formData.value);
  // 数据改变之后就传输给外边

  console.log(formData.value, 'formData.valuechange');
};

onMounted(() => {
  console.log(props.formValue, 'formValueonMounted');
});

// watchEffect(() => {
//   console.log(props.formValue, 'formValue数据改变');
//   // const formData = ref({ ...props.formValue });
//   formData.value = { ...props.formValue };
// });

watch(
  props.formValue,
  () => {
    console.log(props.formValue, 'formValue数据改变');
    // const formData = ref({ ...props.formValue });
    // 这块要直接赋值 不能解构复制
    formData.value = props.formValue;
  },
  { immediate: true }
);

watch(
  formData.value,
  () => {
    console.log('数据改变', formData.value);
    emit('update:formValue', formData.value);
  },
  { immediate: true }
);

// const handelClick = () => {
//   // console.log(props.formRef, 'formRef');
//   // console.log(props.formref, 'formRef');
//   console.log(formRef.value, 'formRef');
//   console.log(formData.value, 'formData.value');
//   // formRef.value.validate(res => {
//   //   console.log(res, '校验');
//   // });
// };

defineExpose({ validate });
</script>

<style lang="scss" scoped></style>
