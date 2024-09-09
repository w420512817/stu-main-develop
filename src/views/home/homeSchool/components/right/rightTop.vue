<template>
  <div class="card">
    <div class="flex justify-between items-center mb-3px">
      <div class="tit flex-shrink-0">消息通知</div>
      <div class="flex flex-1 justify-end">
        <n-button type="primary" style="--n-height: 32px" @click="go({ name: 'sendModify' })">发布通知</n-button>
      </div>
    </div>
    <n-scrollbar class="h-176px">
      <div class="msg-list flex-col">
        <div
          v-for="item in msgList"
          :key="item.tit"
          title="查看消息"
          class="msg-box flex items-center justify-between cursor-pointer mt-3"
          @click="goMsg(item)"
        >
          <div class="relative">
            <div v-if="!item.noticeState" class="absolute w-2 h-2 rounded-2 bg-[#FF5353] -right-2px -top-1px"></div>
            <img :src="getMsgImg(item.noticeType)" class="w-88px h-32px" />
          </div>
          <n-ellipsis class="flex-1 mx-4">
            {{ item.title }}
          </n-ellipsis>
          <span class="text-14px text-[#777]">{{ item.time }}</span>
        </div>
      </div>
      <Empty v-if="!msgList.length" class="h-164px pt-5" />
    </n-scrollbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Empty from '../empty.vue';
import { noticeList } from '@/api/dashbord/school';
import { useGo } from '@common/hooks/usePage';

const { go } = useGo();
const msgList = ref([]);
async function getNoticeList() {
  msgList.value = await noticeList();
}

function goMsg(item) {
  localStorage.setItem('noticeAcceptId', item.noticeId);
  go({ name: 'receiveManage' });
}

function getMsgImg(type) {
  type = type || '政府通知';
  let imgMap = {
    政府通知: `gov-msg.png`,
    学校通知: `school-msg.png`,
    医院通知: `hospital-msg.png`,
    社会机构通知: `org-msg.png`
  };
  return getImg(imgMap[type]);
}

function getImg(v) {
  return new URL(`../../../../../assets/image/dashbord/${v}`, import.meta.url).href;
}

onMounted(() => {
  getNoticeList();
});
</script>

<style lang="less" scoped></style>
