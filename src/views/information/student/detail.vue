<template>
  <n-space vertical>
    <n-card class="relative">
      <p class="text-center text-4.5 font-bold">学生档案</p>
      <n-button
        v-auth="9345"
        :disabled="query.edit == 'false'"
        class="absolute right-4 top-4"
        type="primary"
        @click="go(`/information/student-modify?id=${query.id}`)"
      >
        编辑
      </n-button>
    </n-card>
    <n-form require-mark-placement="left" label-width="100">
      <n-card
        class="shadow-sm mb-4"
        header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;"
      >
        <template #header>
          <p class="font-bold">基础信息</p>
        </template>
        <n-grid cols="4" :x-gap="50">
          <n-form-item-gi label="姓名">
            {{ formValue.studentName }}
            <span v-if="isAuditName" text-error>(审核中)</span>
          </n-form-item-gi>
          <n-form-item-gi label="出生日期">
            {{ formValue.birth || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="性别">
            {{ formValue.sexName }}
          </n-form-item-gi>
          <n-form-item-gi label="区域">
            {{ formValue.belongAreaName || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="证件类型">
            {{ formValue.idCardTypeName || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="证件号">
            {{ formValue.idcard || '/' }}
            <span v-if="isAuditIdcard && formValue.belongArea == 1 && formValue.idcard" text-error>(审核中)</span>
          </n-form-item-gi>
          <n-form-item-gi label="学籍号码">
            {{ formValue.registerNumber || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="籍贯">
            {{ formValue.nativePlaceName || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="民族">
            {{ formValue.nationality || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="家庭住址">
            {{ formValue.familyAddress || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="家长姓名">
            {{ formValue.parentName || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="家长手机">
            {{ formValue.parentPhone || '/' }}
          </n-form-item-gi>
        </n-grid>
      </n-card>
      <n-card
        title="就读信息"
        class="shadow-sm mb-3"
        header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;"
      >
        <template #header>
          <p class="font-bold">就读信息</p>
        </template>
        <n-steps vertical :current="100" status="process" size="small">
          <template #finish-icon><icon-ic:baseline-circle /></template>
          <n-step v-for="(item, num) in formValue.attendVOList" :key="num">
            <template #title>
              <span class="text-primary">
                {{ item.transferTime ? formatToDateYear(item.transferTime) : '' }}
                <span v-if="(item.transferTime && item.transferOutTime) || (item.transferTime && num == 0)">-</span>
                {{ item.transferOutTime ? formatToDateYear(item.transferOutTime) : num == 0 ? '至今' : '' }}
              </span>
              <br />
              <span class="leading-8">
                {{ studyStatusOptions.find(d => d.value == item.studyStatus)?.label ?? '在读' }}
              </span>
            </template>
            <div class="releative ml-28 -mt-15 flex flex-wrap">
              <n-grid cols="4" :x-gap="30">
                <n-form-item-gi label="学校名称">
                  {{ item.schoolName || '/' }}
                </n-form-item-gi>
                <n-form-item-gi label="学籍">
                  {{ item.schoolRoll == 2 ? '外校' : '本校' }}
                </n-form-item-gi>
                <n-form-item-gi label="学年">
                  {{ item.studyYear || '/' }}
                </n-form-item-gi>
                <n-form-item-gi label="就读记录">
                  <template v-if="item.studentClassCommonVOS && item.studentClassCommonVOS.length">
                    <span
                      v-for="(subItem, index) in item.studentClassCommonVOS"
                      :key="index"
                      :class="{ 'text-primary': !num && !index }"
                    >
                      {{ subItem.gradeName }}{{ subItem.className
                      }}<span v-if="index + 1 < item.studentClassCommonVOS.length">、</span>
                    </span>
                  </template>
                  <span v-else>/</span>
                </n-form-item-gi>
                <n-form-item-gi label="转入时间">
                  {{ item.transferTime || '/' }}
                </n-form-item-gi>
                <n-form-item-gi label="转出时间">
                  {{ item.transferOutTime || '/' }}
                </n-form-item-gi>
                <n-form-item-gi label="转出原因">
                  {{ item.transferOutReason || '/' }}
                </n-form-item-gi>
                <n-form-item-gi label="学段">
                  {{ schoolLearnPeriod.find(d => d.value == item.schoolTypes)?.label ?? '/' }}
                </n-form-item-gi>
              </n-grid>
            </div>
          </n-step>
        </n-steps>
      </n-card>
    </n-form>
  </n-space>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useGo } from '@common/hooks/usePage';
import { getDetails } from '@/api/information/student';
import { schoolLearnPeriod } from '../school/school.data';
import { formatToDateYear } from '@common/utils/common/date';
import { studyStatusOptions } from '../common.data';

const formValue = reactive({ name: '', attendVOList: [{}] });
const { go } = useGo();
const { query } = useRoute();

defineOptions({
  name: 'StudentInformationDetail'
});

const isAuditName = ref();
const isAuditIdcard = ref();

const getDetail = async () => {
  const detail = await getDetails({ studentBaseId: query.id });
  detail && Object.assign(formValue, detail);
  // if (detail) {
  //   const params = { studentBaseId: detail.studentBaseId, studentAttendId: detail.attendVOList[0].id };
  //   isAuditName.value = await applyRecordStatus({ ...params, changeType: 1 });
  //   isAuditIdcard.value = await applyRecordStatus({ ...params, changeType: 2 });
  // }
};
getDetail();
</script>
