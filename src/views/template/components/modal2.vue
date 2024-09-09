<template>
  <basic-modal v-bind="$attrs" class="w-600px" @register="register" @visible-change="visibleChange">
    <template #header-extra>
      <icon-flat-color-icons:close-up-mode class="text-28px pr-2" />
    </template>
    <n-form ref="formRef">
      <n-form-item>
        <n-input :value="formData.name" />
      </n-form-item>
      <n-form-item>
        <n-input :value="formData.sex" />
      </n-form-item>
      <n-form-item>
        <n-input :value="formData.age" />
      </n-form-item>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
// import { cloneDeep } from 'lodash-es';

const [register, { changeLoading }] = useModalInner();
const formRef = ref(null);

const origin = {
  name: '',
  sex: '',
  age: '12'
};

const formData = reactive({ ...origin });

const visibleChange = async visible => {
  await nextTick();
  visible ? getData() : reset();
};

function getData() {
  changeLoading();

  setTimeout(() => {
    const result = { name: 'xxx', sex: 'man' };

    Object.assign(formData, result || {});

    changeLoading(false);
  }, 1000);
}

function reset() {
  Object.assign(formData, origin);
  formRef.value?.restoreValidation();
}
</script>
