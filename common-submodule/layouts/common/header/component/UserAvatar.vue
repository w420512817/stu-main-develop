<template>
  <n-dropdown :options="options" @select="handleDropdown">
    <hover-container class="px-3" :inverted="theme.header.inverted">
      <div flex-y-center>
        <icon-custom-avatar class="text-5 mr-2" />
        <div flex flex-col justify-center>
          <div>{{ userStore.userInfo?.realName }}</div>
          <div max-w-120px truncate>{{ userStore.userInfo?.orgName || '无机构信息' }}</div>
        </div>
        <icon-ion:arrow-down-b />
      </div>
    </hover-container>
  </n-dropdown>
</template>

<script setup>
import { theme } from '@common/settings/theme';
import { iconifyRender } from '@common/utils/common/icon';
import { useUserStore } from '@/store';

defineOptions({ name: 'UserAvatar' });

const userStore = useUserStore();
// TODO:去掉用户中心
const options = [
  // {
  //   label: '用户中心',
  //   key: 'user-center',
  //   icon: iconifyRender('carbon:user-avatar')
  // },
  // {
  //   type: 'divider',
  //   key: 'divider'
  // },
  {
    label: '退出登录',
    key: 'logout',
    icon: iconifyRender('carbon:logout')
  }
];

function handleDropdown(key) {
  if (key === 'logout') {
    window.$dialogInfo('您确定要退出登录吗？', () => {
      return userStore.logout();
    });
  }
}
</script>

<style scoped></style>
