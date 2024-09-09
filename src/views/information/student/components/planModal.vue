<template>
  <basic-modal
    v-bind="$attrs"
    class="w-450px"
    title="计划详情"
    :show-cancel-btn="false"
    @register="register"
    @visible-change="visibleChange"
    @ok="closeModal"
  >
    <n-space vertical class="max-h-400px overflow-auto">
      <n-descriptions label-placement="left" :column="1" :label-style="{ 'font-weight': 600 }">
        <n-descriptions-item label="计划名称">{{ formValue.planName || '/' }}</n-descriptions-item>
        <n-descriptions-item label="计划年份">{{ formValue.planYear || '/' }}</n-descriptions-item>
        <n-descriptions-item label="计划类型">{{ planTypes[formValue.planType] || '/' }}</n-descriptions-item>
        <n-descriptions-item label="计划周期">{{ formValue.planTime || '/' }}</n-descriptions-item>
        <n-descriptions-item label="筛查机构">{{ formValue.taskOrgName || '/' }}</n-descriptions-item>
        <n-descriptions-item label="筛查设备">{{ formValue.equipment?.join(',') || '/' }}</n-descriptions-item>
      </n-descriptions>
      <n-space v-if="formValue.eyesight" class="bg-gray-100" mt-3 py-3 px-1 relative>
        <n-tag absolute right-0 top-0 type="info" :bordered="false">视力</n-tag>
        <n-descriptions label-placement="left" :column="1" :label-style="{ 'font-weight': 600 }">
          <n-descriptions-item label="检查者">{{ formValue.eyesight.slCreatorName }}</n-descriptions-item>
          <n-descriptions-item label="检查时间">{{ formValue.eyesight.slCreateTime }}</n-descriptions-item>
          <n-descriptions-item label="数据来源">{{ formValue.eyesight?.slSource ?? '/' }}</n-descriptions-item>
        </n-descriptions>
      </n-space>
      <n-space v-if="formValue.eyesight" class="bg-gray-100" mt-3 py-3 px-1 relative>
        <n-tag absolute right-0 top-0 type="info" :bordered="false">屈光</n-tag>
        <n-descriptions label-placement="left" :column="1" :label-style="{ 'font-weight': 600 }">
          <n-descriptions-item label="检查者">{{ formValue.eyesight.qgCreatorName }}</n-descriptions-item>
          <n-descriptions-item label="检查时间">{{ formValue.eyesight.qgCreateTime }}</n-descriptions-item>
          <n-descriptions-item label="数据来源">{{ formValue.eyesight?.qgSource ?? '/' }}</n-descriptions-item>
        </n-descriptions>
      </n-space>
      <n-space v-if="formValue.caries" class="bg-gray-100" mt-3 py-3 px-1 relative>
        <n-tag absolute right-0 top-0 type="info" :bordered="false">口腔筛查</n-tag>
        <n-descriptions label-placement="left" :column="1" :label-style="{ 'font-weight': 600 }">
          <n-descriptions-item label="检查者">{{ formValue.caries.qcCreateName }}</n-descriptions-item>
          <n-descriptions-item label="检查时间">{{ formValue.caries.qcCreateTime }}</n-descriptions-item>
          <n-descriptions-item label="数据来源">{{ formValue.caries?.qcSource ?? '/' }}</n-descriptions-item>
        </n-descriptions>
      </n-space>
      <n-space v-if="formValue.checkup" class="bg-gray-100" mt-3 py-3 px-1 relative>
        <n-tag absolute right-0 top-0 type="info" :bordered="false">学生体检</n-tag>
        <n-descriptions label-placement="left" :column="1" :label-style="{ 'font-weight': 600 }">
          <n-descriptions-item label="检查者">{{ formValue.checkup.tjCreateName }}</n-descriptions-item>
          <n-descriptions-item label="检查时间">{{ formValue.checkup.tjCreateTime }}</n-descriptions-item>
          <n-descriptions-item label="数据来源">{{ formValue.checkup?.tjSource ?? '/' }}</n-descriptions-item>
        </n-descriptions>
      </n-space>
      <n-space v-if="formValue.physical" class="bg-gray-100" mt-3 py-3 px-1 relative>
        <n-tag absolute right-0 top-0 type="info" :bordered="false">学生体测</n-tag>
        <n-descriptions label-placement="left" :column="1" :label-style="{ 'font-weight': 600 }">
          <n-descriptions-item label="检查者">{{ formValue.physical.tcCreateName }}</n-descriptions-item>
          <n-descriptions-item label="检查时间">{{ formValue.physical.tcCreateTime }}</n-descriptions-item>
          <n-descriptions-item label="数据来源">{{ formValue.physical?.tcSource ?? '/' }}</n-descriptions-item>
        </n-descriptions>
      </n-space>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick } from 'vue';
// hooks
import { useModalInner } from '@common/components/custom/Modal';

const [register, { closeModal }] = useModalInner(data => {
  Object.assign(formValue, data);
});

const origin = {
  name: null
};
const planTypes = {
  101: '普查计划',
  102: '抽查计划',
  103: '复查计划',
  104: '自查计划'
};
// const sourceTypes = {
//   0: '医师输入',
//   1: '学生自查',
//   2: '机器录入'
// };
const formValue = reactive({ ...origin });

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};

function reset() {
  Object.assign(formValue, origin);
}
</script>
