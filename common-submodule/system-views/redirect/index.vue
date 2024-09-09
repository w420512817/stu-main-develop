<template>
  <div></div>
</template>

<script setup>
import { unref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { decodeByBase64 } from '@common/utils/common/cipher';

const userStore = useUserStore();
const { currentRoute, replace } = useRouter();
const { query } = unref(currentRoute);

if (Reflect.has(query, 'token')) {
  const token = decodeByBase64(query.token);
  userStore.setToken(token);
}

if (Reflect.has(query, 'customerId')) {
  userStore.setCustomerId(query.customerId);
}

replace({ path: query.path || '/' });
</script>
