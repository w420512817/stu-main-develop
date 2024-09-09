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
              <p text-5 mb-2>{{ state.orgName }} {{ importObj.typeName }}信息</p>
              <p>
                新增
                <span text-error>{{ state.excelImportRateVO.successImport }}</span>
                个{{ importObj.typeName }}, 导入失败
                <span text-error>{{ state.excelImportRateVO.failImport }} </span>
                个{{ importObj.typeName }}
              </p>
            </div>

            <n-progress :stroke-width="8" style="width: 70px" type="circle" status="success" :percentage="100">
              <span text-success text-13px>100%</span>
            </n-progress>
          </div>
          <!--导入全部失败-->
          <div v-else flex justify-between>
            <div>
              <p text-5 mb-2>{{ state.orgName }}{{ importObj.typeName }}信息</p>
              <p>
                导入失败
                <span text-error>{{ state.excelImportRateVO.failImport }}</span>
                个{{ importObj.typeName }}
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
          <span text-primary cursor-pointer @click="handleDownload">下载导入失败{{ importObj.typeName }}</span>
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

import { importData } from './syncImport.data';

const props = defineProps({
  type: String
});
const importObj = reactive({ ...importData[props.type] });

const emits = defineEmits(['onSuccess', 'register']);

const [register, { changeLoading, closeModal }] = useModalInner(data => {
  console.log(data, 'orgName');
  Object.assign(state, data);
});

const origin = {
  failReasonVOS: [],
  excelImportRateVO: null,
  returnDataList: [],
  orgName: null
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
    const res = await importObj.exportErrorApi(state.returnDataList);
    res && downloadFile(res.data, `${importObj.typeName}导入失败信息表`, 'xlsx');
  } catch (e) {
    window.$message.error('请检查文件并重新上传');
  } finally {
    changeLoading(false);
  }
}
</script>
