<template>
  <basic-modal v-bind="$attrs" class="w-600px" @register="register" @visible-change="visibleChange" @ok="okClick()">
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="state"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        :style="{
          maxWidth: '640px'
        }"
      >
        <n-form-item label="学生应筛数" path="screenNum">
          <n-input-number v-model:value="state.screenNum" :precision="0" :min="state.minNum" placeholder="学生应筛数" />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue';
import { object, bool } from 'vue-types';
import { useModalInner } from '@common/components/custom/Modal';
import { updateScreenNum } from '@common/api/examine/plan';

let props = defineProps({
  useData: object().def({}),
  isEdit: bool().def(false)
});
const emits = defineEmits(['addSuccess', 'register']);
const formRef = ref(null);
const [register, { closeModal, changeOkLoading }] = useModalInner(data => {
  data && onDataReceive(data);
});
const rbi = { required: true, trigger: ['blur', 'input'] };
let rules = {
  screenNum: { ...rbi, message: '请输入学生应筛数', type: 'number' }
};
let state = reactive({
  minNum: 0,
  screenNum: 0,
  isEdit: false
});
async function visibleChange(visible) {
  if (visible) {
    await nextTick();
    if (props.useData.screenNum) {
      state.minNum = props.useData.screenNum * 1;
      state.screenNum = props.useData.screenNum * 1;
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
      updateScreenNum({
        planId: props.useData.planId,
        screenNum: state.screenNum
      })
        .then(() => {
          state.screenNum = 0;
          window.$message.success('操作成功!');
          emits('addSuccess');
          closeModal();
        })
        .finally(() => {
          changeOkLoading(false);
        });
    }
  });
}
</script>
