<template>
  <n-cascader
    v-bind="$attrs"
    placeholder="请选择"
    :options="areaTree"
    label-field="regionName"
    value-field="regionId"
    show-path
    remote
  />
</template>
<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/store';

const {
  // userInfo: { regionList },
  getAreaTree
} = useUserStore();

const areaTree = computed(() => {
  let queue = JSON.parse(JSON.stringify(getAreaTree));
  return queue;

  // TODO: 运维端去掉管理地区，产品说后续再考虑补充
  // const regList = [...regionList];
  // const areaTree = [];
  // let node;
  // while ((node = queue.shift())) {
  //   if (!regList.length) break;
  //   let index = regList.findIndex(v => v == node.regionId);
  //   if (index !== -1) {
  //     areaTree.push(node);
  //     regList.splice(index, 1);
  //     continue;
  //   }
  //   if (node?.children) {
  //     node.children.forEach(v => {
  //       queue.push(v);
  //     });
  //   }
  // }
  // return areaTree;
});
</script>
