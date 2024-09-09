<template>
  <basic-modal v-bind="$attrs" class="w-600px" @register="register" @visible-change="visibleChange" @ok="okClick()">
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="state"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        :style="{
          maxWidth: '640px'
        }"
      >
        <n-form-item v-if="!state.isSingal" label="开关设置">
          <n-switch v-model:value="state.status" :checked-value="1" :unchecked-value="0" />
        </n-form-item>
        <n-form-item label="选择学段">
          <n-checkbox-group v-model:value="state.prefx" :disabled="!state.status && !state.isSingal">
            <n-space item-style="display: flex;">
              <n-checkbox
                v-for="item in state.myPrefixList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </n-space>
          </n-checkbox-group>
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue';
import { object, bool } from 'vue-types';
import { useModalInner } from '@common/components/custom/Modal';
import { editPlanJurisdiction, getPlanJurisdiction, editSchoolJurisdiction } from '@common/api/examine/plan';
import { prefixList } from '../index.data.jsx';
let props = defineProps({
  useData: object().def({}),
  isEdit: bool().def(false)
});
const emits = defineEmits(['addSuccess', 'register']);
const formRef = ref(null);
const [register, { closeModal, changeOkLoading }] = useModalInner(data => {
  data && onDataReceive(data);
});
let state = reactive({
  isSingal: false,
  myPrefixList: [],
  status: '',
  prefx: [],
  id: '',
  isEdit: false
});
async function visibleChange(visible) {
  if (visible) {
    await nextTick();
    state.id = '';
    state.isSingal = false;
    if (props.useData.planId) {
      state.myPrefixList = prefixList;
      changeOkLoading();
      getPlanJurisdiction({
        planId: props.useData.planId
      })
        .then(d => {
          state.id = d.id;
          state.status = d.status;
          state.prefx = d ? d.prefx.split(',').map(v => v * 1) : [];
        })
        .finally(() => {
          changeOkLoading(false);
        });
    } else if (props.useData.id || props.useData.rowKeys) {
      state.isSingal = true;
      state.id = props.useData.rowKeys ? props.useData.rowKeys.join(',') : props.useData.id;
      if (props.useData.prefix) {
        state.myPrefixList = [];
        let arr = props.useData.prefix.split(',');
        arr.forEach(v => {
          prefixList.forEach(vv => {
            if (v == vv.value) {
              state.myPrefixList.push(vv);
            }
          });
        });
      }
      if (props.useData.validPrefix) {
        state.status = 1;
        state.prefx = props.useData.validPrefix.split(',').map(v => v * 1);
      }
    }
  }
}
function onDataReceive(data) {
  console.log('Data Received', data);
}
function okClick() {
  formRef.value?.validate(errors => {
    if (!errors) {
      changeOkLoading();
      if (props.useData.planId) {
        editPlanJurisdiction({
          id: state.id,
          status: state.status,
          prefx: state.prefx.join(',')
        })
          .then(() => {
            state.status = '';
            state.prefx = [];
            window.$message.success('操作成功!');
            emits('addSuccess');
            closeModal();
          })
          .finally(() => {
            changeOkLoading(false);
          });
      } else if (props.useData.id || props.useData.rowKeys) {
        changeOkLoading();
        let unChexk = [];
        state.myPrefixList.forEach(v => {
          if (state.prefx.indexOf(v.value * 1) == -1) {
            unChexk.push(v.value);
          }
        });
        editSchoolJurisdiction({
          id: state.id,
          validPrefix: state.prefx.join(','),
          invalidPrefix: unChexk.join(',')
        })
          .then(() => {
            state.status = '';
            state.prefx = [];
            window.$message.success('操作成功!');
            emits('addSuccess');
            closeModal();
          })
          .finally(() => {
            changeOkLoading(false);
          });
      }
    }
  });
}
</script>
