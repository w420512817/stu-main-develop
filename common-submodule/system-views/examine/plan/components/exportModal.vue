<template>
  <basic-modal
    v-bind="$attrs"
    class="w-600px"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    @register="register"
    @after-leave="visibleChange"
  >
    <div v-show="govLevel" class="m-b-3">
      <n-select
        v-model:value="value"
        filterable
        placeholder="搜索学校"
        :options="state.options"
        :loading="state.loading"
        value-field="id"
        label-field="name"
        clearable
        remote
        @search="handleSearch"
      />
    </div>
    <n-space>
      <n-button v-for="item in btns" :key="item.id" type="primary" size="large" @click="handleClick(item.id)">
        {{ item.label }}
      </n-button>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { object } from 'vue-types';
import { useModalInner } from '@common/components/custom/Modal';
import { reactive, ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useUserStore } from '@/store';
import { exportTaskExcel, exportNoScreenStu, exportNotScreenStu } from '@common/api/examine/export';
import { orgSelectBoxForGov } from '@common/api/examine/plan';
import { getAppName } from '@common/utils/auth';
import { downloadFile } from '@common/utils/file/download';
defineProps({
  userData: object().def({})
});
let value = ref(null);
const {
  userInfo: { govLevel, orgId }
} = useUserStore();
if (!govLevel) {
  value.value = orgId;
}
let state = reactive({
  options: [],
  loading: false
});
const btns = [
  { id: 1, label: '不参与筛查名单' },
  { id: 2, label: '未筛查名单' },
  { id: 3, label: `${getAppName()}筛查数据` }
];
const origin = {
  taskId: null,
  planId: null,
  schoolId: null
};
const formValue = reactive(cloneDeep(origin));
const [register, { changeLoading }] = useModalInner(data => {
  value.value = !govLevel ? orgId : null;
  data && Object.assign(formValue, data);
  handleSearch();
});

function visibleChange() {
  Object.assign(formValue, origin);
}
const handleClick = async act => {
  if (!value.value) {
    window.$message.error('请选择学校');
    return false;
  }
  changeLoading();
  const { planId } = formValue;
  let params = { planId, orgId: value.value, schoolId: value.value };
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

    const reader = new FileReader();
    reader.onload = e => {
      let resp = e.target.result;
      try {
        let msg = JSON.parse(resp).message;
        window.$message.error(msg);
      } catch {
        res && downloadFile(res.data, `${excelName}`, 'xlsx');
      }
    };
    reader.readAsText(res.data);
  } catch (error) {
    window.$message.error('请重新下载');
  } finally {
    changeLoading(false);
  }
};

async function handleSearch(keyWord) {
  let res = await orgSelectBoxForGov({ schoolName: keyWord || '', orgId });
  state.options = res;
}
</script>
