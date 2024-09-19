<template>
  <div class="login-bg flex-center md:justify-end wh-full">
    <n-card size="large" class="w-430px md:mr-[200px]">
      <template #header>
        <h3 text="center primary 7">
          {{ title }}
        </h3>
      </template>
      <div mt-4>
        <login-form />
      </div>
    </n-card>
  </div>
</template>

<script setup>
import LoginForm from './components/LoginForm.vue';
import { getAppEnv } from '@common/utils/common/env';

const { VITE_APP_TITLE: title } = getAppEnv();
</script>

<style scoped>
.login-bg {
  background: url('@/assets/image/login-bg.jpg') no-repeat;
  background-size: 100% 100%;
}
</style>
