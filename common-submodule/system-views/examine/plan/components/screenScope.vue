<template>
  <n-grid cols="3" x-gap="100" class="m-t-24px">
    <n-gi span="2"><div class="text-sm font-bold m-b-5">筛查指标</div></n-gi>
    <n-gi span="1">
      <div class="w-full text-right text-blue-400" :class="customDisable ? 'text-bluegray' : ''">
        <span v-if="customDisable" class="cursor-not-allowed">导入筛查任务</span>
        <span v-else class="cursor-pointer" @click="importTask()">导入筛查任务</span>
      </div>
    </n-gi>
  </n-grid>
  <n-data-table
    class="dataTable"
    :expanded-row-keys="expandedKeys"
    :columns="tableColumns"
    :data="realAreaList"
    :render-cell="v => v ?? 0"
    :row-key="row => row.regionId"
    max-height="476px"
    @update:expanded-row-keys="handleExpandedChange"
  />
  <TaskImportModal @register="registerImportModal" @add-success="getDataSource" />
</template>

<script setup lang="jsx">
import { ref, nextTick, computed, watch } from 'vue';
import { array, bool, string } from 'vue-types';
import { useModal } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';
import { GovLevelEnum } from '@common/enum/pageEnum';
import TaskImportModal from './taskImportModal.vue';
import { cloneDeep } from 'lodash-es';
import { removeNullValues } from '@common/utils/index';

const { userInfo } = useUserStore();
const [registerImportModal, { openModal }] = useModal();

const props = defineProps({
  areaList: array().def([]),
  areaRangeChecked: array().def(null),
  areaRange: array().def(null),
  customDisable: bool().def(false),
  columns: array().def(null),
  stuCountField: string().def('stuCount')
});

const nomalColumns = [
  {
    title: '任务范围',
    key: 'regionName',
    width: 300
  },
  {
    title: '学生总数',
    key: props.stuCountField,
    width: 300
  },
  {
    width: 300,
    title: '筛查目标总数',
    key: 'screeningNum',
    render(row) {
      let area = GovLevelEnum[row.level] == 'REGION' && GovLevelEnum[userInfo.govLevel] == 'REGION';
      if (GovLevelEnum[row.level] == 'PROVINCE' || GovLevelEnum[row.level] == 'CITY' || area) {
        return <div>{row.screeningNum}</div>;
      }

      return (
        <NInputNumber
          showButton={false}
          precision={0}
          min={0}
          w-280px
          value={row.screeningNum}
          disabled={props?.customDisable}
          onUpdateValue={v => {
            nextTick(() => {
              handleSetScreeningNum();
            });
            row.screeningNum = v;
          }}
        ></NInputNumber>
      );
    }
  }
];
const realAreaList = ref([]);
const expandedKeys = ref([]);
const tableColumns = computed(() => {
  return props.columns || nomalColumns;
});

const getId = (arr, keys) => {
  arr.forEach((item, index) => {
    if (item.regionId && index === 0) {
      keys.push(item?.regionId);
    }
    // if (item.children && index === 0) {
    //   getId(item.children, keys);
    // }
  });
  return keys;
};

const handleExpandedChange = keys => {
  expandedKeys.value = keys;
};

const getList = arr => {
  arr.forEach((item, index) => {
    if (!props.areaRangeChecked.includes(item.regionId)) {
      arr[index] = undefined;
      delete arr[index];
    }

    if (item.children) {
      getList(item.children);
    }
  });
  return arr;
};
// 获取数字
const getNum = (arr, key = 'screeningNum') => {
  const num = arr.reduce((pre, next) => {
    return next[key] ? (pre += next[key]) : pre;
  }, 0);
  return num;
};

const getData = data => {
  console.log(data);
  data.forEach(item => {
    if (item.children) {
      getData(item.children);
      item.screeningNum = getNum(item.children, 'screeningNum');
      item.stuCount = getNum(item.children, 'stuCount');
      item.gradeNum = getNum(item.children, 'gradeNum');
      // item.haveScreeningNum = getNum(item.children, 'haveScreeningNum');
    }
    // item.percent = getPrecent(item);
  });
  return data;
};

watch(
  [() => props.areaList, () => props.areaRangeChecked],
  () => {
    if (props.areaRangeChecked) {
      const list = cloneDeep(props.areaList);
      // 通过对比选择的code和tree的数据，来获取真实的需要获取的数据
      const res = getList(list, []);
      // 去掉null的value 并且设置tree的value，getData是重新计算学生总数和筛查目标学生数量
      const removeNullRes = removeNullValues(res);
      realAreaList.value = getData(removeNullRes);
      // realAreaList.value = removeNullRes;
      // 获取默认展开的数据
      const keys = getId(realAreaList.value, []);
      expandedKeys.value = keys;
      return;
    }
    realAreaList.value = [];
  },
  { deep: true, immediate: true }
);

function importTask() {
  openModal(true, { areaRange: props?.areaRange });
}

// 根据修改的区的值修改省市的值
const handleSetScreeningNum = () => {
  const res = getData(realAreaList.value);
  realAreaList.value = res;
};
// 展示警告
const handleShowWarning = overstep => {
  window.$notification.warning({
    title: '导入警告',
    content: () => {
      return overstep.map(item => {
        return item?.status === 2 ? (
          <div>
            <span className="text-[14px] font-bold">{item.regionName}</span>
            <span> 学生人数不可为负数 </span>
          </div>
        ) : (
          <div>
            <span className="text-[14px] font-bold">{item.regionName}</span>
            <span> 最多可筛查学生人数为 </span>
            <span className="text-[14px] font-bold">{item.stuCount || 0}</span>
          </div>
        );
      });
    }
  });
};

function getDataSource(d) {
  // 计算出警告的数据和地区树
  if (!d?.[0]) return;
  let overstep = [];
  let stack = [...realAreaList.value];
  for (let i = 0; i < stack.length; i++) {
    if (!d?.length) break;
    const item = stack[i];
    let index = d.findIndex(v => (v.name || v.schoolName) === item.regionName);
    if (index !== -1) {
      let [v] = d.splice(index, 1);
      if (v.number < 0) {
        item.status = 2;
        overstep.push(item);
        v.number = item.stuCount;
      }
      item.screeningNum = ~~v.number;
    }
    if (item.children?.length) {
      stack.push(...item.children);
    }
  }
  handleSetScreeningNum();
  if (overstep.length) {
    handleShowWarning(overstep);
  }
}

const getFieldValue = () => {
  return realAreaList.value;
};

defineExpose({ getFieldValue, handleSetScreeningNum });
</script>

<style lang="less" scoped>
// 偶数行变色
:deep(.n-data-table-table .n-data-table-tr:nth-child(even) .n-data-table-td) {
  background: rgb(250 250 252);
}
</style>
