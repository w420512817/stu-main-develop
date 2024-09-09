<template>
  <basic-modal
    v-bind="$attrs"
    class="w-950px"
    title="导入列表"
    :show-cancel-btn="false"
    :closable="false"
    ok-text="关闭"
    @register="register"
    @cancel="handleClose"
    @ok="handleClose"
  >
    <button
      absolute
      right-0
      w-25px
      h-25px
      cursor-pointer
      class="-top-12 text-[#000] n-base-close n-dialog__close"
      @click="handleClose"
    >
      <icon-carbon:close text-25px />
    </button>
    <icon-carbon:shrink-screen-filled
      text-20px
      absolute
      right-9
      cursor-pointer
      class="-top-11 text-[#000]"
      @click="handleImportBtn"
    />
    <q-suspense :loading="Object.keys(state).length === 0">
      <div flex relative>
        <div w-450px>
          <p flex justify-between mb-3>
            <span text-4>&nbsp;</span>
          </p>
          <n-card border border-gray-100 mr-4>
            <!--导入结果-全部成功与部分失败-->
            <div v-if="state.successCount" flex justify-between>
              <div>
                <p text-5 mb-2>{{ state.schoolName }}&nbsp;&nbsp;筛查数据</p>
                <p>
                  新增
                  <span text-error>{{ state.successCount }}</span>
                  个学生筛查数据, 导入失败
                  <span text-error>{{ state.failCount }} </span>
                  个学生筛查数据
                </p>
              </div>

              <n-progress :stroke-width="8" style="width: 70px" type="circle" status="success" :percentage="100">
                <span v-if="state.completion" text-success text-13px>{{ state.completion }}</span>
                <span v-else text-success text-10px whitespace-nowrap>请稍等</span>
              </n-progress>
            </div>
            <!--导入全部失败-->
            <div v-else flex justify-between>
              <div pr-2>
                <p text-5 mb-2>{{ state.schoolName }}</p>
                <p>
                  导入失败
                  <span text-error>{{ state.failCount }}</span>
                  个学生筛查数据
                </p>
              </div>

              <n-progress :stroke-width="8" style="width: 70px" type="circle" status="error" :percentage="100">
                <!-- <icon-carbon:close text-error text-12 /> -->
                <span v-if="state.completion" text-success text-13px>{{ state.completion }}</span>
                <span v-else text-success text-10px whitespace-nowrap>请稍等</span>
              </n-progress>
            </div>
          </n-card>
        </div>
        <div v-if="state.failCount" flex-1 ml-4>
          <p flex justify-between mb-3>
            <span text-bolder text-4>失败原因</span>
            <span v-if="state.failReasons?.length" text-primary cursor-pointer @click="handleDownload"
              >下载失败原因</span
            >
          </p>
          <n-table>
            <thead>
              <tr>
                <th>失败行数</th>
                <th>导入失败原因</th>
              </tr>
            </thead>
            <tbody v-if="state.failReasons?.length">
              <tr v-for="(item, index) in state.failReasons" :key="index">
                <td>{{ item.row }}</td>
                <td>{{ item.reason }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="2">
                  <div class="flex-center w-full">
                    <n-empty />
                  </div>
                </td>
              </tr>
            </tbody>
          </n-table>
        </div>
      </div>
    </q-suspense>
  </basic-modal>
</template>

<script setup>
import { computed } from 'vue';
import { downloadFile } from '@common/utils/file/download';
// hooks
import { useModalInner } from '@common/components/custom/Modal';
// api
import { exportErrorData } from '@common/api/examine/import';

import { useScreenStore } from '@/store';
import QSuspense from '@common/qd-components/QSuspense/index.vue';

const screenStore = useScreenStore();

const [register, { changeLoading }] = useModalInner();

const state = computed(() => {
  return screenStore.state;
});
function handleClose() {
  screenStore.onClose();
}
function handleImportBtn() {
  screenStore.showImportBtn();
  screenStore.hideResultModal();
}
async function handleDownload() {
  changeLoading();
  try {
    const res = await exportErrorData({ taskId: screenStore.state.taskId || null });
    res && downloadFile(res.data, '筛查数据导入失败信息表', 'xlsx');
  } catch (e) {
    window.$message.error('请检查文件并重新上传');
  } finally {
    changeLoading(false);
  }
}
</script>
