<template>
  <basic-modal
    v-bind="$attrs"
    :title="getTitle"
    class="w-600px"
    cancel-text="关闭"
    :show-ok-btn="!isView"
    @ok="confirmOk"
    @register="register"
    @visible-change="visibleChange"
  >
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="100"
      label-align="right"
      require-mark-placement="left"
      :disabled="isView"
      :model="state"
      :style="{
        maxWidth: '640px'
      }"
    >
      <n-form-item label="应用名称:" clearable :rule="required" path="appId">
        <n-select
          v-model:value="state.appId"
          :options="state.appsSelects"
          value-field="appId"
          label-field="appNameVersion"
          @update:value="appIdUpdateValue"
        />
        <n-button class="m-l-5" type="primary" secondary round size="small">总分：{{ state.allScore }}</n-button>
      </n-form-item>
      <div v-for="(item, index) in state.screenList" :key="index">
        <div class="w-full h-1px border-t-1 border-dashed border-gray-400 m-b-5 m-t-5"></div>
        <n-form-item label="筛查类目:" :rule="required" :path="`screenList[${index}].screenType`">
          <n-select
            v-model:value="item.screenType"
            :options="state.screenTypeSelects"
            clearable
            value-field="screeningTypeId"
            label-field="screeningTypeName"
            @update:value="screenTypeUpdateValue($event, item, index)"
          />
          <n-button class="m-l-5" type="primary" secondary round size="small">总分：{{ item.score }}</n-button>
          &nbsp;
          <icon-mdi-light:delete
            v-if="index != 0 && state.type != 1"
            text-8
            style="color: #757879"
            cursor-pointer
            @click="delType(index)"
          />
        </n-form-item>
        <!-- {{ item }} -->
        <!-- {{ item.screenItemSelects }} -->
        <n-form-item label="筛查项目:" :rule="required" :path="`screenList[${index}].screenItem`">
          <n-select
            v-model:value="item.screenItem"
            :options="item.screenItemSelects"
            clearable
            value-field="screeningItemId"
            label-field="screeningItemName"
            @update:value="screeningItemIdUpdateValue($event, item.screenItemSelects, index)"
          />
        </n-form-item>
        <n-form-item label="输入类型:" :rule="{ ...required, type: 'number' }" :path="`screenList[${index}].inputType`">
          <n-radio-group v-model:value="item.inputType" name="radiogroup1" disabled="true">
            <n-space>
              <n-radio :value="1">单选</n-radio>
              <n-radio :value="2">多选</n-radio>
              <n-radio :value="3">数值</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <div
          v-for="(ite, ind) in item.itemList"
          :key="ind"
          class="border-1 border-dashed border-gray-400 p-t-5 p-r-5 m-b-5 relative"
        >
          <div class="absolute top-5 right-5">
            <icon-mdi-light:delete
              v-if="ind != 0 && state.type != 1"
              text-6
              style="color: #757879"
              cursor-pointer
              @click="delItem(item.itemList, ind)"
            />
          </div>
          <n-form-item
            :label="`筛查选项${ind + 1}:`"
            :rule="required"
            :path="`screenList[${index}].itemList.[${ind}].screenOption`"
            class="w-250px"
          >
            <n-select
              v-model:value="ite.screenOption"
              value-field="id"
              label-field="name"
              :options="item.screenOptionSelects"
              clearable
              @update:value="screenSelectUpdate($event, index, ind, item, ite)"
            />
          </n-form-item>
          <n-form-item
            v-if="item.inputType == 3"
            label="数值范围:"
            :rule="required"
            :path="`screenList[${index}].itemList.[${ind}].sumTypeSelect1`"
          >
            <!-- {{ ite }} -->
            <n-select v-model:value="ite.sumTypeSelect1" style="width: 70px" :options="ite.sumTypeSelects" clearable />
            &nbsp;
            <!-- {{ ite.sumTypeNum1 }} -->
            <n-input-number
              v-model:value="ite.sumTypeNum1"
              :precision="ite.precision"
              style="width: 90px"
              clearable
              :show-button="false"
              @blur="screenSelectNumberUpdate($event, index, ind, item, ite)"
            />
            <span v-if="ite.sumType">&nbsp;且&nbsp;</span>
            <n-select
              v-if="ite.sumType"
              v-model:value="ite.sumTypeSelect2"
              style="width: 70px"
              :options="ite.sumTypeSelects"
              clearable
            />
            &nbsp;
            <n-input-number
              v-if="ite.sumType"
              v-model:value="ite.sumTypeNum2"
              :precision="ite.precision"
              style="width: 90px"
              clearable
              :show-button="false"
              @blur="screenSelectNumberUpdate($event, index, ind, item, ite)"
            />
            &nbsp;
            <n-button v-if="state.type != 1" type="primary" size="small" @click="ite.sumType = !ite.sumType">
              {{ ite.sumType ? '-' : '+' }}
            </n-button>
          </n-form-item>
          <n-form-item
            class="w-250px"
            label="评分:"
            :rule="{
              pattern: /^[+]{0,1}(\d+)$/,
              message: '只能输入整数',
              trigger: ['blur', 'input']
            }"
            :path="`screenList[${index}].itemList.[${ind}].screenScore`"
          >
            <n-input-number v-model:value="ite.screenScore" min="0" :show-button="false" @input="numChange" />
          </n-form-item>
        </div>
        <div
          v-if="state.type == 0 || state.type == 2"
          class="w-full flex align-center justify-center cursor-pointer border-1 border-dashed border-gray-400 p-1"
          @click="addItem(item.itemList)"
        >
          <div class="w-5 h-5 border-1 border-dashed border-gray-400 text-center leading-4.5">+</div>
          &nbsp;&nbsp;添加选项
        </div>
      </div>

      <div
        v-if="state.type == 0 || state.type == 2"
        class="w-full flex align-center justify-center cursor-pointer m-t-10"
        @click="addType()"
      >
        <div class="w-5 h-5 border-1 border-dashed border-gray-400 text-center leading-4.5">+</div>
        &nbsp;&nbsp;添加类目
      </div>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick, computed } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';
import { getAppList, getScreeningOpitons, addRules, getRulesInfo, editRules } from '@/api/scoreRule/index.js';
import { screenItems } from './table.data.jsx';
const formRef = ref(null);
const sumTypeSelects = [
  { label: '=', value: '=' },
  { label: '>', value: '>' },
  { label: '>=', value: '>=' },
  { label: '<', value: '<' },
  { label: '<=', value: '<=' }
];

const {
  userInfo: { orgId }
} = useUserStore();
const required = {
  required: true,
  message: `不能为空`,
  trigger: ['input', 'blur', 'change']
};
const emit = defineEmits(['onSuccess', 'register']);

const state = reactive({
  rulesId: null,
  appsSelects: [], // 应用组选项
  appId: null, // 应用组
  allScore: 0,
  type: 0, // 0新增 1详情 2 编辑
  screenTypeSelects: [], // 筛查类目选项
  screenList: [
    {
      screenType: null, // 筛查类目id
      screenItemSelects: [], // 筛查项目选项
      screenItem: null, // 筛查项目id
      score: 0,
      inputType: null,
      screenOptionSelects: [],
      itemList: [
        {
          screenOption: null, // 选项id
          screenScore: 0,
          sumTypeSelects,
          sumTypeSelect1: null,
          sumTypeSelect2: null,
          sumType: false,
          sumTypeNum1: null,
          sumTypeNum2: null
        }
      ]
    }
  ]
});
let isView = ref(false);
const [register, { closeModal, changeLoading }] = useModalInner(async data => {
  // 获取应用名称

  await handleGetAppList();

  if (data) {
    isView.value = data.type == 1;
    if (!data.type) {
      state.rulesId = null;
    }
  } else {
    state.rulesId = null;
    isView.value = false;
  }
  state.type = data?.type;
  await acceptNoticeDetail(data);
});

const handleGetAppList = () => {
  // 获取应用名称
  getAppList({ orgId }).then(d => {
    const res = d.map(item => {
      return {
        ...item,
        appId: `${item.appId}-${item.appVersion}`,
        appNameVersion: `${item.appName}-${item.appVersion}`
      };
    });
    state.appsSelects = res;
  });
};

// 计算页面显示标题
const getTitle = computed(() => {
  if (state.type == 0) {
    return '新增规则';
  } else if (state.type == 1) {
    return '规则详情';
  } else {
    return '编辑规则';
  }
});

const handleGetScreeningOpitons = async (appId, appVersion) => {
  const realAppId = appId.split('-')?.[0];
  const d = await getScreeningOpitons({
    appId: realAppId,
    version: appVersion
  });
  const data = d.map(item => {
    return {
      ...item,
      disabled: false
    };
  });
  state.screenTypeSelects = data;
};

// 获取筛查类目
async function appIdUpdateValue() {
  nextTick(async () => {
    let { appId, appVersion } = state.appsSelects.find(v => v.appId == state.appId);
    resetLev1();
    await handleGetScreeningOpitons(appId, appVersion);
  });
}

async function getScreeningOpitonsInit() {
  console.log(state.appsSelects, 'state.appsSelects');
  console.log(state.appId, 'state.appId');
  // debugger;
  let { appId, appVersion } = state.appsSelects.find(v => v.appId == state.appId);
  resetLev1();
  await handleGetScreeningOpitons(appId, appVersion);
}
// 筛查类目
function screenTypeUpdateValue(e, item, index) {
  nextTick(() => {
    resetLev2(index);
    // 找到下面筛查的值
    let { itemList } = (state.screenTypeSelects || []).find(v => v.screeningTypeId == e) ?? {};
    if (itemList) {
      item.screenItemSelects = itemList;
    }
  });
}
// e, l, i  e, item, index 筛查项目
function screeningItemIdUpdateValue(e, l, i) {
  nextTick(() => {
    resetLev3(i);
    let { screeningItemCode, inputType } = l.find(v => v.screeningItemId == e) ?? {};
    let { list } = screenItems.find(vv => vv.key.indexOf(screeningItemCode) != -1) ?? {};
    list?.forEach(item => {
      item.disabled = false;
    });

    state.screenList[i].screenOptionSelects = list || [];
    state.screenList[i].inputType = inputType;
    // 拿出选中的id
    const screenItemIds = state.screenList.map(item => {
      return item.screenItem;
    });

    // 将选中的id disabled设置为true
    state.screenList[i].screenItemSelects.forEach(v => {
      if (screenItemIds.includes(v.screeningItemId)) {
        v.disabled = true;
      } else {
        v.disabled = false;
      }
    });
  });
}

// const filterKeys = (current, list, itemList) => {
//   console.log(current, 'current');
//   console.log(current.sumTypeNum1, 'current.sumTypeNum1');

//   const res = list.find(item => {
//     return item.id === current.screenOption;
//   });
//   if (res.key === 'vision') {
//     console.log('选择的是裸眼视力', current.sumTypeNum1, itemList);

//     const selectStatus = itemList.some(i => {
//       if (i.sumTypeNum1 >= 5 || i.sumTypeNum2 >= 5) {
//         return true;
//       } else {
//         return false;
//       }
//     });

//     list.forEach(item => {
//       if ((item.key === 'eyesight' || item.key === 'frameglass') && selectStatus) {
//         item.disabled = true;
//       } else {
//         item.disabled = false;
//       }
//     });
// };

// 数值范围输入失去焦点的时候，需要考虑解除视力的选项问题
function screenSelectNumberUpdate(e, index, ind, currentParent, current) {
  console.log(e.target.value, index, ind, currentParent, current, 'e, index, ind, currentParent, current');
  // filterKeys(current, state.screenList?.[index]?.screenOptionSelects, currentParent.itemList);
}

function screenSelectUpdate(e, index, ind, currentParent, current) {
  // console.log(e, 'eee', currentParent.screenOptionSelects);

  // 筛查出是否是裸眼视力 注释掉 这套逻辑不用了
  // filterKeys(current, state.screenList?.[index]?.screenOptionSelects, currentParent.itemList);

  // 选择了筛查选项以后来确定数值范围的精度问题
  const precision =
    currentParent.screenOptionSelects?.find(item => {
      return item.id == e;
    })?.precision ?? 0;
  current.precision = precision;
  console.log(precision, 'precision');
  // 3代表数值数值，则不计算互斥的问题
  if (currentParent.inputType == 3) {
    return;
  }
  // 把选择的值拿出来组成一个数组
  const itemListIds = state.screenList?.[index]?.itemList.map(item => {
    return item.screenOption;
  });
  // 如果数组包含的里面的id就不让他选择了
  state.screenList?.[index]?.screenOptionSelects?.forEach(item => {
    item.precision = precision;
    if (itemListIds.includes(item.id)) {
      item.disabled = true;
    } else {
      item.disabled = false;
    }
  });
}

function delType(index) {
  state.screenList.splice(index, 1);
  refreshScreenItemSelects();
  numChange();
}

// 重新计算筛查项目 单选多选
function refreshScreenItemSelects() {
  // 拿出选中的id
  const screenItemIds = state.screenList.map(item => {
    return item.screenItem;
  });

  // 将选中的id disabled设置为true

  state.screenList.forEach(item => {
    item.screenItemSelects.forEach(v => {
      if (screenItemIds.includes(v.screeningItemId)) {
        v.disabled = true;
      } else {
        v.disabled = false;
      }
    });
  });
}

function addType() {
  state.screenList.push({
    screenType: null,
    screenItemSelects: [],
    screenItem: null,
    score: 0,
    inputType: null,
    screenOptionSelects: [],
    itemList: [
      {
        screenOption: null,
        screenScore: 0,
        sumTypeSelects,
        sumTypeSelect1: null,
        sumTypeSelect2: null,
        sumType: false,
        sumTypeNum1: null,
        sumTypeNum2: null
      }
    ]
  });

  console.log(state.screenList, 'state.screenListadd');
}
function delItem(itemList, ind) {
  itemList.splice(ind, 1);
  refreshScreenOptionsSelects();
  numChange();
}

// 重新计算筛查的选中逻辑
function refreshScreenOptionsSelects() {
  state.screenList.forEach(item => {
    const itemListIds = item.itemList.map(i => {
      return i.screenOption;
    });

    item?.screenOptionSelects?.forEach(i => {
      if (itemListIds.includes(i.id)) {
        i.disabled = true;
      } else {
        i.disabled = false;
      }
    });
  });
}

function addItem(itemList) {
  console.log(itemList, 'itemList');
  itemList.push({
    screenOption: null,
    screenScore: 0,
    sumTypeSelects,
    sumTypeSelect1: null,
    sumTypeSelect2: null,
    sumType: false,
    sumTypeNum1: null,
    sumTypeNum2: null
  });
}
// 计算label的值
function getLabel(sumTypeSelect1, sumTypeNum1, sumTypeSelect2, sumTypeNum2) {
  if (sumTypeSelect1 && sumTypeSelect2) {
    return sumTypeSelect1 + sumTypeNum1 + ',' + sumTypeSelect2 + sumTypeNum2;
  } else if (sumTypeSelect1) {
    return sumTypeSelect1 + sumTypeNum1;
  } else {
    return '';
  }
}

function confirmOk() {
  formRef.value?.validate(errors => {
    if (!errors) {
      let { appGroupId, appName, appId, appVersion } = state.appsSelects.find(v => v.appId == state.appId);
      let score = state.allScore;
      let rulesId = state.rulesId;
      let options = [];
      const realAppId = appId.split('-')?.[0];
      state.screenList.forEach(v => {
        let screeningTypeId = v.screenType;
        let screeningTypeName = state.screenTypeSelects.find(
          v1 => v1.screeningTypeId == v.screenType
        ).screeningTypeName;
        let items = [];
        let { screeningItemId, screeningItemType, screeningItemName, screeningItemCode } = v.screenItemSelects.find(
          v2 => v2.screeningItemId == v.screenItem
        );
        let obj = {
          screeningTypeId,
          screeningTypeName,
          screeningItemId,
          screeningItemType,
          screeningItemName,
          screeningItemCode,
          conditionText: '',
          conditionType: v.inputType,
          score: v.score
        };
        let arrScore = [];

        v.itemList.forEach(vv => {
          let con = {
            label: getLabel(vv.sumTypeSelect1, vv.sumTypeNum1, vv.sumTypeSelect2, vv.sumTypeNum2),
            // vv.sumTypeSelect1 + getPrecision(vv.sumTypeNum1) + ',' + vv.sumTypeSelect2 + getPrecision(vv.sumTypeNum2),
            score: vv.screenScore,
            key: screeningItemCode,
            id: vv.screenOption
          };
          arrScore.push(con);
        });
        obj.conditionText = JSON.stringify(arrScore);
        items.push(obj);
        options.push({ screeningTypeId, screeningTypeName, items });
      });
      let originData = {
        rulesId,
        appGroupId,
        appVersion,
        appName,
        appId: realAppId,
        score,
        options
      };
      if (state.rulesId) {
        editRules({
          ...originData,
          rulesId: state.rulesId
        }).then(() => {
          window.$message.success(`编辑成功`);
          resetLev1();
          emit('onSuccess');
        });
      } else {
        addRules({
          ...originData
        }).then(() => {
          window.$message.success(`新增成功`);
          resetLev1();
          emit('onSuccess');
        });
      }
      closeModal();
      reset();
    }
  });
}

function reset() {
  resetLev1();
}

// 进来后清空数据
function visibleChange(visible) {
  state.appId = null;
  !visible && reset();
}

async function acceptNoticeDetail(d) {
  if (d && d.rulesId) {
    changeLoading(true);
    getRulesInfo({
      rulesId: d.rulesId
    })
      .then(d => {
        fillData(d);
      })
      .finally(() => {
        changeLoading(false);
      });
  }
}

function getScore(list) {
  let obj = {};
  list.forEach(item => {
    if (obj?.[item.screenOption]) {
      obj[item.screenOption].push(item.screenScore);
    } else {
      obj[item.screenOption] = [item.screenScore];
    }
  });

  const scoreList = Object.values(obj)?.map(item => {
    return Math.max(...item);
  });
  return scoreList?.reduce((pre, next) => {
    return (pre += next);
  }, 0);
}
// 计算分数
function numChange() {
  setTimeout(() => {
    // 算每一项的分数
    state.screenList.forEach(v => {
      if (v.inputType !== 3) {
        // 单选多选取最高值
        v.score = 0;
        const score = v.itemList.reduce((pre, next) => {
          return pre > next.screenScore ? pre : next.screenScore;
        }, 0);
        v.score = score;
      } else {
        v.score = 0;
        // 数值 选了同一个选项的取最高分 然后再加起来
        const score = getScore(v.itemList);
        v.score = score;
      }
    });
    state.allScore = state.screenList.reduce((pre, next) => {
      return (pre += next.score * 1);
    }, 0);
  }, 200);
}
function resetLev1() {
  state.allScore = 0;
  state.screenTypeSelects = [];
  state.screenList = [
    {
      screenType: null, // 筛查类目id
      screenItemSelects: [], // 筛查项目选项
      screenItem: null, // 筛查项目id
      score: 0,
      inputType: null,
      screenOptionSelects: [],
      itemList: [
        {
          screenOption: null, // 选项id
          screenScore: 0,
          sumTypeSelects,
          sumTypeSelect1: null,
          sumTypeSelect2: null,
          sumType: false,
          sumTypeNum1: null,
          sumTypeNum2: null
        }
      ]
    }
  ];
  numChange();
}
function resetLev2(index) {
  let emptyObj = {
    screenItem: null, // 筛查项目id
    score: 0,
    inputType: null,
    screenOptionSelects: [],
    itemList: [
      {
        screenOption: null, // 选项id
        screenScore: 0,
        sumTypeSelects,
        sumTypeSelect1: null,
        sumTypeSelect2: null,
        sumType: false,
        sumTypeNum1: null,
        sumTypeNum2: null
      }
    ]
  };
  state.screenList[index] = Object.assign(state.screenList[index], emptyObj);
  numChange();
}
function resetLev3(i) {
  let emptyObj = {
    score: 0,
    inputType: '',
    screenOptionSelects: [],
    itemList: [
      {
        screenOption: null, // 选项id
        screenScore: 0,
        sumTypeSelects,
        sumTypeSelect1: null,
        sumTypeSelect2: null,
        sumType: false,
        sumTypeNum1: null,
        sumTypeNum2: null
      }
    ]
  };
  state.screenList[i] = Object.assign(state.screenList[i], emptyObj);
  numChange();
}
// 获取保留的位数
const getPrecision = (key, id) => {
  let precision = 0;
  screenItems.forEach(item => {
    if (item.key.includes(key)) {
      item.list.forEach(i => {
        if (i.id == id) {
          precision = i?.precision || 0;
        }
      });
    }
  });
  return precision;
};

// 回显数据
async function fillData(d) {
  console.log(d, 'ddd');
  let { appId, score, options, rulesId, appVersion } = d;
  state.appId = `${appId}-${appVersion}`;
  state.allScore = score;
  state.rulesId = rulesId;
  let arr1 = [];
  options.forEach(v => {
    arr1.push({ screeningTypeId: v.screeningTypeId, screeningTypeName: v.screeningTypeName });
  });
  // 根据返回的应用名称来确定筛查类目
  await getScreeningOpitonsInit();
  let screenList = [];
  options.forEach(v => {
    let obj = {
      screenType: null, // 筛查类目id
      screenItemSelects: [], // 筛查项目选项
      screenItem: null, // 筛查项目id
      score: 0,
      inputType: null,
      screenOptionSelects: [],
      itemList: [
        {
          screenOption: null, // 选项id
          screenScore: 0,
          sumTypeSelects,
          sumTypeSelect1: null,
          sumTypeSelect2: null,
          sumType: false,
          sumTypeNum1: null,
          sumTypeNum2: null
        }
      ]
    };
    obj.screenType = v.screeningTypeId;
    let arr2 = [];
    let arr3 = [];
    v.items.forEach(vv => {
      arr2.push({
        screeningItemName: vv.screeningItemName,
        screeningItemId: vv.screeningItemId,
        screeningItemCode: vv.screeningItemCode
      });
      obj.screenItem = vv.screeningItemId;
      obj.inputType = vv.conditionType;
      obj.screenOptionSelects = screenItems.find(vvv => vvv.key.indexOf(vv.screeningItemCode) != -1)?.list ?? [];
      let arr22 = JSON.parse(vv.conditionText);
      arr22.forEach(v3 => {
        let { sumTypeSelect1, sumTypeSelect2, sumTypeNum1, sumTypeNum2 } = dealRange(v3.label);
        let obj22 = {
          screenOption: v3.id, // 选项id
          screenScore: v3.score,
          sumTypeSelects,
          sumTypeSelect1,
          sumTypeSelect2,
          sumType: v3.label.split(',')?.filter(item => item)?.length >= 2 ?? false,
          sumTypeNum1: Number(sumTypeNum1),
          sumTypeNum2: Number(sumTypeNum2),
          // 精确位数
          precision: getPrecision(v3.key, v3.id)
        };
        arr3.push(obj22);
      });
    });
    obj.itemList = arr3;
    obj.screenItemSelects = arr2;
    screenList.push(obj);
  });
  state.screenList = screenList;
  // 算分数
  numChange();
  // 计算是否可以选中
  getScreenListStatus(state.screenList);
}
// 初始化的时候用来获取用户的选项的状态
function getScreenListStatus(screenList) {
  screenList.forEach(item => {
    // item?.itemList.forEach(i => {
    //   filterKeys(i, item?.screenOptionSelects, item?.itemList);
    // });

    if (item.inputType == 3) {
      return;
    }
    // 把选择的值拿出来组成一个数组
    const itemListIds = item?.itemList.map(item => {
      return item.screenOption;
    });
    item?.screenOptionSelects?.forEach(item => {
      if (itemListIds.includes(item.id)) {
        item.disabled = true;
      } else {
        item.disabled = false;
      }
    });
  });
}

// 赋值回显
function dealRange(label) {
  if (label) {
    let d1 = label.split(',')[0];
    let d2 = label.split(',')[1];
    return {
      // 过滤掉小数点和数字
      sumTypeSelect1: d1 ? d1.replace(/\d+(.\d+)?/g, '').replace(/-/g, '') : '',
      sumTypeSelect2: d2 ? d2.replace(/\d+(.\d+)?/g, '').replace(/-/g, '') : '',
      // 过滤出小数点和数字
      sumTypeNum1: d1 ? d1.replace(/[^(\-|+)?\d+(.\d+)?$]+/g, '') : null,
      sumTypeNum2: d2 ? d2.replace(/[^(\-|+)?\d+(.\d+)?$]+/g, '') : null
    };
  } else {
    return {
      sumTypeSelect1: '',
      sumTypeSelect2: '',
      sumTypeNum1: null,
      sumTypeNum2: null
    };
  }
}
</script>
