<template>
  <basic-modal
    v-bind="$attrs"
    class="w-182"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    @register="register"
    @visible-change="visibleChange"
  >
    <!-- 政府端导出数据弹窗 -->
    <!-- <n-card title="常用下载" class="mb-3">
      <n-space justify="space-between">
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">未筛查名单</n-button>
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">实力检测数据</n-button>
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">视力健康检查表</n-button>
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">儿童视功能检查情况表</n-button>
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">不可筛查名单</n-button>
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">视力筛查数据</n-button>
      </n-space>
    </n-card>
    <n-card title="卫健委专用" class="mb-3">
      <n-space justify="space-between">
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">结果登记表</n-button>
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">结果数据表</n-button>
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">结果登记表（复测）</n-button>
        <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="() => {}">结果数据表rec文件</n-button>
      </n-space>
    </n-card> -->
    <n-space my-5>
      <n-button class="w-50 h-15 mb-2" type="primary" size="large" @click="handleClick(1)"> 未筛查学生名单 </n-button>
      <n-button v-if="appType == 1" class="w-50 h-15 mb-2" type="primary" size="large" @click="handleClick(2)">
        检测数据
      </n-button>
      <n-button v-if="appType == 1" class="w-50 h-15 mb-2" type="primary" size="large" @click="handleClick(3)">
        国家检测视力表
      </n-button>
    </n-space>
    <export1 :title="export1Title" @register="registerExport1" />
  </basic-modal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { useModal } from '@common/components/custom/Modal';
import { downloadFile } from '@common/utils/file/download';
import { exportNoScreenStu, exportCountryVisionData } from '@common/api/examine/export';
import { useApplicationStore } from '@/store';

import export1 from './export1.vue';
const state = reactive({ taskId: null, range: null, taskOrgName: null, planName: null });
const export1Title = ref('');
// / setProps, closeModal,
const [register, { changeLoading }] = useModalInner(data => {
  data && Object.assign(state, data);
});
const [registerExport1, { openModal }] = useModal();

const { appType } = useApplicationStore();

function visibleChange(visible) {
  if (visible) {
    changeLoading();
    setTimeout(() => {
      changeLoading(false);
    }, 100);
  }
}

function handleClick(act) {
  switch (act) {
    case 1:
      downNotScreenStu();
      break;
    case 2:
      export1Title.value = `${state.range}${state.taskOrgName}视力检测数据下载`;
      openModal(true, state);
      break;
    case 3:
      downCountytScreenStu();
      break;
  }
}
async function downNotScreenStu() {
  changeLoading(true);
  try {
    const res = await exportNoScreenStu({ taskId: state.taskId });
    res?.data && downloadFile(res.data, `${state.planName}-${state.taskOrgName}-未筛查学生名单`, 'xlsx');
  } finally {
    changeLoading(false);
  }
}
async function downCountytScreenStu() {
  changeLoading(true);
  try {
    const res = await exportCountryVisionData({ taskId: state.taskId });
    res?.data && downloadFile(res.data, `${state.taskOrgName}-国家检测视力表`, 'xlsx');
  } finally {
    changeLoading(false);
  }
}
</script>
