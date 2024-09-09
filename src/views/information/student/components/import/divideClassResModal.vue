<template>
  <basic-modal
    v-bind="$attrs"
    class="w-800px"
    title="请确认分班的学生"
    :closable="false"
    :mask-closable="false"
    @register="register"
    @ok="handleClose"
    @cancel="closeModalFn"
  >
    <n-data-table :data="data" class="h-300px" flex-height :columns="columns" :render-cell="v => v || '/'" />
  </basic-modal>
</template>

<script setup>
import { ref } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { studentDivide } from '@/api/information/student';

const [register, { changeLoading, closeModal }] = useModalInner(v => {
  data.value = v.stuList;
  taskId = v.taskId;
});
const data = ref([]);
let taskId;

let idCardType = {
  0: '无',
  1: '身份证',
  2: '护照',
  6: '护照',
  7: '护照',
  8: '护照',
  9: '护照'
};
const columns = [
  { key: 'studentName', title: '姓名', align: 'center' },
  {
    key: 'idCardTypeName',
    title: '证件类型',
    align: 'center',
    render(row) {
      return idCardType[row.idCardType] || '/';
    }
  },
  { key: 'idCard', title: '证件号', width: 180, align: 'center' },
  { key: 'originalGradeName', title: '原年级', align: 'center' },
  { key: 'originalClassName', title: '原班级', align: 'center' },
  { key: 'gradeName', title: '转入年级', align: 'center' },
  { key: 'className', title: '转入班级', align: 'center' }
];

async function handleClose() {
  try {
    changeLoading(true);
    await studentDivide({ divideClassStdVOS: data.value, taskId, cancel: 0 });
    window.$message.success('操作成功');
    closeModal();
  } finally {
    changeLoading(false);
  }
}

function closeModalFn() {
  closeModal();
  studentDivide({ divideClassStdVOS: data.value, taskId, cancel: 1 });
}
</script>
