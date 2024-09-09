<template>
  <q-card h-full>
    <template v-if="panelData.length">
      <n-grid :x-gap="24" :y-gap="24" :cols="4">
        <n-gi v-for="item in panelData" :key="item.key">
          <panel
            class="light-green"
            :title="item.title"
            :color="item.color"
            :bg-image="item.bgImage"
            :line-color="item.lineColor"
            @on-click="handleClick(item)"
          />
        </n-gi>
      </n-grid>
    </template>
    <div v-else h-full flex-col-center>
      <img src="@/assets/image/dashbord/page-empty.png" alt="暂无信息" />
      <p mt-20px text-16px class="color-[#333]">暂无信息</p>
    </div>
  </q-card>
</template>

<script setup>
import panel from './components/panel.vue';
import QCard from '@common/qd-components/QCard/index.vue';

import { data } from './index.data';
import { usePermission } from '@common/hooks/business/usePermission';
import { isLocalMode } from '@common/utils/common/env';
import { useUserStore } from '@/store';

const { hasPermission } = usePermission();
const panelData = data.filter(item => hasPermission(item.resourcId));
const userStore = useUserStore();

const handleClick = ({ devPort, prodPath, title }) => {
  const { host, hostname } = window.location;

  if (!devPort || !prodPath) {
    window.$message.error(`【${title}】 未启用，请确认！`);
    return;
  }
  const goUrl = isLocalMode() ? `//${hostname}:${devPort}/#/redirect` : `//${host}${prodPath}/#/redirect`;
  window.location.href = goUrl + `?customerId=${userStore.customerId}`;
};
</script>

<style scoped lang="less"></style>
