<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider :max="1">
          <slot></slot>
          <naive-provider-content />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<script setup>
import { defineComponent, h } from 'vue';
import { useLoadingBar, useDialog, useMessage, useNotification } from 'naive-ui';
import { usePreDialog } from '@common/hooks/business/useDialog';

// 挂载naive组件的方法至window, 以便在路由钩子函数和请求函数里面调用
function registerNaiveTools() {
  const { dialog, dialogWarning, dialogSuccess, dialogInfo, dialogError } = usePreDialog();

  window.$loadingBar = useLoadingBar();
  window.$dialog = useDialog();

  // 因dialog使用频繁 所以预设配置 简化使用
  window.$preDialog = dialog;
  window.$dialogWarning = dialogWarning;
  window.$dialogSuccess = dialogSuccess;
  window.$dialogInfo = dialogInfo;
  window.$dialogError = dialogError;

  window.$message = useMessage();
  window.$notification = useNotification();
}

const NaiveProviderContent = defineComponent({
  setup() {
    registerNaiveTools();
  },
  render() {
    return h('div');
  }
});
</script>
<style scoped></style>
