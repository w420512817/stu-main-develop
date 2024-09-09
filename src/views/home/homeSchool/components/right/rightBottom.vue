<template>
  <n-scrollbar class="mt-24px h-213px">
    <div class="backlog flex-col gap-y-3 cursor-pointer">
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
import { backLog } from '@/api/dashbord/school';
import Empty from '../empty.vue';
import { useGo } from '@common/hooks/usePage';

const { go } = useGo();
const backlogList = ref([]);

const routeMap = {
  1: {
    name: '视力筛查',
    path: '/vision'
  },
  2: {
    name: '龋齿筛查',
    path: '/caries'
  },
  3: {
    name: '学生体检',
    path: '/checkup'
  },
  4: {
    name: '学生体测',
    path: '/physical'
  }
};

async function getBackLog() {
  let res = await backLog();
  backlogList.value = res;
}

function handleClick(item) {
  console.log('item', routeMap[item.type]);

  if (item.jumpType == '3') {
    // 3代表跳转审批中心，直接本项目内跳转
    go('/approve/studentApprove');
  } else {
    // 除此之外均跳转至对应项目的任务管理模块/examine/task-list
    const { origin } = location;
    location.href = `${origin}${routeMap[item.type].path}/#/examine/task-list`;
  }
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
