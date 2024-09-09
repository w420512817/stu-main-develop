<template>
  <div class="switch-nav">
    <div
      v-for="item in props.navList"
      :key="item.type"
      :class="{ 'nav-item': true, actived: activedNav === item.type }"
      @click="navClick(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { array } from 'vue-types';
import { ref, unref, defineProps, defineEmits } from 'vue';
const props = defineProps({
  navList: array().def([])
});

const activedNav = ref('');
activedNav.value = unref(props.navList[0].type);

const emit = defineEmits(['navChange']);
const navClick = item => {
  if (activedNav.value === item.type) return;
  emit('navChange', item);
  activedNav.value = item.type;
};
</script>

<style lang="less" scoped>
.switch-nav {
  height: 2.5vw;

  border-bottom: 1px solid rgba(20, 57, 90, 0.4);
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  .nav-item {
    min-width: 20%;
    width: 100%;
    height: 2.5vw;
    line-height: 2.5vw;
    text-align: center;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #8ba7bc;
    cursor: pointer;
    user-select: none;
    text-align: center;
  }

  .actived {
    font-size: 16px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #e3f7ff;
    position: relative;
  }
  .actived::after {
    content: '';
    display: block;
    width: 100px;
    height: 38px;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: -20px;

    background-image: url('@/assets/image/bigScreen/nav-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
