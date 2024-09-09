<template>
  <basic-modal v-bind="$attrs" class="w-600px" @register="register" @visible-change="visibleChange">
    <n-space vertical>
      <n-space>
        <n-button @click="setProps({ loading: true })">loading</n-button>
        <n-button @click="setProps({ title: 'Modal New Title' })">title</n-button>
        <n-button @click="closeModal">close</n-button>
        <n-button @click="setProps({ confirmLoading: true })">btnLoading</n-button>
      </n-space>
      <n-input class="!w-200px" />

      <div>动态参数：{{ userData.filed }}</div>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { object } from 'vue-types';
import { useModalInner } from '@common/components/custom/Modal';

defineProps({
  userData: object().def({})
});

const [register, { setProps, closeModal, changeLoading }] = useModalInner(data => {
  data && onDataReceive(data);
});

function visibleChange(visible) {
  if (visible) {
    changeLoading();
    setTimeout(() => {
      changeLoading(false);
    }, 1000);
  }
}

function onDataReceive(data) {
  console.log('Data Received', data);
}
</script>
