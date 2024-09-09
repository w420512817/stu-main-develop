<template>
  <basic-modal
    v-bind="$attrs"
    title="批量导出"
    class="w-600px"
    ok-text="确定"
    @ok="handleOk"
    @register="register"
    @after-leave="close"
  >
    <div class="pl-20px">
      <div class="mb-4">
        <n-checkbox :checked="state.checked" :indeterminate="state.indeterminate" @click="allS"> 全选 </n-checkbox>
      </div>
      <n-form-item ref="form" :show-label="false" :rule="rule">
        <n-checkbox-group v-model:value="state.checkedArr" @update:value="handleUpdateValue">
          <n-space item-style="display: flex;" align="center">
            <n-checkbox v-for="(item, i) in options" :key="i" :value="item.value" :label="item.label" />
          </n-space>
        </n-checkbox-group>
      </n-form-item>
    </div>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, inject } from 'vue';
import { useUserStore } from '@/store';
import { useModalInner } from '@common/components/custom/Modal';
import { cloneDeep } from 'lodash-es';
import { exportSocialList, exportHospitalList, exportSchoolList } from '@/api/institution';
import { downloadByData } from '@common/utils/file/download';

const userStore = useUserStore();
const [register, { closeModal, changeLoading }] = useModalInner();
const props = inject('state');
const options = [
  { label: '学校', value: '1', api: exportSchoolList },
  { label: '医院', value: '2', api: exportHospitalList },
  { label: '社会机构', value: '3', api: exportSocialList }
];

const initForm = {
  checkedArr: ['1', '2', '3'],
  indeterminate: false,
  checked: true
};
const state = reactive(cloneDeep(initForm));
const form = ref();
const rule = {
  message: '请选择',
  trigger: ['input', 'change'],
  validator() {
    return state.checkedArr.length ? undefined : new Error('请选择');
  }
};

function handleUpdateValue() {
  state.indeterminate = state.checkedArr.length && state.checkedArr.length !== options.length;
  state.checked = state.checkedArr.length === options.length;
}

function allS() {
  let res = [];
  if (!state.checked) {
    res = options.map(v => v.value);
  }
  state.checkedArr = res;
  handleUpdateValue();
}

function close() {
  Object.assign(state, cloneDeep(initForm));
}

async function handleOk() {
  await form.value.validate();
  changeLoading(true);
  let { areaId, govLevel } = userStore.userInfo;
  let params = {
    areaId: props.cityId || areaId,
    level: props.cityId ? govLevel + 1 : govLevel
  };
  let apiArr = state.checkedArr.map(item => {
    return options.find(v => v.value === item).api(params);
  });
  try {
    let res = await Promise.allSettled(apiArr);
    console.log(res);
    res.forEach(item => {
      let str = item.value.headers['content-disposition'].split(';')[1].split('=')[1];
      let fileName = decodeURIComponent(str);
      downloadByData(item.value.data, fileName);
    });
    closeModal();
  } finally {
    changeLoading(false);
  }
}
</script>
