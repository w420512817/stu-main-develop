<template>
  <n-card class="h-full shadow-sm">
    <n-spin :show="loadingDetail">
      <n-space vertical>
        <div class="border-2px border-[#f3f3f3] rounded-1/2 w-25 h-25 text-center leading-25 m-auto">
          {{ trusteeship.trusteeshipStatus == 1 ? '托管中' : '未托管' }}
        </div>
        <template v-if="trusteeship.trusteeshipStatus == 1">
          <p class="text-center">系统运维正在托管系统...托管剩余{{ trusteeship.remainDays }}天</p>
          <n-button v-auth="9364" class="m-auto block px-8" @click="onCancel">取消托管</n-button>
        </template>
      </n-space>
    </n-spin>

    <n-card :bordered="false" title="托管申请">
      <n-data-table remote :render-cell="v => v ?? '/'" :loading="loading" :columns="columns" :data="dataSource" />
    </n-card>
    <auditModal @register="register" @on-success="getDataSource" />
  </n-card>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue';
// store
import { useUserStore } from '@/store';

import { formatToDate } from '@common/utils/common/date';
// hooks
import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
// static data
import { AC_PASS, AC_REJECT } from '@common/enum/pageEnum';
import { createColumns } from './trustee.data';
// api getTrusteeList getOrgTrusteeshipStatus
import { getTrusteeList, getOrgTrusteeshipStatus } from '@/api/trustee';
// component
import auditModal from './components/auditModal.vue';

let trusteeship = reactive({ trusteeshipStatus: 0, remainDays: 0 });
const dataSource = ref([]);
const {
  userInfo: { orgId }
} = useUserStore();

const columns = createColumns((key, row) => onClickBtn(key, row));
const [register, { openModal }] = useModal();
const { fetch: getList, loading } = useApi(getTrusteeList);
const { fetch: getCurrentDetail, loading: loadingDetail } = useApi(getOrgTrusteeshipStatus);

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row) {
  const { id, startTime, endTime, trusteeshipType } = row;
  const dataRange = `${formatToDate(startTime)}~${formatToDate(endTime)}`;
  switch (key) {
    case AC_REJECT:
      openModal(true, { key: AC_REJECT, id, dataRange, trusteeshipType, status: 3 });
      break;
    case AC_PASS:
      openModal(true, { key: AC_PASS, id, trusteeshipType, dataRange, status: 2 });
      break;
  }
}
function onCancel() {
  window.$dialogError('您正在取消业务平台托管，取消后运维将无法托管系统，您还要继续吗？', () => {
    return getAndUpdateTrustee(1).then(() => {
      window.$message.success('操作成功');
    });
  });
}
/**
 * 获取 table 数据
 */
async function getDataSource() {
  const data = await getList({ orgId });
  dataSource.value = data || [];

  getAndUpdateTrustee();
}
async function getAndUpdateTrustee(cancelTrusteeship = null) {
  const detail = await getCurrentDetail({ orgId, cancelTrusteeship });
  Object.assign(trusteeship, detail);
}
onMounted(() => {
  getDataSource();
});
</script>
