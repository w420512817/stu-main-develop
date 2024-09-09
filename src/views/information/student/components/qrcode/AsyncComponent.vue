<template>
  <component :is="AsyncComp" :list="list" v-bind="$attrs">
    <template #stuInfo="{ item }">
      <div text-3 leading-24px w-150px>
        <h3 font-bold text-4 leading-30px>{{ item.studentName || '姓名' }}</h3>
        <p>{{ item.sex == 1 ? '男' : '女' }} {{ item.birth || '出生年月' }}</p>
        <p>{{ item.schoolName || '学校名称' }}</p>
        <p>{{ item.schoolTypesName || '学段' }} {{ item.gradeName || '年级' }} {{ item.className || '班级' }}</p>
      </div>
    </template>
    <template #stuCode="{ item }">
      <Qrcode :value="item.qrCode || 'item.qrCode'" :width="140" />
    </template>
    <template #gzhCode>
      <img width="140" height="140" :src="state.wxCodeImg" />
    </template>
  </component>
</template>
<script setup>
import { ref, defineAsyncComponent, reactive } from 'vue';
import { array } from 'vue-types';
import * as vue from 'vue';
import { loadModule } from 'vue3-sfc-loader';
import { getAppEnv, isDevMode } from '@common/utils/common/env';
import Qrcode from '@common/components/common/Qrcode/index';

defineProps({
  list: array().def([])
});

const options = {
  moduleCache: {
    vue: vue
  },
  async getFile(url) {
    const res = await fetch(url);
    if (!res.ok) throw Object.assign(new Error(res.statusText + ' ' + url), { res });
    return {
      getContentData: asBinary => (asBinary ? res.arrayBuffer() : res.text())
    };
  },
  addStyle(textContent) {
    const style = Object.assign(document.createElement('style'), { textContent });
    const ele = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ele);
  }
};
const AsyncComp = ref(null);
const state = reactive({});
const setAsyncComponent = selDengjibiao => {
  const { imgName, fileName } = selDengjibiao.value;
  // state.wxCodeImg = VITE_API_URL + config + `/registrationForm/getFile/img/${imgName}`;
  // state.targetUrl = VITE_API_URL + config + `/registrationForm/getFile/file/${fileName}`;
  const config = isDevMode() ? '/base-config' : '/base-config';

  const { VITE_API_URL } = getAppEnv();

  state.wxCodeImg = `${VITE_API_URL}${config}/registrationForm/getFile/img/${imgName}`;
  state.targetUrl = `${VITE_API_URL}${config}/registrationForm/getFile/file/${fileName}`;
  if (isDevMode()) {
    AsyncComp.value = defineAsyncComponent(() => import('./standard3.vue'));
  } else {
    AsyncComp.value = defineAsyncComponent(() => loadModule(state.targetUrl, options));
  }
};
defineExpose({
  setAsyncComponent
});
</script>
