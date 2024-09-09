<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    class="w-600px"
    title="脱敏设置"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="脱敏状态:" path="radioVal">
          <n-radio-group v-model:value="formValue.radioVal" @update:value="updateRadio">
            <n-space>
              <n-radio :value="false">关闭</n-radio>
              <n-radio :value="true">开启</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          v-if="formValue.radioVal"
          label="脱敏字段:"
          path="checkboxVals"
          :show-require-mark="formValue.radioVal"
        >
          <n-space vertical class="w-full block">
            <n-checkbox
              v-model:checked="formValue.checkboxVal"
              label="全选"
              class="w-100px"
              :indeterminate="formValue.indeterminate"
              @update:checked="updateCheckVal"
            />
            <n-checkbox-group v-model:value="formValue.checkboxVals" @update:value="updateGroupVal">
              <n-space class="">
                <n-checkbox :value="1" label="身份证号/护照号" />
                <n-checkbox :value="2" label="姓名" />
                <n-checkbox :value="3" label="性别" />
                <n-checkbox :value="4" label="出生日期" />
                <n-checkbox :value="5" label="人脸" />
                <n-checkbox :value="6" label="手机号" />
                <n-checkbox :value="7" label="地址" />
                <n-checkbox :value="8" label="民族" />
              </n-space>
            </n-checkbox-group>
          </n-space>
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, ref } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { cloneDeep } from 'lodash-es';

const emits = defineEmits(['onClose', 'onSuccess', 'register']);
const [register, { closeModal }] = useModalInner(data => {
  data && onDataReceive(data);
});

const origin = {
  radioVal: true,
  checkboxVals: [],
  checkboxVal: true,
  allCheckedVal: [1, 2, 3, 4, 5, 6, 7, 8],
  indeterminate: false
};

const formValue = reactive(cloneDeep(origin));
const formRef = ref();

const rules = {
  checkboxVals: {
    trigger: 'blur',
    validator: (rule, value) => {
      if (!value?.length && formValue.radioVal) return new Error('请勾选脱敏字段');
      return true;
    }
  }
};

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};
function onSure() {
  validateItems().then(res => {
    if (res) {
      emits('onSuccess', {
        switch: formValue.radioVal,
        dataMaskingType: formValue.checkboxVals,
        isDataMasking: formValue.radioVal ? 1 : 0
      });
      closeModal();
    }
  });
}
// 是否脱敏
const updateRadio = val => {
  if (!val) {
    formValue.checkboxVals = [];
    formValue.checkboxVal = false;
  }
};
//  全选操作
const updateCheckVal = val => {
  if (val) {
    formValue.checkboxVals = origin.allCheckedVal;
  } else {
    formValue.checkboxVals = [];
    formValue.indeterminate = false;
  }
};
// 复选框操作
const updateGroupVal = vals => {
  if (vals == origin.allCheckedVal) {
    formValue.indeterminate = false;
    formValue.checkboxVal = true;
  } else if (vals == []) {
    formValue.checkboxVal = false;
    formValue.indeterminate = false;
  } else {
    formValue.checkboxVal = true;
    formValue.indeterminate = true;
  }
};

/**
 * 校验
 */
function validateItems() {
  return new Promise(resolve => {
    formRef.value.validate(errors => {
      if (!errors) {
        resolve(true);
      } else {
        throw new Error('表单验证错误');
      }
    });
  });
}

function reset() {
  Object.assign(formValue, origin);
  formRef.value?.restoreValidation();
}
function onDataReceive(data) {
  if (data.radioVal) {
    if (data.checkboxVals.toString() != formValue.allCheckedVal.toString()) {
      // 编辑 非全选
      formValue.indeterminate = true;
      formValue.checkboxVal = false;
    }
    if (data.checkboxVals.toString() == formValue.allCheckedVal.toString() || !data.checkboxVals?.length) {
      // 创建 或者 编辑全选
      formValue.checkboxVal = true;
      data.checkboxVals = formValue.allCheckedVal;
    }
  } else {
    data.checkboxVals = [];
    formValue.checkboxVal = false;
  }

  Object.assign(formValue, data);
}
</script>
