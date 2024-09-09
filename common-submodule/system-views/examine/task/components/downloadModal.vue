<template>
  <basic-modal
    v-bind="$attrs"
    class="w-600px"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    @register="register"
    @visible-change="visibleChange"
  >
    <n-space>
      <n-button v-for="item in getBtns(btns)" :key="item.id" type="primary" size="large" @click="handleClick(item.id)">
        {{ item.label }}
      </n-button>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { object } from 'vue-types';
import { useModalInner } from '@common/components/custom/Modal';
import { reactive, computed } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useApplicationStore } from '@/store';

import { exportTaskExcel, exportNoScreenStu, exportNotScreenStu } from '@common/api/examine/export';

import { downloadFile } from '@common/utils/file/download';

const { appType } = useApplicationStore();

defineProps({
  userData: object().def({})
});
const btns = [
  { id: 1, label: '不可筛查名单' },
  { id: 2, label: '未筛查名单' },
  { id: 3, label: '筛查数据', show: appType == 1 || appType == 2 || appType == 5 }
];

const getBtns = computed(() => {
  return btns => {
    return btns.filter(item => {
      return item.show || item.show === undefined;
    });
  };
});

const origin = {
  taskId: null,
  planId: null,
  schoolId: null
};
const formValue = reactive(cloneDeep(origin));
// / setProps, closeModal,
const [register, { changeLoading }] = useModalInner(data => {
  data && Object.assign(formValue, data);
});

function visibleChange(visible) {
  !visible && Object.assign(formValue, origin);
  // if (!visible) {
  //   changeLoading();
  //   setTimeout(() => {
  //     changeLoading(false);
  //   }, 1000);
  // }
}
const handleClick = async act => {
  changeLoading();
  const { taskId, planId, schoolId, taskOrgName, taskName } = formValue;
  let params = { taskId, planId, schoolId, orgId: schoolId };
  let downApi = null;
  try {
    switch (act) {
      case 1:
        downApi = exportNotScreenStu;
        break;
      case 2:
        downApi = exportNoScreenStu;
        break;
      case 3:
        downApi = exportTaskExcel;
        break;
    }
    const excelName = btns.find(t => t.id === act)?.label;
    const res = await downApi(params);
    res && downloadFile(res.data, `${taskOrgName}-${taskName}-${excelName}`, 'xlsx');
  } catch (error) {
    window.$message.error('请重新下载');
  } finally {
    changeLoading(false);
  }
};
</script>
