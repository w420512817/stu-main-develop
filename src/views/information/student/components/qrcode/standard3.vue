<template>
  <div class="standardTemplate3">
    <div v-for="(page, index) in mapList" :key="index" class="item-wrap" style="page-break-after: always">
      <div v-for="(item, subIndex) in page" :key="subIndex" class="item">
        <!--学生信息-->
        <slot name="stuInfo" :item="item"></slot>
        <!--学生二维码-->
        <slot name="stuCode" :item="item"></slot>
        <div class="content">
          <p>左侧扫码筛查端</p>
          <p>扫码关注公众号</p>
          <p>【视力测试】</p>
          <p>点击菜单</p>
        </div>
        <!--公众号二维码-->
        <slot name="gzhCode"></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
/**
 * 该组件仅仅用于 vue3项目,不依赖其他插件
 */
import { computed } from 'vue';
const props = defineProps({
  list: {
    type: Array,
    defalut: [],
    required: true
  }
});

const mapList = computed(() => {
  let newArr = [];
  const pageSize = 5;
  const len = Math.ceil(props.list.length / pageSize); // 每页5条展示数据
  for (let i = 0; i < len; i++) {
    let temp = props.list.slice(pageSize * i, pageSize * (i + 1));
    const obj = JSON.parse(JSON.stringify(temp));
    newArr.push(obj);
  }
  return newArr;
});
</script>

<style>
.standardTemplate3 .item-wrap .item {
  display: flex;
  align-items: center;
  border: 1px solid #999;
  padding: 10px;
  margin-bottom: 60px;
  justify-content: space-between;
}
.content {
  width: 150px;
}
</style>
