<template>
  <basic-modal v-bind="$attrs" class="w-600px" @register="register" @ok="goPrint()" @after-leave="handleClose">
    <n-space vertical>
      <n-checkbox v-model:checked="checkAllRaido" :indeterminate="halfCheck" @click="checkAll"> 全选 </n-checkbox>
      <template v-for="(item, i) in classInfoList" :key="i">
        <n-card :title="`${item.gradeName}（${item.classYear}级）`" size="small" :bordered="false">
          <n-checkbox-group v-model:value="checkRaido">
            <n-space>
              <n-checkbox
                v-for="info in item.classList"
                :key="info.classId"
                :value="info.classId"
                :label="info.className"
                :disabled="info.disabled === 1"
              />
            </n-space>
          </n-checkbox-group>
        </n-card>
      </template>
    </n-space>
    <PrintViewModal title="打印登记表预览" @register="registerPrintView" />
  </basic-modal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import { object } from 'vue-types';
import { useModalInner, useModal } from '@common/components/custom/Modal';

import { getRegisterFileName } from '@common/api/common/index';
import { getRegisterClassList } from '@common/api/examine/task';

import PrintViewModal from './printViewModal.vue';

defineProps({
  userData: object().def({})
});
// / setProps, closeModal,
const [register, { changeLoading }] = useModalInner(data => {
  data && onDataReceive(data);
});

const [registerPrintView, { openModal: openModalPrintView }] = useModal();

const state = reactive({});
const fileInfo = reactive({});
const classInfoList = ref([]);
const checkAllRaido = ref(false);
const checkRaido = ref([]);

const allClassIds = computed(() => {
  let allIds = []; // 所有
  let clsIds = []; // 除了disabled外的所有
  classInfoList?.value.map(item => {
    item?.classList?.map(info => {
      allIds.push(info.classId);
      !info.disabled && clsIds.push(info.classId);
    });
  });
  return { allIds, clsIds };
});
const halfCheck = computed(() => {
  if (checkRaido.value?.length) {
    return allClassIds.value.allIds.length !== checkRaido.value.length;
  }
  return false;
});
watch(
  () => checkRaido.value.length,
  () => {
    checkAllRaido.value = !!checkRaido.value?.length;
  }
);

const handleClose = () => {
  console.log('关闭弹窗');
  console.log(checkRaido, 'checkRaido');
  checkRaido.value = [];
};

const checkAll = () => {
  if (!checkAllRaido.value) {
    checkRaido.value = [];
  } else {
    checkRaido.value = cloneDeep(allClassIds.value.clsIds);
  }
};
const onDataReceive = async data => {
  Object.assign(state, data);
  const { taskId, appGroupId } = data;
  changeLoading(true);
  try {
    classInfoList.value = await getRegisterClassList({ taskId });
    const data = await getRegisterFileName({ appGroupId });
    Object.assign(fileInfo, data);
  } catch (error) {
  } finally {
    changeLoading(false);
  }
};
function goPrint() {
  if (!checkRaido.value?.length) {
    window.$message?.error('请选择班级！');
    return;
  }
  const { taskId } = state;
  const { fileName, imgName } = fileInfo;
  openModalPrintView(true, { fileName, imgName, taskId, ids: checkRaido.value.join(',') });
}
</script>
