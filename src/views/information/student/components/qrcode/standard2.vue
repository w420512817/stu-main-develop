<template>
  <div class="standardTemplate2">
    <div v-for="(page, index) in mapList" :key="index" class="item-wrap" style="page-break-after: always">
      <div v-for="(item, subIndex) in page" :key="subIndex" class="item">
        <!--学生信息-->
        <slot name="stuInfo" :item="item"></slot>
        <!--学生二维码-->
        <slot name="stuCode" :item="item"></slot>
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
  const pageSize = 10;
  const len = Math.ceil(props.list.length / pageSize); // 每页10条展示数据
  for (let i = 0; i < len; i++) {
    let temp = props.list.slice(pageSize * i, pageSize * (i + 1));
    const obj = JSON.parse(JSON.stringify(temp));
    newArr.push(obj);
  }
  return newArr;
});
</script>

<style>
.standardTemplate2 .item-wrap {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.standardTemplate2 .item-wrap .item {
  display: flex;
  align-items: center;
  border: 1px solid #999;
  padding: 10px;
  margin-bottom: 60px;
  height: auto;
  justify-content: space-between;
  width: 46%;
}
</style>
