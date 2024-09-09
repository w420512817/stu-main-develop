<template>
  <n-scrollbar class="mt-24px h-213px">
    <div class="backlog flex-col gap-y-3">
      <div
        v-for="item in backlogList"
        :key="item.tit"
        class="backlog-item text-14px px-4 py-6px flex"
        @click="handleClick(item)"
      >
        <span class="text-[#222] font-medium"> {{ item.typeName }} </span>
        <n-ellipsis class="text-[#666] mx-3 flex-1"> {{ item.backLog }} </n-ellipsis>
        <span class="text-[#777] h-21px flex-center">
          <icon-ci:dot-04-l class="text-[#FF5353] text-20px" />
          待处理
        </span>
      </div>
    </div>
    <Empty v-if="!backlogList.length" class="h-213px" emp-text="暂无待办事项" />
  </n-scrollbar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { backLog } from '@/api/dashbord/hosptial';
import Empty from '../empty.vue';
import { useGo } from '@common/hooks/usePage';

const { go } = useGo();
const backlogList = ref([]);

async function getBackLog() {
  let res = await backLog();
  backlogList.value = res;
}

function handleClick(item) {
  let goName = item.jumpType == 1 ? 'SelectAppPlane' : 'SelectAppTask';
  go({ name: goName });
}

onMounted(() => {
  getBackLog();
});
</script>

<style lang="less" scoped>
.backlog-item {
  background: #f8fbff;
  border-left: 2px solid #1f6cff;
}
.backlog-item:nth-child(2n) {
  background: #fffaf4;
  border-color: #ffb52f;
}
.backlog-item:nth-child(3n) {
  background: #f6fffa;
  border-color: #00cd7e;
}
</style>
