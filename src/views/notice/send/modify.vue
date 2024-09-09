<template>
  <n-spin :show="SendNoticeDetailLoading">
    <n-card>
      <n-form
        ref="formRef"
        :rules="rules"
        :model="state"
        max-w-1100px
        mx-auto
        label-placement="left"
        require-mark-placement="left"
      >
        <n-grid cols="1" :x-gap="50" responsive="screen">
          <n-form-item-gi label="通知标题:" path="noticeTitle">
            <n-input
              v-model:value="state.noticeTitle"
              clearable
              type="text"
              maxlength="50"
              show-count
              placeholder="请输入通知标题"
            />
          </n-form-item-gi>

          <n-form-item-gi label="通知机构:" path="notifiedOrgId">
            <dropdown-select
              ref="notifiedOrgIdREF"
              v-model:value="state.notifiedOrgId"
              placeholder="请选择通知机构"
              filterable
              clearable
              :list-api="notifiedOrgSelectBox"
              label-field="orgName"
              value-field="orgId"
              @update:value="notifiedOrgIdUpdateValue"
            />
          </n-form-item-gi>

          <n-form-item-gi label="通知角色:" path="notifiedRoleId">
            <dropdown-select
              ref="notifiedRoleIdREF"
              v-model:value="state.notifiedRoleId"
              placeholder="请选择通知机构"
              filterable
              clearable
              :params="{ orgId: state.notifiedOrgId }"
              :list-api="notifiedRoleSelectBox"
              label-field="name"
              value-field="id"
              @update:value="notifiedRoleIdUpdateValue"
            />
          </n-form-item-gi>

          <n-form-item-gi label="通知对象:" path="notifiedPersonId">
            <dropdown-select
              ref="notifiedPerson"
              v-model:value="state.notifiedPersonId"
              placeholder="请选择通知对象"
              filterable
              clearable
              :params="{ roleId: state.notifiedRoleId }"
              :list-api="notifiedUserSelectBox"
              multiple
              label-field="realName"
              value-field="id"
            />
          </n-form-item-gi>

          <n-form-item-gi label="通知内容:" path="noticeContent">
            <n-input
              v-model:value="state.noticeContent"
              maxlength="300"
              show-count
              type="textarea"
              clearable
              placeholder="请选择通知内容"
            />
          </n-form-item-gi>

          <n-form-item-gi label="通知方式:" path="noticeTimeType">
            <n-radio-group v-model:value="state.noticeTimeType" name="noticeTimeType">
              <n-radio v-for="item in noticeTimeType" :key="item.value" :value="item.value" :label="item.label" />
            </n-radio-group>
          </n-form-item-gi>

          <n-form-item-gi v-if="state.noticeTimeType !== 0" label="通知时间:" path="noticeTime">
            <n-date-picker
              v-model:formatted-value="state.noticeTime"
              :is-date-disabled="v => disabledYesterday(v)"
              value-format="yyyy-MM-dd HH:mm:ss"
              w-full
              clearable
              type="datetime"
              placeholder="请选择通知时间"
            />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <n-space justify="center">
        <n-button v-if="!state.noticeTimeType" type="info" :loading="addNoticeLoading" @click="addNotice(true)">
          立即发送
        </n-button>
        <n-button v-else type="info" :loading="addNoticeLoading" @click="addNotice()">保存</n-button>
        <n-button @click="route.back">返回</n-button>
      </n-space>
    </n-card>
  </n-spin>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue';

import { useTabs } from '@common/hooks/useTabs';
import { useGo } from '@common/hooks/usePage';
import { useRoute } from 'vue-router';
import useApi from '@common/hooks/business/useApi';
// import { useUserStore } from '@/store';

import { disabledYesterday, formatToDateTime } from '@common/utils/common/date';
import { rules, noticeTimeType } from './table.data';
import {
  AddNoticeByHashedWheelTimer,
  SendNoticeDetail,
  EditNotice,
  notifiedOrgSelectBox,
  notifiedRoleSelectBox,
  notifiedUserSelectBox
} from '@/api/notice/send';

// const {
//   userInfo: { orgId }
// } = useUserStore();
const { route } = useGo();
const {
  query: { noticeSendId }
} = useRoute();
const { setTitle } = useTabs();

const { fetch: SendNoticeDetailApi, loading: SendNoticeDetailLoading } = useApi(SendNoticeDetail);

const state = reactive({
  noticeTitle: null,
  noticeType: 0,
  notifiedOrg: null,
  notifiedOrgId: null,
  notifiedOrgType: null,
  notifiedRoleId: null,
  notifiedRoleName: null,
  notifiedPersonId: null,
  noticeContent: null,
  noticeTime: null,
  noticeTimeType: 0
});
const formRef = ref();
const notifiedPerson = ref();
const notifiedOrgIdREF = ref();
const notifiedRoleIdREF = ref();
const addNoticeLoading = ref(false);

function notifiedOrgIdUpdateValue() {
  nextTick(() => {
    notifiedRoleIdREF.value.getOptions();
  });
}
function notifiedRoleIdUpdateValue() {
  nextTick(() => {
    notifiedPerson.value.getOptions();
  });
}

function initInfo() {
  setTitle(`${noticeSendId ? '编辑' : '新增'}-通知信息`);
  noticeSendId && getNoticeInfo();
}

async function getNoticeInfo() {
  const res = await SendNoticeDetailApi({ noticeSendId });
  const { notifiedPersonId } = res;
  Object.assign(state, {
    ...res,
    notifiedPersonId: notifiedPersonId.split(',')
  });
  await nextTick();
  notifiedRoleIdREF.value.getOptions();
  await nextTick();
  notifiedPerson.value.getOptions();
}

function addNotice(immediately) {
  formRef.value.validate(async err => {
    if (!err) {
      try {
        addNoticeLoading.value = true;
        const notifiedPersonStr = state.notifiedPersonId
          ? state.notifiedPersonId.reduce((per, item, i) => {
              const v = notifiedPerson.value.options.find(v => v.id === item);
              return `${per}${i ? ',' : ''}${v.realName}`;
            }, '')
          : '';
        let notifiedOrgIdOBJ = notifiedOrgIdREF.value.options.find(v => v.orgId == state.notifiedOrgId);
        const notifiedOrg = notifiedOrgIdOBJ.orgName;
        const notifiedOrgType = notifiedOrgIdOBJ.orgType;

        let notifiedRoleOBJ = notifiedRoleIdREF.value.options.find(v => v.id == state.notifiedRoleId);
        const notifiedRoleName = notifiedRoleOBJ.name;

        const funcApi = noticeSendId ? EditNotice : AddNoticeByHashedWheelTimer;
        const { noticeTime, noticeTimeType } = state;
        await funcApi({
          ...state,
          notifiedPerson: notifiedPersonStr,
          notifiedPersonId: state.notifiedPersonId ? state.notifiedPersonId.join(',') : '',
          notifiedOrg,
          notifiedOrgType,
          notifiedRoleName,
          noticeSendId,
          noticeTime: noticeTimeType !== 0 ? noticeTime : formatToDateTime(Date.now())
        });

        window.$message.success(`${immediately ? '发送' : '保存'}成功`);
        route.back();
      } finally {
        addNoticeLoading.value = false;
      }
    }
  });
}

onMounted(() => {
  notifiedOrgIdREF.value.getOptions();
  initInfo();
});
</script>
