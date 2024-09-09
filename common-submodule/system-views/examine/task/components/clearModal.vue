<template>
  <basic-modal
    v-bind="$attrs"
    class="w-600px"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    @register="register"
    @visible-change="visibleChange"
  >
    <span v-if="!screenOptionList.length">该学生暂无需清除的筛查类目</span>
    <n-space v-else vertical>
      <n-checkbox v-model:checked="checkAllRaido" :indeterminate="halfCheck" @click="checkAll"> 全选 </n-checkbox>
      <n-checkbox-group v-model:value="checkRaido">
        <n-space>
          <n-checkbox
            v-for="info in screenOptionList"
            :key="info.screeningTypeId"
            :value="info.screeningTypeId"
            :label="info.screeningTypeName"
          />
        </n-space>
      </n-checkbox-group>
      <n-space class="mt-5" justify="center">
        <n-button type="primary" @click="handleClick()">确定</n-button>
      </n-space>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { object } from 'vue-types';
import { useModalInner } from '@common/components/custom/Modal';

import { clearStuData, clearScreenType } from '@common/api/examine/task';

defineProps({
  userData: object().def({})
});
// / setProps, closeModal,
const [register, { changeLoading, closeModal }] = useModalInner(data => {
  if (data) {
    Object.assign(stuInfo, data);
    onDataReceive();
  }
});
// emit
const emit = defineEmits(['onSuccess', 'register']);

const stuInfo = reactive({});
const checkAllRaido = ref(false);
const checkRaido = ref([]);
const screenOptionList = ref([]);

const halfCheck = computed(() => {
  return !!(checkRaido.value.length && screenOptionList.value.length !== checkRaido.value.length);
});

watch([() => checkRaido.value], () => {
  checkAllRaido.value = !!checkRaido.value?.length;
});
const checkAll = () => {
  if (!checkAllRaido.value) {
    checkRaido.value = [];
  } else {
    checkRaido.value = screenOptionList.value.map(ele => ele.screeningTypeId);
  }
};
function visibleChange(visible) {
  !visible && resetForm();
}
const resetForm = () => {
  checkRaido.value = [];
  checkAllRaido.value = false;
};

async function onDataReceive() {
  changeLoading();
  try {
    screenOptionList.value = await clearScreenType(stuInfo);
  } catch (error) {
  } finally {
    changeLoading(false);
  }
}
async function handleClick() {
  if (!checkRaido.value?.length) {
    window.$message.warning('请选择需要清除数据的筛查类目');
    return;
  }
  changeLoading();
  try {
    await clearStuData({ ...stuInfo, screeningTypeIds: checkRaido.value.join(',') });
    window.$message.success('数据清除成功');
    emit('onSuccess');
    closeModal();
  } catch (error) {
  } finally {
    changeLoading(false);
  }
}
</script>
