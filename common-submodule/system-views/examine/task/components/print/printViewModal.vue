<template>
  <basic-modal v-bind="$attrs" class="w-220mm" :show-ok-btn="false" :show-cancel-btn="false" @register="register">
    <div id="printDom" ref="printDom" class="flex-center">
      <div v-if="state.show">
        <!-- <div v-for="item in state.stuList" :key="item.stuCode" class="height-7">
          <component :is="AsyncComp" :studata="item">
            <template #stuCode>
              <Qrcode :value="item.qrCode" :width="120" />
            </template>
            <template #gzhCode> <img width="120" height="120" :src="state.wxCodeImg" alt="" /> </template>
          </component>
        </div> -->
        <component :is="AsyncComp" :list="state.stuList">
          <template #stuCode="{ item }">
            <Qrcode v-if="item" :value="item.qrCode" :width="120" />
          </template>
          <template #stuInfo="{ item }">
            <div v-if="item" text-3 leading-24px w-150px>
              <h3 font-bold text-4 leading-30px>{{ item.studentName || '李乐乐' }}</h3>
              <p>{{ item.sex == 1 ? '男' : '女' }} {{ item.birth || '2000-03-03' }}</p>
              <p>{{ item.schoolName || '泰顺育才小学' }}</p>
              <p>
                {{ item.schoolTypesName || '小学' }} {{ item.gradeName || '一年级' }} {{ item.className || '实验班' }}
              </p>
            </div>
          </template>
          <template #gzhCode>
            <img width="120" height="120" :src="state.wxCodeImg" alt="" />
          </template>
        </component>
      </div>
    </div>
  </basic-modal>
</template>

<script setup>
import { defineAsyncComponent, reactive, nextTick, ref } from 'vue';
import { getAppEnv, isDevMode } from '@common/utils/common/env';
import * as vue from 'vue';
import { loadModule } from 'vue3-sfc-loader';
import { object } from 'vue-types';
import { useModalInner } from '@common/components/custom/Modal';
import Qrcode from '@common/components/common/Qrcode/index';

import printJS from 'print-js';

import { getRegisterFileStudents } from '@common/api/examine/task';

// import CODE_IMG from '@/assets/image/code.png';

const [register, { changeLoading }] = useModalInner(data => {
  data && onDataReceive(data);
});

let state = reactive({
  receiveData: '',
  targetUrl: '',
  show: false,
  stuList: [],
  initData: {}
});
const printDom = ref(null);
const AsyncComp = ref(null);

defineProps({
  userData: object().def({})
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

async function onDataReceive(data) {
  state.show = false;
  state.initData = data;
  const { fileName, imgName } = data;
  // state.wxCodeImg = VITE_API_URL + config + `/registrationForm/getFile/img/${imgName}`;
  // state.targetUrl = VITE_API_URL + config + `/registrationForm/getFile/file/${fileName}`;
  // let baseUrl = isDevMode() ? VITE_API_URL : window.location.host;
  const config = isDevMode() ? '/base-config' : '/base-config';
  const { VITE_API_URL } = getAppEnv();
  state.wxCodeImg = `${VITE_API_URL}${config}/registrationForm/getFile/img/${imgName}`;
  state.targetUrl = `${VITE_API_URL}${config}/registrationForm/getFile/file/${fileName}`;
  if (isDevMode()) {
    AsyncComp.value = defineAsyncComponent(() => import('./standardTemplate1.vue'));
  } else {
    AsyncComp.value = defineAsyncComponent(() => loadModule(state.targetUrl, options));
  }
  await nextTick();
  startPrint();
}
async function startPrint() {
  window.$message.loading('打印准备中......', { duration: 1500 });
  const { taskId, ids } = state.initData;
  changeLoading(true);
  state.stuList = await getRegisterFileStudents({ classIds: ids, taskId });
  state.show = true;
  changeLoading(false);
  await nextTick();
  console.log(state.stuList);
  setTimeout(() => {
    printJS({
      printable: printDom.value,
      type: 'html',
      targetStyles: ['*']
    });
  }, 2000);
}
</script>
<style scoped lang="less"></style>
