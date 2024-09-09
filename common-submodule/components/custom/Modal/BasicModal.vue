<template>
  <n-modal v-bind="getAttrs" preset="card" @close="handleCancel" @update:show="handleMaskClick">
    <template #header>
      <slot name="title">
        <div>{{ getProps.title }}</div>
      </slot>
    </template>

    <template #header-extra>
      <slot name="header-extra"></slot>
    </template>

    <n-spin :show="getProps.loading">
      <div :class="{ controlContentHeight: getProps.controlContentHeight }">
        <slot name="default"></slot>
      </div>
    </n-spin>

    <template #action>
      <slot name="action">
        <n-space v-if="getProps.showBottom" justify="end">
          <n-button v-if="getProps.showCancelBtn" v-bind="getProps.cancelButtonProps" @click="handleCancel">
            {{ getProps.cancelText }}
          </n-button>
          <n-button
            v-if="getProps.showOkBtn"
            :type="getProps.okType"
            v-bind="getProps.okButtonProps"
            :loading="getProps.confirmLoading"
            @click="handleOk"
          >
            {{ getProps.okText }}
          </n-button>
        </n-space>
      </slot>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, unref, computed, watch, watchEffect, useAttrs, getCurrentInstance } from 'vue';
import { bool, object, string } from 'vue-types';
import { deepMerge } from '@common/utils/common';
import { useModalDragMove } from './hooks/useModalDrag';

const props = defineProps({
  show: bool().def(false),
  title: string().def(''),
  okType: string().def('primary'),
  cancelText: string().def('取消'),
  okText: string().def('确定'),
  okButtonProps: object().def({}),
  cancelButtonProps: object().def({}),
  confirmLoading: bool(),
  loading: bool(),
  draggable: bool().def(true), // 支持拖拽
  showOkBtn: bool().def(true),
  showCancelBtn: bool().def(true),
  showBottom: bool().def(true),
  controlContentHeight: bool().def(true) // 是否控制滚动区域
});

const attrs = useAttrs();

const emits = defineEmits(['visible-change', 'cancel', 'ok', 'register']);

const visibleRef = ref(false);
const propsRef = ref({});

useModalDragMove({ visible: visibleRef, draggable: props.draggable });

const instance = getCurrentInstance();
if (instance) {
  emits('register', { setProps }, instance.uid);
}

const getProps = computed(() => {
  return {
    ...props,
    ...unref(propsRef)
  };
});

const getAttrs = computed(() => {
  return {
    ...attrs,
    show: unref(visibleRef)
  };
});

// 设置modal参数
function setProps(props) {
  propsRef.value = deepMerge(unref(propsRef), props);
  if (Reflect.has(props, 'visible')) {
    visibleRef.value = !!props.visible;
  }
}

watchEffect(() => {
  visibleRef.value = !!props.show;
});

watch(
  () => unref(visibleRef),
  v => {
    emits('visible-change', v);
  }
);

function handleOk(e) {
  emits('ok', e);
}

function handleMaskClick() {
  handleCancel();
}

async function handleCancel(e) {
  e?.stopPropagation();
  visibleRef.value = false;
  emits('cancel', e);
}

defineExpose({
  setProps
});
</script>

<style lang="less">
.controlContentHeight {
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  overflow-y: auto;
  margin-left: -24px;
  margin-right: -24px;
  padding: 0 24px 24px;
}
</style>
