<template>
  <basic-modal
    v-bind="$attrs"
    class="w-220mm"
    title="学生二维码预览"
    :show-cancel-btn="false"
    @register="register"
    @visible-change="visibleChange"
    @ok="closeModal"
  >
    <AsyncComponent ref="AsyncComponentRef" m-auto :list="[{}]" />
  </basic-modal>
</template>

<script setup>
import { ref } from 'vue';
// components
import AsyncComponent from './AsyncComponent.vue';
// hooks
import { useModalInner } from '@common/components/custom/Modal';

const [register, { closeModal }] = useModalInner();

const AsyncComponentRef = ref();

function setComponets(dengjibiao) {
  AsyncComponentRef.value.setAsyncComponent(dengjibiao);
}
defineExpose({
  setComponets
});
</script>
