<template>
  <basic-modal
    v-bind="$attrs"
    class="w-450px"
    title="导入结果"
    :show-cancel-btn="false"
    ok-text="关闭"
    :mask-closable="false"
    @register="register"
    @visible-change="visibleChange"
    @ok="onClose"
    @cancel="onClose"
  >
    <div>
      <div v-if="state.excelImportRateVO" mb-4>
        <n-card border border-gray-100>
          <!--导入结果-成功与失败-->
          <div v-if="state.excelImportRateVO.successImport">
            <p text-5 mb-2>{{ importObj.typeName }}信息</p>
            <p>
              新增
              <span text-error>{{ state.excelImportRateVO.successImport }}</span>
              个{{ importObj.typeName }}, 导入失败
              <span text-error>{{ state.excelImportRateVO.failImport }} </span>
              个{{ importObj.typeName }}
            </p>
          </div>
          <!--导入全部失败-->
          <div v-else>
            <p text-5 mb-2>{{ importObj.typeName }}信息</p>
            <p>
              导入失败
              <span text-error>{{ state.excelImportRateVO.failImport }}</span>
              个{{ importObj.typeName }}信息
            </p>
          </div>
        </n-card>
      </div>
      <div v-if="state.failReasonVOS.length">
        <p flex justify-between mb-3>
          <span text-bolder text-4>失败原因</span>
          <span text-primary cursor-pointer @click="handleDownload">下载导入失败数据</span>
        </p>
        <n-table>
          <thead>
            <tr>
              <th>失败行数</th>
              <th>失败原因</th>
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
import { reactive, nextTick } from 'vue';
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
  Object.assign(state, data);
});

const origin = {
  failReasonVOS: [],
  excelImportRateVO: null,
  returnDataList: []
};
const state = reactive({ ...origin });

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};

function reset() {
  Object.assign(state, origin);
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
