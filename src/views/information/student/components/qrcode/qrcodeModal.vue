<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    class="w-800px"
    title="打印学生二维码"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <div relative>
      <n-grid cols="2" x-gap="40">
        <n-gi text-3>
          <h1 font-bold mb-3 text-4>打印预览</h1>
          <n-tabs v-model:value="curTab" type="segment" size="small" @update:value="updateTab">
            <n-tab v-for="(item, index) in tabsOptions" :key="index" :name="index">样式{{ index + 1 }} </n-tab>
          </n-tabs>
          <!-- <p class="mt-3">尺寸 ： 200*100px</p> -->
          <n-button type="primary" class="my-3" @click="handlePrivew()">预览登记表</n-button>

          <p>注：</p>
          <p>1.学生二维码长期有效，若修改了学生的身份证、护照号、出生日期、性别，则需重新生成二维码；</p>
          <p>2.模拟数据仅供参考。</p>
        </n-gi>
        <n-gi>
          <n-form ref="formRef" :rules="rules" :model="formValue" label-placement="left">
            <p class="text-warning flex items-center">
              <icon-carbon:warning />为减少您等待的时间，建议您勾选一个班级。
            </p>
            <n-form-item v-if="!formValue.checkRow.length" label="打印班级:" path="classIdList">
              <n-tree
                v-model:checked-keys="formValue.classIdList"
                cascade
                block-line
                :default-expand-all="true"
                :data="formValue.collapseData"
                checkable
                key-field="key"
                label-field="label"
                @update:checked-keys="updateClassIdList"
              />
            </n-form-item>
            <n-form-item v-else label="学生姓名:">
              <template v-if="formValue.checkRow.length < 5">
                <span v-for="(item, index) in formValue.checkRow" :key="index">
                  {{ item.split('-')[1] }}&nbsp;&nbsp;
                </span>
              </template>
              <template v-else>已选{{ formValue.checkRow.length }}名学生</template>
            </n-form-item>
          </n-form>
        </n-gi>
      </n-grid>
      <div class="-z-1 top-0 left-0 h-0 relative overflow-hidden">
        <div ref="printDom">
          <AsyncComponent ref="AsyncComponentRef" :list="studentList" />
        </div>
      </div>
    </div>
    <qrcodePreview ref="previewAsyncCompRef" @register="registerPreviewModal" />
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, ref } from 'vue';
// hooks
import { useModalInner } from '@common/components/custom/Modal';
import { useModal } from '@common/components/custom/Modal';
// api
import { printStudentInfo, getRegByAppGroupId, printSelectStudentInfo } from '@/api/information/student';

import printJS from 'print-js';
import qrcodePreview from './qrcodePreview.vue';
import AsyncComponent from './AsyncComponent.vue';

// const emits = defineEmits(['onSuccess', 'register']);

const [registerPreviewModal, { openModal: openPreviewModel }] = useModal();
const [register, { changeLoading }] = useModalInner(data => {
  Object.assign(formValue, data);
  getDengjibiao(data.accountOrgType == 20 ? data.accountOrgId : data.orgId); // 医院账户登录，查询医院的登记表
});

const origin = {
  checkRow: [],
  collapseData: [],
  orgId: null,
  accountOrgType: null,
  accountOrgId: null,
  checkGradeClassIds: null,
  classIdList: []
};

const rules = {
  classIdList: {
    trigger: 'blur',
    required: true,
    type: 'array',
    key: 'classIdList',
    validator: function (rule, arr) {
      if (formValue.checkRow?.length) return true;
      if (!arr?.length) return new Error('请选择一个班级');
      // else if (arr?.length > 1) return new Error('只能选择一个班级');
      else return true;
    }
  }
};
const previewAsyncCompRef = ref();
const AsyncComponentRef = ref();
const printDom = ref();
const formRef = ref();
const formValue = reactive({ ...origin });
const tabsOptions = ref([]);
const studentList = ref([]);
const curTab = ref(0);
const selDengjibiao = ref(null);
let messageReactive = null;

const handlePrivew = async () => {
  openPreviewModel();
  await nextTick();
  previewAsyncCompRef.value.setComponets(selDengjibiao);
};
const updateTab = index => {
  selDengjibiao.value = tabsOptions.value.find((d, i) => i == index);
};

const getDengjibiao = async orgId => {
  const data = await getRegByAppGroupId({ orgId });
  if (!data) return;
  tabsOptions.value = data;
  selDengjibiao.value = tabsOptions.value[0];
};
const updateClassIdList = val => {
  formValue.classIdList = val;

  formRef.value?.validate(
    errors => {
      if (errors) return;
    },
    rule => {
      return rule?.key === 'classIdList';
    }
  );
};

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};
function onSure() {
  formRef.value.validate(errors => {
    if (!errors) {
      getStudents();
    } else {
      throw new Error('表单验证错误');
    }
  });
}
/**
 * 添加、编辑
 */
async function getStudents() {
  changeLoading(true);
  messageReactive = window.$message.loading('打印准备中......', { duration: 0 });
  // changeOkLoading(true);
  try {
    studentList.value = [];
    if (!formValue.checkRow?.length) {
      const { orgId, classIdList } = formValue;
      studentList.value = await printStudentInfo({ orgId, classIdList });
    } else {
      const ids = formValue.checkRow.map(d => d.split('-')[0]);
      studentList.value = await printSelectStudentInfo(ids);
    }
    if (!studentList.value?.length) {
      window.$message.error('班级暂无学生');
      return;
    }
    console.log(selDengjibiao);
    AsyncComponentRef.value.setAsyncComponent(selDengjibiao);

    startPrint();
  } catch (e) {
    console.log(e);
  } finally {
    if (messageReactive) {
      messageReactive.destroy();
      messageReactive = null;
    }
    changeLoading(false);
  }
}

async function startPrint() {
  await nextTick();
  setTimeout(() => {
    printJS({
      printable: printDom.value,
      type: 'html',
      targetStyles: ['*'],
      documentTitle: '学生二维码',
      onPrintDialogClose() {
        changeLoading(false);
        if (messageReactive) {
          messageReactive.destroy();
          messageReactive = null;
        }
      },
      onLoadingStart() {
        console.log('onLoadingStart');
      },
      onLoadingEnd() {
        changeLoading(false);
        if (messageReactive) {
          messageReactive.destroy();
          messageReactive = null;
        }
      }
    });
  }, 100);
}

function reset() {
  Object.assign(formValue, origin);
  formRef.value?.restoreValidation();
}
</script>
<style>
@media print {
}
</style>
