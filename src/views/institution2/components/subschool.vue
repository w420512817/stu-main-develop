<template>
  <n-space vertical class="w-full">
    <p class="bg-info_active border border-primary text-primary p-1 flex items-center">
      <icon-clarity:info-standard-line class="text-4" />
      <n-text class="text-primary">
        下级学校只能是“独立学校”或“附属校区”；2.必须先建立“独立学校”或“附属校区”，才能新增关联。
      </n-text>
    </p>
    <div class="flex">
      <n-button v-auth="1014" class="my-2" type="primary" @click="openModal(true, query)">新增下级学校</n-button>
    </div>

    <n-data-table remote :loading="loading" :columns="columns" :data="dataSource" />
    <AddSubSchool @register="register" @on-success="getDataSource" />
  </n-space>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
// api
import { removeChildSchool, orgChildList } from '@/api/institution2';
// hooks
import useApi from '@common/hooks/business/useApi';
// static data
import { createSubSchoolColumns } from './components.data';
import { AC_DELETE } from '@common/enum/pageEnum';
import { useModal } from '@common/components/custom/Modal';

import AddSubSchool from '../modal/AddSubSchool.vue';

const query = inject('query');

const dataSource = ref([]);
const columns = createSubSchoolColumns((key, row) => onClickBtn(key, row));
const [register, { openModal }] = useModal();
const { fetch: getList, loading: loading } = useApi(orgChildList);

function onClickBtn(key, row) {
  switch (key) {
    case AC_DELETE:
      if (query.orgProperty == 3 && row.orgProperty == 2) {
        window.$notification.warning('附属校区无法移除');
        return;
      }
      secondConfirm(row);
      break;
  }
}
function secondConfirm(row) {
  window.$dialogError('是否移除下级学校？', () => {
    return removeChildSchool({ id: row.id }).then(() => {
      window.$message.success('移除成功');
      getDataSource();
    });
  });
}
async function getDataSource() {
  const params = {
    id: query.id,
    orgProperty: query.orgProperty
  };

  const data = await getList(params);
  dataSource.value = data ? data : [];
}

onMounted(() => {
  getDataSource();
});
</script>

<style scoped></style>
