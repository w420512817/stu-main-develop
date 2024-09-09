<template>
  <basic-modal
    v-bind="$attrs"
    class="w-220mm"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    :draggable="false"
    @register="register"
  >
    <div id="printDom" ref="printDom">
      <div
        v-for="item in state.receiveData"
        :key="item.studentId"
        class="w-210mm mt-30px"
        style="page-break-after: always"
      >
        <table class="table-temp" w-full cellspacing="0">
          <tbody>
            <tr>
              <td colspan="2" class="bg-[#d9d9d9] text-center">个人基本情况</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center">
                <div flex lh-8>
                  <underline label="姓名">{{ item.studentName }}</underline>
                  <underline label="性别" class="ml-40px">{{ item.sex }}</underline>
                  <underline label="身份证号/学籍卡号" class="ml-40px">{{ item.idcard || item.stuCode }}</underline>
                </div>
                <div flex lh-8>
                  <underline label="年级">{{ item.gradeName }}</underline>
                  <underline label="班级" class="ml-40px">{{ item.className }}</underline>
                </div>
                <div flex lh-8>
                  <underline label="学校所在地" />
                  <underline revert label="省（自治区）">{{ item.provinceName }}</underline>
                  <underline revert label="市">{{ item.cityName }}</underline>
                  <underline revert label="区（县、市）">{{ item.regionName }}</underline>
                </div>
                <div flex lh-8>
                  <underline label="学校">{{ item.schoolName }}</underline>
                </div>
                <div flex lh-8>
                  <div flex>
                    <underline label="出生日期" />
                    <underline revert label="年">{{ getTimes(item.birthDay, 'year') }}</underline>
                    <underline revert label="月">{{ getTimes(item.birthDay, 'month') }}</underline>
                    <underline revert label="日">{{ getTimes(item.birthDay, 'day') }}</underline>
                  </div>
                  <div flex class="ml-40px">
                    <underline label="检查时间" />
                    <underline revert label="年">{{ getTimes(item.screeningTime, 'year') }}</underline>
                    <underline revert label="月">{{ getTimes(item.screeningTime, 'month') }}</underline>
                    <underline revert label="日">{{ getTimes(item.screeningTime, 'day') }}</underline>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="bg-[#d9d9d9] text-center">脊柱弯曲异常筛查结果记录</td>
            </tr>
            <tr>
              <td colspan="2" class="font-bold bg-[#d9d9d9]">一、脊柱侧弯筛查</td>
            </tr>
            <tr>
              <td colspan="2" lh-8>
                <span font-bold> （1）一般检查： </span>
                {{ item.bendGeneralInspectionStr || '暂无' }}
              </td>
            </tr>
            <tr>
              <td rowspan="3" w-70px>
                <span font-bold> （2）前屈试验 </span>
              </td>
              <td>
                <span> 胸&emsp;段： {{ sourceDataEnum.anteriorFlexionThoracic[item.anteriorFlexionThoracic] }} </span>
              </td>
            </tr>
            <tr>
              <td>
                <span> 腰胸段： {{ sourceDataEnum.anteriorFlexionWaistChest[item.anteriorFlexionWaistChest] }} </span>
              </td>
            </tr>
            <tr>
              <td>
                <span> 腰&emsp;段： {{ sourceDataEnum.anteriorLumbarFlexion[item.anteriorLumbarFlexion] }} </span>
              </td>
            </tr>

            <tr>
              <td colspan="2">
                <div flex>
                  <div font-bold lh-8>（3）</div>
                  <div lh-8>
                    <div>
                      <span font-bold> 是否进行脊柱运动试验： </span>
                      <span>{{ ydTest(item) ? '是' : '否' }}</span>
                    </div>
                    <div>
                      <span font-bold> 躯干旋转测量仪检查： </span>
                      <span
                        >胸段ATR：{{ sourceDataEnum.thoracicSegmentAtr[item.thoracicSegmentAtr] || '暂无数据' }}
                      </span>
                      <span
                        >&nbsp;&nbsp;腰胸段ATR：{{
                          sourceDataEnum.thoracolumbarSegmentAtr[item.thoracolumbarSegmentAtr] || '暂无数据'
                        }}
                      </span>
                      <span
                        >&nbsp;&nbsp;腰段ATR：{{ sourceDataEnum.lumbarSegmentAtr[item.lumbarSegmentAtr] || '暂无数据' }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td colspan="2" class="font-bold bg-[#d9d9d9]">二、脊柱前后弯曲异常筛查</td>
            </tr>

            <tr>
              <td colspan="2">
                <span font-bold> （4）一般检查： </span>
                <span>{{ sourceDataEnum.bfBendGeneralInspection[item.bfBendGeneralInspection] }}</span>
              </td>
            </tr>

            <tr>
              <td colspan="2">
                <span font-bold> （5）俯卧试验： </span>
                <span>{{ sourceDataEnum.proneTest[item.proneTest] || '暂无数据' }}</span>
              </td>
            </tr>

            <tr>
              <td colspan="2" class="font-bold bg-[#d9d9d9]">三、疾病史</td>
            </tr>
            <tr>
              <td colspan="2">
                <span font-bold> （6）病史： </span>
                <span>{{ item.historyDisease || '无' }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div>
                  <div flex lh-8>
                    <div w-80px text-right>筛查结果：</div>
                    <div>{{ item.bfResult.result }}&nbsp;&nbsp;{{ item.bgResult.result }}</div>
                  </div>
                  <div flex lh-8>
                    <div w-80px text-right>建&emsp;&emsp;议：</div>
                    <div>{{ item.remark || '保持健康生活方式' }}</div>
                  </div>
                  <div flex justify-end lh-8>填表人/筛查人签名：{{ item.screeningUserName }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="isEmp" class="text-4 flex-center font-bold h-200px">暂无筛查报告~</div>
    </div>
    <div v-if="isImmPrint && !isEmp && !noPrint" class="text-4 text-center font-bold mt-4">
      <n-button type="primary" class="w-100px" @click="startPrint">打印</n-button>
    </div>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

import { useModalInner } from '@common/components/custom/Modal';
import underline from './underline.vue';
import Print from '@common/utils/print';
import { printScreeningReport, printScreeningReportWithMask } from '@/api/bigScreen/spine';

const sourceDataEnum = {
  // 一般检查

  bendGeneralInspection: {
    1: '正常',
    2: '双肩不等高',
    3: '双侧肩胛骨下角不等高',
    4: '两侧腰凹不对称',
    5: '双侧髂嵴不等高',
    6: '棘突连线倾斜或偏离正中线'
  },
  // 前屈胸段

  anteriorFlexionThoracic: {
    1: '无侧弯',
    2: '左低右高ATR＜5°',
    3: '左低右高ATR≥5°',
    4: '右低左高ATR＜5°',
    5: '右低左高ATR≥5°'
  },
  // 前屈腰胸段

  anteriorFlexionWaistChest: {
    1: '无侧弯',
    2: '左低右高ATR＜5°',
    3: '左低右高ATR≥5°',
    4: '右低左高ATR＜5°',
    5: '右低左高ATR≥5°'
  },
  spinalMovementTest: {
    1: '是',
    0: '否'
  },
  // 前屈腰段

  anteriorLumbarFlexion: {
    1: '无侧弯',
    2: '左低右高ATR＜5°',
    3: '左低右高ATR≥5°',
    4: '右低左高ATR＜5°',
    5: '右低左高ATR≥5°'
  },
  // 胸段ATR

  thoracicSegmentAtr: {
    1: 'ATR＜5°',
    2: '5°≤ATR＜7°',
    3: '7°≤ATR＜10°',
    4: 'ATR≥10°'
  },
  // 腰胸ATR

  thoracolumbarSegmentAtr: {
    1: 'ATR＜5°',
    2: '5°≤ATR＜7°',
    3: '7°≤ATR＜10°',
    4: 'ATR≥10°'
  },
  // 腰段ATR

  lumbarSegmentAtr: {
    1: 'ATR＜5°',
    2: '5°≤ATR＜7°',
    3: '7°≤ATR＜10°',
    4: 'ATR≥10°'
  },
  // 一般检查2

  bfBendGeneralInspection: {
    1: '正常',
    2: '前凸体征',
    3: '后凸体征'
  },
  // 俯卧试验

  proneTest: {
    1: '前后凸体征消失',
    2: '前凸体征',
    3: '后凸体征'
  },
  // 疾病史
  historyDisease: {
    1: '无',
    2: '脊柱弯曲异常家族史',
    3: '脊柱外伤病史',
    4: '脊柱手术病史'
  },
  // 建议
  suggestion: {
    1: '保持健康方式',
    2: '随访',
    3: '进一步检查确认'
  }
};

const [register] = useModalInner(data => {
  data && onDataReceive(data);
});

const isImmPrint = ref(false);
const noPrint = ref(false);
const isEmp = ref(false);
let state = reactive({
  receiveData: [],
  targetUrl: '',
  wxCodeImg: '',
  show: false,
  stuList: [],
  initData: {}
});

const printDom = ref(null);

const getTimes = computed(() => {
  return (time, type) => {
    let [year, month, day] = time.split('-');
    if (type === 'year') {
      return year;
    } else if (type === 'month') {
      return month;
    } else if (type === 'day') {
      return day;
    } else {
      return '';
    }
  };
});

async function onDataReceive(data) {
  const { studentIds, orgId, planId, isDesensitization } = data;
  const params = {
    studentIds: studentIds.toString(),
    orgId,
    planId
  };
  let api = isDesensitization ? printScreeningReportWithMask : printScreeningReport;
  const res = await api(params);
  res.forEach(item => {
    item.suggestion = item.suggestion
      ?.split(',')
      .map(key => sourceDataEnum.suggestion[key])
      .join('；');

    item.historyDisease = item.historyDisease
      ?.split(',')
      .map(key => sourceDataEnum.historyDisease[key])
      .join('；');

    item.bendGeneralInspectionStr = item.bendGeneralInspection
      ?.split(',')
      .map(key => sourceDataEnum.bendGeneralInspection[key])
      .join('；');
  });
  state.receiveData = res;
  isEmp.value = !res.length;
  isImmPrint.value = data.noImmPrint;
  noPrint.value = data.noPrint;
  if (data.noImmPrint || !res.length) return;
  setTimeout(() => {
    startPrint();
  }, 500);
}

async function startPrint() {
  window.$message.loading('打印准备中......', { duration: 5000 });
  setTimeout(() => {
    Print(printDom.value);
  }, 1000);
}

function ydTest(item) {
  let { bendGeneralInspection, anteriorFlexionThoracic, anteriorFlexionWaistChest, anteriorLumbarFlexion } = item;
  let arr = [bendGeneralInspection, anteriorFlexionThoracic, anteriorFlexionWaistChest, anteriorLumbarFlexion];
  return arr.some(v => v != '1');
}
</script>
<style scoped lang="less">
.table-temp {
  td,
  th {
    --at-apply: b-(1 dark) px-4 py-2;
  }
  .tc {
    text-align: center;
    white-space: nowrap;
  }
}
.mblock {
  min-width: 14.5px;
  min-height: 18px;
  border: 1px solid #000;
  margin-right: 5px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  line-height: 18px;
}
.active {
  border-color: #000;
  border-width: 10px 5px;
  line-height: 0;
  padding: 0;
}
.inp {
  display: inline-block;
  min-width: 50px;
  font-weight: bold;
  text-align: center;
  padding: 0 4px;
  line-height: 1;
  border-bottom: 1px solid #000;
  font-size: 15px;
  white-space: nowrap;
}
</style>
