<!--
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-13 17:32:29
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-14 11:41:17
-->
<template>
  <div>
    <n-card :title="title" class="shadow-sm">
      <n-form :model="formValue" label-placement="left" inline @keypress.enter="handleSearch">
        <n-grid cols="4" :x-gap="48" responsive="screen">
          <n-gi>
            <n-form-item label="地区">
              <n-select v-model:value="formValue.area" :options="chooseModeList" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="筛查类型">
              <n-select v-model:value="formValue.planMode" filterable clearable :options="chooseModeList" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="计划">
              <n-select v-model:value="formValue.planType" :options="typeList" />
            </n-form-item>
          </n-gi>
          <template v-if="title == '学校报告'">
            <n-gi>
              <n-form-item label="学校">
                <n-input v-model:value="formValue.schoolName" placeholder="请输入" clearable />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="学段">
                <n-select v-model:value="formValue.planType" :options="typeList" />
              </n-form-item>
            </n-gi>
          </template>
          <n-gi>
            <n-button type="primary" @click="handleSearch">查看报表</n-button>
          </n-gi>
        </n-grid>
      </n-form>
    </n-card>
    <Notice style="background-color: #fff" />
  </div>
</template>

<script setup>
import { reactive, onActivated } from 'vue';
// import { useUserStore } from '@/store';
import { useRoute } from 'vue-router';

// const { userOrgType } = useUserStore();
const {
  meta: { title }
} = useRoute();

const formValue = reactive({
  planType: null,
  planMode: null,
  area: null,
  schoolName: ''
});
const chooseModeList = [];
const typeList = [];

// async function getDataSource() {
// const { ...info } = formValue;
// const params = {
//   ...info
// };
// const data = await getListApi(params);
// dataSource.value = data?.list ?? [];
// }

onActivated(() => {
  // getDataSource();
});

function handleSearch() {
  // getDataSource();
  console.log('handleSearch');
}
</script>

<style lang="less" scoped></style>
