<template>
  <basic-modal
    v-bind="$attrs"
    title="新增设备"
    class="w-600px"
    :mask-closable="false"
    @register="register"
    @ok="handleSubmit"
    @visible-change="visibleChange"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="state"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        label-align="right"
        require-mark-placement="left"
        :style="{
          maxWidth: '640px'
        }"
      >
        <n-form-item label="设备类型:" path="equipmentTypeId">
          <dropdown-select
            ref="equipmentTypes"
            v-model:value="state.equipmentTypeId"
            placeholder="请选择设备类型"
            label-field="name"
            value-field="id"
            :list-api="getEquipmentTypeList"
          />
        </n-form-item>
        <n-form-item label="设备厂商:" path="equipmentVendorId">
          <dropdown-select
            ref="equipmentVendors"
            v-model:value="state.equipmentVendorId"
            label-field="vendorName"
            value-field="id"
            placeholder="请选择设备厂商"
            :list-api="getEquipmentVendorList"
          />
        </n-form-item>
        <n-form-item label="设备型号:" path="equipmentModelId">
          <dropdown-select
            ref="equipmentModels"
            v-model:value="state.equipmentModelId"
            :params="{ deviceTypeId: state.equipmentTypeId, deviceVendorId: state.equipmentVendorId }"
            :disabled="disabledModel"
            :init="false"
            label-field="equipmentModel"
            value-field="id"
            placeholder="请选择设备型号"
            :list-api="getEquipmentModelList"
          />
        </n-form-item>
        <n-form-item label="序列号:">
          <n-input v-model:value="state.serialNumber" show-count maxlength="100" placeholder="请输入设备序列号" />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick, watch } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';

import { useUserStore } from '@/store';

import {
  getEquipmentTypeList,
  getEquipmentVendorList,
  getEquipmentModelList,
  AddOrgEquipment
} from '@common/api/examine/task';

const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['blur', 'change'] };
const rules = {
  equipmentModelId: { ...rbi, message: '请选择设备型号' },
  equipmentTypeId: { ...rbc, message: '请选择设备类型' },
  equipmentVendorId: { ...rbc, message: '请选择设备厂商' },
  serialNumber: { ...rbc, message: '请输入序列号' }
};

const emits = defineEmits(['onSuccess', 'register']);

const {
  userInfo: { orgId }
} = useUserStore();

const equipmentTypes = ref();
const equipmentVendors = ref();
const equipmentModels = ref();
const [register, { closeModal, changeLoading }] = useModalInner();

const formRef = ref(null);
const initForm = {
  equipmentTypeId: null,
  equipmentVendorId: null,
  equipmentModelId: null,
  serialNumber: null
};

const disabledModel = ref(true);

const state = reactive({ ...initForm });

async function visibleChange(visible) {
  await nextTick();
  visible ? onDataReceive() : resetForm();
}

function resetForm() {
  Object.assign(state, initForm);
}

function onDataReceive() {
  equipmentTypes.value.getOptions();
  equipmentVendors.value.getOptions();
}

function handleSubmit() {
  formRef.value.validate(async err => {
    const { equipmentTypeId, equipmentVendorId, equipmentModelId } = state;
    const equipmentType = equipmentTypes.value.options.find(v => v.id === equipmentTypeId)?.name;
    const equipmentVendor = equipmentVendors.value.options.find(v => v.id === equipmentVendorId)?.vendorName;
    const equipmentModel = equipmentModels.value.options.find(v => v.id === equipmentModelId)?.equipmentModel;
    if (!err) {
      changeLoading(true);
      try {
        await AddOrgEquipment({ ...state, equipmentType, equipmentVendor, equipmentModel, orgId });
        closeModal();
        window.$message.success('新增成功');
        emits('onSuccess');
      } finally {
        changeLoading(false);
      }
    }
  });
}

watch([() => state.equipmentTypeId, () => state.equipmentVendorId], () => {
  const { equipmentTypeId, equipmentVendorId } = state;
  state.equipmentModelId = null;
  if (equipmentTypeId && equipmentVendorId) {
    setTimeout(() => {
      disabledModel.value = false;
      equipmentModels.value.getOptions();
    });
  }
});
</script>
