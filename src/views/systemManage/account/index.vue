<template>
  <n-card title="账户列表" class="h-full shadow-sm">
    <n-tabs v-if="govLevel" type="line">
      <n-tab-pane v-if="govLevel == 1" name="1" tab="省级账号">
        <tableVue :key="resetI" :gov-level="1" @open-modal="showAccountModa" />
      </n-tab-pane>
      <n-tab-pane v-if="govLevel && govLevel <= 2" name="2" tab="市级账号">
        <tableVue :key="resetI" :gov-level="2" @open-modal="showAccountModa" />
      </n-tab-pane>
      <n-tab-pane v-if="govLevel && govLevel <= 3" name="3" tab="县（市、区）级账号">
        <tableVue :key="resetI" :gov-level="3" @open-modal="showAccountModa" />
      </n-tab-pane>
      <n-tab-pane v-if="govLevel" name="4" tab="学校账号">
        <tableVue :key="resetI" :gov-level="4" @open-modal="showAccountModa" />
      </n-tab-pane>
    </n-tabs>
    <tableVue v-else :key="resetI" :gov-level="!govLevel ? 4 : govLevel" @open-modal="showAccountModa" />
    <Modal @register="register" @on-success="resetI += 1" />
  </n-card>
</template>

<script setup>
import { ref } from 'vue';
import tableVue from './components/accountList.vue';
import Modal from './components/modal.vue';
import { useUserStore } from '@/store';
import { useModal } from '@common/components/custom/Modal';

const [register, { openModal }] = useModal();

const {
  userInfo: { govLevel }
} = useUserStore();
const resetI = ref(1);
function showAccountModa(row) {
  openModal(true, row);
}
</script>
