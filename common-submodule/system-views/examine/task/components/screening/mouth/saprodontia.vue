<template>
  <div class="text-5 pl-3 title"><span>龋齿</span></div>
  <div ref="boxRef" class="page2">
    <div v-if="!props.disabled" class="flex m-4 mb-0" :bordered="false">
      <div>
        <n-space v-for="(item, index) in toothOptions" :key="index" class="mb-3">
          <span style="line-height: 34px">{{ index == 0 ? '乳牙' : '恒牙' }}</span>
          <n-radio-group v-model:value="radioValue" :name="'radiobuttongroup' + index" :on-update:value="updateFn">
            <n-space :size="10">
              <n-radio-button
                v-for="(v, k) in item"
                :key="k"
                class="text-center h-34px"
                :style="`line-height: 28px; width: ${defWidth[k]}px`"
                :value="v.value"
                :label="v.label"
              />
            </n-space>
          </n-radio-group>
        </n-space>
      </div>
      <div class="flex pl-2.5 mb-3 items-end">
        <n-button class="w-88px h-34px" type="primary" @click="clear()">清除</n-button>
      </div>
    </div>
    <div class="text-4 pl-3 mt-4 mb-2 title flex justify-between">
      <span>牙位图</span>
      <div v-if="!props.disabled">
        <span class="pr-2 text-3.5">自动输入</span>
        <n-switch v-model:value="inputFlag">
          <template #checked> 开 </template>
          <template #unchecked> 关 </template>
        </n-switch>
      </div>
    </div>
    <n-card class="card">
      <div class="main">
        <div v-for="(colItem, colIndex) in optJSON" :key="colIndex">
          <n-space justify="center" :size="15">
            <template v-if="colIndex < 1">
              <n-form-item
                v-for="(item, index) in colItem"
                :key="index"
                :path="'inputCariesScreeningQuery.' + item.field"
                :rule="{
                  required: props.required === 1 && getDisabled(item) == false,
                  message: '',
                  trigger: ['blur', 'input'],
                  type: 'string'
                }"
              >
                <div class="flex flex-col">
                  <div v-for="(labelValue, labelIndex) in item.label" :key="labelIndex" class="pl-1 mt-1 h-22px">
                    {{ labelValue }}
                  </div>
                  <n-input
                    :ref="'iptRef' + item.num"
                    v-model:value="formValue[item.field]"
                    class="!w-34px"
                    type="text"
                    placeholder=""
                    :maxlength="1"
                    :disabled="getDisabled(item) || unScreenFields[item.field]"
                    @input="e => inputHandle(e, item.num, item.field)"
                    @click="clickHandle(item.num, item.field)"
                    @keyup.delete.space="keyupHandle($event, item.num, item.field)"
                  />
                </div>
              </n-form-item>
            </template>
            <template v-else>
              <n-form-item
                v-for="(item, index) in colItem"
                :key="index"
                :path="'inputCariesScreeningQuery.' + item.field"
                :rule="{
                  required: props.required === 1 && getDisabled(item) == false,
                  message: '',
                  trigger: ['blur', 'input'],
                  type: 'string'
                }"
              >
                <div class="flex flex-col">
                  <n-input
                    :ref="'iptRef' + item.num"
                    v-model:value="formValue[item.field]"
                    class="!w-34px"
                    type="text"
                    placeholder=""
                    :maxlength="1"
                    :disabled="getDisabled(item) || unScreenFields[item.field]"
                    @input="e => inputHandle(e, item.num, item.field)"
                    @click="clickHandle(item.num, item.field)"
                    @keyup.delete.space="keyupHandle($event, item.num, item.field)"
                  />
                  <div v-for="(labelValue, labelIndex) in item.label" :key="labelIndex" class="pl-1 mb-1 h-22px">
                    {{ labelValue }}
                  </div>
                </div>
              </n-form-item>
            </template>
          </n-space>
        </div>
      </div>
    </n-card>
    <p class="text-4 pl-3 mt-6 mb-2 title"><span>添加图片</span></p>
    <n-card class="uploadCard" :bordered="false">
      <n-form-item show-require-mark>
        <n-upload
          :file-list="formValue.photoUrl"
          list-type="image-card"
          accept="image/*"
          :disabled="props.disabled || unScreenFields.photoUrl"
          :max="5"
          @change="imagesChanged"
        />
      </n-form-item>
    </n-card>
    <n-space justify="center">
      <span>注：</span>
      <span>1.未满10岁无需录入每排第7、8两颗牙齿情况；</span>
      <span>2. 未满16岁无需录入每排第8颗牙齿情况。</span>
    </n-space>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance, inject } from 'vue';
import { optJSON, toothOptions, defWidth } from './index.data.jsx';
import { object, bool, number } from 'vue-types';
import { uploadFile } from '@common/api/examine/task';

const props = defineProps({
  data: object().def({}),
  disabled: bool().def(false),
  age: number().def(null),
  required: number().def(null)
});

const emits = defineEmits(['update:data']);

const unScreenFields = inject('unScreenFields');
const formValue = computed({
  get() {
    return props.data;
  },
  set(value) {
    emits('update:data', value);
  }
});

const inputFlag = ref(true); // 自动输入开关
const radioValue = ref(null); // 牙病按钮选择的值
const boxRef = ref(null);

let messageReactive = null;

const startNum = computed(() => (props.age < 10 ? 3 : props.age < 16 ? 2 : 1));
const endNum = computed(() => (props.age < 10 ? 30 : props.age < 16 ? 31 : 32));

let ctx = null;
let myRefs = null;

const clear = () => {
  radioValue.value = null;
};

function getDisabled(item) {
  return (
    item.disabled < startNum.value ||
    (item.type == 1 && ['A', 'B', 'C', 'D', 'E', 'X', 'Q'].includes(radioValue.value)) ||
    props.disabled ||
    (props.age < 10 &&
      ['18', '17', '16', '26', '27', '28', '48', '47', '46', '36', '37', '38'].includes(
        item.label[1] || item.label[0]
      )) ||
    (props.age < 16 && ['18', '28', '48', '38'].includes(item.label[1] || item.label[0]))
  );
}

const inputHandle = (value, num, field) => {
  let str = value;
  let n = num;
  let isError = false;
  const regex1 = /^[AaBbCcDdEeXxQq]$/;
  const regex2 = /^[0123459]$/;
  const flag1 = regex1.test(str);
  const flag2 = regex2.test(str);
  // 如果是字母转大写
  if (flag1) {
    const arr = [
      'leftTop8',
      'leftTop7',
      'leftTop6',
      'rightTop6',
      'rightTop7',
      'rightTop8',
      'leftBottom8',
      'leftBottom7',
      'leftBottom6',
      'rightBottom6',
      'rightBottom7',
      'rightBottom8'
    ];
    if (arr.includes(field)) {
      formValue.value[field] = '';
      isError = true;
      if (!messageReactive) {
        messageReactive = window.$message.error('该齿位仅支持恒牙代码');
        setTimeout(() => {
          messageReactive = null;
        }, 3000);
      }
    } else {
      str = str.toUpperCase();
      formValue.value[field] = str;
    }
  }
  // 如果不是对应的代码编号则提示
  if (!flag1 && !flag2) {
    if (str != '') {
      formValue.value[field] = '';
      isError = true;
      if (!messageReactive) {
        messageReactive = window.$message.error('不支持的记录代码');
        setTimeout(() => {
          messageReactive = null;
        }, 3000);
      }
    }
  } else {
    // 开启自动输入输入后聚焦到下一个输入框
    if (inputFlag.value && !isError) {
      if (startNum.value == 2 && n == 15) {
        n += 3;
      } else if (startNum.value == 3 && n == 14) {
        n += 5;
      } else if (['A', 'B', 'C', 'D', 'E', 'X', 'Q'].includes(radioValue.value) && n == 13) {
        n += 7;
      } else {
        n += 1;
      }
      if (n > endNum.value) {
        if (!messageReactive) {
          messageReactive = window.$message.error('当前已处于最后一个牙位');
          setTimeout(() => {
            messageReactive = null;
          }, 3000);
        }
      } else {
        myRefs?.['iptRef' + n][0].focus();
      }
    }
  }
};

const clickHandle = (num, field) => {
  if (!myRefs?.['iptRef' + num][0].disabled) {
    formValue.value[field] = radioValue.value;
  }
};

// space和delete键盘事件
const keyupHandle = (e, num, field) => {
  let n = num;
  formValue.value[field] = '';
  // 开启自动输入删除后聚焦到前一个输入框
  if (inputFlag.value) {
    if (startNum.value == 2 && n == 18) {
      n -= 3;
    } else if (startNum.value == 3 && n == 19) {
      n -= 5;
    } else if (['A', 'B', 'C', 'D', 'E', 'X', 'Q'].includes(radioValue.value) && n == 20) {
      n -= 7;
    } else {
      n -= 1;
    }

    if (n < startNum.value) {
      if (!messageReactive) {
        messageReactive = window.$message.error('当前已处于第一个牙位');
        setTimeout(() => {
          messageReactive = null;
        }, 3000);
      }
    } else {
      myRefs?.['iptRef' + n][0].focus();
    }
  }
};

function updateFn(v) {
  radioValue.value = v;
}

// 图片改变时触发事件
function imagesChanged(options) {
  const { file, fileList } = options;
  if (fileList.some(item => file.id === item.id)) {
    // 添加图片逻辑
    const size = file.file?.size || 0;
    if (size / 1024 / 1024 > 5) {
      window.$message?.warning('文件大小不能超过5M！');
      return;
    }
    imagesUpload(file);
  } else {
    // 删除图片逻辑
    const index = formValue.value.photoUrl.map(item => item.id).indexOf(file.id);
    imageDelected(file.id, index);
  }
}
// 图片上传函数
async function imagesUpload(file) {
  // changeLoading();
  try {
    let f = file;
    f.name = 'file';
    const { data: res } = await uploadFile(f);
    formValue.value.photoUrl.push({
      id: res.data,
      name: res.data,
      status: 'finished',
      url: res.data
    });
    window.$message.success('上传成功');
  } finally {
    // changeLoading(false);
  }
}
// 图片删除函数
async function imageDelected(key, index) {
  formValue.value.photoUrl.splice(index, 1);
  window.$message?.success('删除成功！');
}

const init = () => {
  ctx = getCurrentInstance();
  myRefs = ctx.refs;
  myRefs?.['iptRef' + startNum.value][0].focus();
};

onMounted(() => {
  init();
});

defineExpose({
  boxRef
});
</script>
<style scoped lang="less">
.card {
  border: 2px solid #f1f1f1;
  background: rgba(255, 255, 255, 0.38);
  box-shadow: 0px 0px 8px 0px rgba(239, 239, 239, 0.8);
  border-radius: 18px;
  :deep(.n-card__content) {
    padding-bottom: 0 !important;
  }
}

:deep(.uploadCard .n-card__content) {
  padding: 0 !important;
}

.title {
  position: relative;
  span::after {
    content: ' ';
    width: 4px;
    height: 70%;
    transform: translateY(-50%);
    background: #3a88e3;
    border-radius: 1px;
    position: absolute;
    top: 50%;
    left: 0;
  }
}

.main::before {
  content: '';
  border: 1px solid #d6dafa;
  height: 1px;
  position: absolute;
  top: 49%;
  left: 3%;
  right: 3%;
}
.main::after {
  content: '';
  border: 1px solid #d6dafa;
  width: 1px;
  position: absolute;
  top: 8%;
  left: 50%;
  bottom: 10%;
}
.n-radio-button {
  padding: 3px 7px;
  border: 1px solid #979797;
}
.n-radio-button--checked {
  border: 1px solid #409eff !important;
  background: #409eff !important;
  color: #fff !important;
}
</style>
