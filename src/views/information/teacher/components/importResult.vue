<template>
  <basic-modal
    v-bind="$attrs"
    class="w-950px"
    title="导入结果"
    :show-cancel-btn="false"
    ok-text="关闭"
    :mask-closable="false"
    @register="register"
    @visible-change="visibleChange"
    @ok="onClose"
    @cancel="onClose"
  >
    <div flex>
      <div
        v-if="state.excelImportRateVO"
        :class="{ 'w-430px': state.excelImportRateVO.failImport, 'w-full': !state.excelImportRateVO.failImport }"
      >
        <n-card border border-gray-100 mr-4>
          <!--导入结果-成功与失败-->
          <div v-if="state.excelImportRateVO.successImport" flex justify-between>
            <div>
              <p text-5 mb-2>{{ state.orgName }} 教师信息</p>
              <p>教师类型： {{ belongAreaTypeOptions[state.type].label }}</p>
              <p>
                新增
                <span text-error>{{ state.excelImportRateVO.successImport }}</span>
                名教师, 导入失败
                <span text-error>{{ state.excelImportRateVO.failImport }} </span>
                名教师
              </p>
            </div>

            <n-progress :stroke-width="8" style="width: 70px" type="circle" status="success" :percentage="100">
              <span text-success text-13px>100%</span>
            </n-progress>
          </div>
          <!--导入全部失败-->
          <div v-else flex justify-between>
            <div>
              <p text-5 mb-2>{{ state.orgName }}</p>
              <p>教师类型： {{ belongAreaTypeOptions[state.type].label }}</p>
              <p>
                导入失败
                <span text-error>{{ state.excelImportRateVO.failImport }}</span>
                名教师
              </p>
            </div>

            <n-progress :stroke-width="8" style="width: 70px" type="circle" status="error" :percentage="100">
              <icon-carbon:close text-error text-12 />
            </n-progress>
          </div>
        </n-card>
      </div>
      <div v-if="state.failReasonVOS.length" flex-1 ml-4>
        <p flex justify-between mb-3>
          <span text-bolder text-4>失败原因</span>
          <span text-primary cursor-pointer @click="handleDownload">下载导入失败教师</span>
        </p>
        <n-table>
          <thead>
            <tr>
              <th>失败行数</th>
              <th>导入失败原因</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in state.failReasonVOS" :key="index">
              <td>{{ item.row }}</td>
              <td>{{ item.reason }}</td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, ref } from 'vue';
import { downloadFile } from '@common/utils/file/download';
// hooks
import { useModalInner } from '@common/components/custom/Modal';
// api
import { exportExcelError1, exportExcelError2, exportExcelError3 } from '@/api/information/teacher';
// static
import { belongAreaTypeOptions } from '../../common.data';

const emits = defineEmits(['onSuccess', 'register']);

const [register, { changeLoading, closeModal }] = useModalInner(data => {
  Object.assign(state, data);
});

const origin = {
  failReasonVOS: [],
  excelImportRateVO: null,
  returnDataList: [],
  orgName: null,
  type: 0 // 0, 内地身份证 1,内地无身份证 2外地
};
const formRef = ref();
const state = reactive({ ...origin });

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};

function reset() {
  Object.assign(state, origin);
  formRef.value?.restoreValidation();
}
function onClose() {
  closeModal();
  emits('onSuccess');
}
async function handleDownload() {
  changeLoading();
  try {
    const api = state.type == 0 ? exportExcelError1 : state.type == 1 ? exportExcelError2 : exportExcelError3;
    const res = await api(state.returnDataList);
    res && downloadFile(res.data, '教师导入失败信息表', 'xlsx');
  } catch (e) {
    window.$message.error('请检查文件并重新上传');
  } finally {
    changeLoading(false);
  }
}
</script>
