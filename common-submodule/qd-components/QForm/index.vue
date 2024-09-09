<template>
  <n-form ref="formRef" label-placement="left" :model="formData" label-width="auto" v-bind="$attrs">
    <div class="flex flex-col w-100%">
      <n-grid v-if="config.layout" :x-gap="config.layout.gap" v-bind="config.layout">
        <template v-for="{ element, item, type, slot } in getColumns(config.columns)" :key="item.key">
          <n-gi v-if="type === 'custom'" :span="item?.span" :offset="item.offset">
            <slot :name="slot"></slot>
          </n-gi>
          <n-gi v-else :span="item?.span" :offset="item.offset">
            <n-form-item v-bind="item" require-mark-placement="left">
              <component
                :is="componentsTypes[type]"
                :value="getKeys(item.path)"
                :item="element"
                @update:value="e => handleChange(e, item)"
              />
            </n-form-item>
          </n-gi>
        </template>
      </n-grid>

      <!-- 不使用grid布局 -->
      <template v-else>
        <div v-for="({ element, item, type, slot }, index) in config.columns" :key="index">
          <slot v-if="type === 'custom'" :name="slot"></slot>
          <n-form-item v-else v-bind="item">
            <component
              :is="componentsTypes[type]"
              :value="getKeys(item.path)"
              :item="element"
              @update:value="e => handleChange(e, item)"
            />
          </n-form-item>
        </div>
      </template>

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

const emit = defineEmits(['update:formValue', 'change']);

const props = defineProps({
  config: object().def(() => {}),
  inline: bool().def(false),
  formValue: object().def(() => {})
});
const formRef = ref();
const formData = ref({ ...props.formValue });
// const config = ref({ ...props.config });

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

const getKeys = computed(() => {
  return function (path) {
    const pathArr = path.split('.');
    const value = pathArr.reduce((pre, next) => {
      return pre[next];
    }, formData.value);
    return value;
  };
});

const getColumns = computed(() => {
  return function (columns) {
    return columns.filter(item => {
      return !item.hidden;
    });
  };
});

const validate = callback => {
  formRef.value.validate(err => {
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
  }, formData.value);
  // 数据改变之后就传输给外边
  console.log(item, 'item888');
  console.log(formData.value, 'formData.valuechange');
  emit('update:formValue', formData.value);
  emit('change', item.path, formData.value);
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

// watch(
//   formData.value,
//   () => {
//     console.log('数据改变', formData.value);
//     emit('update:formValue', formData.value);
//   },
//   { immediate: true }
// );

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
