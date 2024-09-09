<template>
  <basic-modal v-bind="$attrs" class="!w-50vw" @register="register" @ok="handleClick">
    <div class="container">
      <div
        v-for="item in data"
        :key="item.id"
        class="box"
        :class="item.id == selectId ? 'active' : ''"
        @click="handleChange(item.id)"
      >
        <div class="title">{{ item.title }}</div>
        <div class="content">
          <div>{{ item.content }}</div>
          <div v-show="item.id == selectId" class="flex items-center text-[#386FFF] choose">
            <img :src="selectImg" class="w-18px" alt="选择" />
          </div>
        </div>
      </div>
    </div>
  </basic-modal>
</template>

<script setup>
import { ref } from 'vue';
import selectImg from '@common/assets/image/select.png';
import { useModalInner } from '@common/components/custom/Modal';
const [register, { closeModal }] = useModalInner(data => {
  data && onDataReceive(data);
});

const emits = defineEmits(['choose', 'register']);
const data = [
  { id: 1, title: '计划模式', content: '政府机构创建计划，学校根据计划创建任务' },
  { id: 2, title: '任务模式', content: '政府机构创建计划，学校自动生成任务信息' }
];

const selectId = ref(0);

function onDataReceive(data) {
  console.log('Data Received', data);
}

const handleChange = id => {
  selectId.value = id;
};

const handleClick = () => {
  if (!selectId.value) {
    window.$message.error('请选择筛查模式');
    return;
  }
  emits('choose', selectId.value);
  closeModal();
};
</script>

<style lang="less" scoped>
.container {
  display: grid;
  grid-template-columns: 18.75vw 18.75vw;
  grid-column-gap: 110px;
  justify-content: center;
  margin-top: 100px;
}
.box {
  width: 18.75vw;
  min-height: 11.5vw;
  border-radius: 5px;
  transition: all 0.5s;
  cursor: pointer;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    border: 1px solid #386fff;
    box-shadow: 0px 4px 12px 0px rgba(56, 111, 255, 0.32);
  }

  .title {
    height: 4vw;
    background-image: url('../../../../assets/image/mode.png');
    background-size: 100% 100%;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content {
    flex: 1;
    font-size: 16px;
    color: #666;
    padding: 24px;
    border: 1px solid #e0e0e5;
    box-sizing: border-box;
    border-top: 0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
      color: #222;
    }

    .choose {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
.active {
  border: 1px solid #386fff;
  box-shadow: 0px 4px 12px 0px rgba(56, 111, 255, 0.32);
}
</style>
