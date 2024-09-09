<template>
  <basic-modal v-bind="$attrs" class="w-600px" @register="register" @visible-change="visibleChange" @ok="onSure">
    <n-space vertical b-t b-b b-gray-200>
      <n-form ref="formRef" :model="formValue" label-placement="left" label-width="auto" require-mark-placement="left">
        <n-form-item label="申请类型:" path="">
          <p>{{ formValue.changeType == 1 ? '更改姓名' : '更改身份证' }}</p>
        </n-form-item>
        <n-form-item label="申请内容:" path="">
          <p>
            {{ formValue.applicationContent }}
            <span color-red-6>{{ formValue.originalField }}</span> 更改为
            <span color-red-6>{{ formValue.currentField }}</span>
          </p>
        </n-form-item>
        <div v-if="formValue.key == AC_DETAILS">
          <n-form-item label="状态:" path="">
            <p>{{ formValue.approvalStatus == 1 ? '已通过' : '已驳回' }}</p>
          </n-form-item>
          <n-form-item label="审核人:" path="">
            <p>{{ formValue.operatorName }}</p>
          </n-form-item>
        </div>
        <n-form-item v-else label="申请人:" path="">
          <p>{{ formValue.proposerName }}</p>
        </n-form-item>
      </n-form>
    </n-space>
    <template v-if="formValue.key == AC_DETAILS" #action>
      <n-button ml-450px w-70px @click="closeCheck">关闭</n-button>
    </template>
  </basic-modal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { AC_DETAILS } from '@common/enum/pageEnum';
// api
import { editStatus } from '@/api/approve/studentApprove';

const emits = defineEmits(['onSuccess', 'register']);
const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(data => {
  Object.assign(formValue, data);
});

const origin = {
  id: null, // 申请id
  changeType: null,
  applicationContent: null,
  originalField: null,
  currentField: null,
  proposerName: null, // 申请人
  operatorName: null, // 审核人
  approvalStatus: null // 通过 拒绝 状态： 1-已通过 2-待审核 3-已驳回
};

const formRef = ref();
const formValue = reactive({ ...origin });

async function onSure() {
  changeLoading(true);
  changeOkLoading(true);
  try {
    await editStatus({ ...formValue });
    closeModal();
    window.$message.success('操作成功');
    emits('onSuccess');
  } finally {
    changeLoading(false);
    changeOkLoading(false);
  }
}

// 查看关闭按钮
function closeCheck() {
  closeModal();
}
</script>
