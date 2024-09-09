<template>
  <select-app path="/examine/task-list" :list="appList_task" />
</template>

<script setup>
import SelectApp from '../components/selectApp/index.vue';
import { appList_task } from '../common.data';
</script>
