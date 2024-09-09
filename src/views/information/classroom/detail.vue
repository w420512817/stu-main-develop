<template>
  <div class="text-primary text-8">
    <n-spin :show="loading">
      <n-form>
        <n-card
          title="基本情况"
          class="bolder-card shadow-sm mb-md"
          header-style="border-bottom: 1px solid #eee;margin-bottom: 26px;font-size: 18px; height: 52px"
        >
          <template #header-extra> {{ formValue.updateTime }} </template>
          <!-- <p
            class="bg-info_active border border-primary text-primary p-10px flex items-center mb-20px b-rd-1 -ml-24px -mt-26px w-103.7%"
          >
            <icon-carbon:information class="text-16px" />
            <icon-octicon:arrow-up class="text-22px pl-2 text-error font-700 text-5 color-red-6" />
            <n-text class="text-primary"> 过高 </n-text>
            <icon-octicon:arrow-down class="text-22px pl-2 text-error font-700 text-5 color-red-6" />
            <n-text class="text-primary"> 过低，标注则为异常，表示数据异常；未标注表示正常。 </n-text>
          </p> -->
          <n-grid x-gap="10" :cols="4" mt-sm>
            <n-gi>
              <n-form-item-gi label="教室名称"> {{ formValue.name }} </n-form-item-gi>
            </n-gi>
            <n-gi>
              <n-form-item label="教室编号"> {{ formValue.serialNumber }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="学校名称"> {{ formValue.schoolName }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="当前关联班级"> {{ formValue.className }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="男生人数">{{ formValue.boyNumber }} 人 </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="女生人数"> {{ formValue.girlNumber }} 人 </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="教室长"> {{ formValue.length }} m </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="教室宽"> {{ formValue.width }} m </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="人均面积">{{ formValue.personAvgArea }} ㎡ </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="所属教学楼">{{ formValue.buildingName }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="所属楼层"> {{ formValue.floorName }} </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
        <n-card
          title="课桌椅情况"
          class="bolder-card shadow-sm mb-md"
          header-style="border-bottom: 1px solid #eee;margin-bottom: 26px;font-size: 18px;height: 52px"
        >
          <n-card :bordered="false" size="small" title="课桌椅布置" class="-mt-3 -ml-2.5">
            <n-grid x-gap="10" :cols="4">
              <n-gi>
                <n-form-item label="第一排课桌前沿到黑板距离"> {{ formValue.frontDeskDistance }} m </n-form-item>
                <!-- <div class="text-center color-white bg-cool-gray-600 w-136px h-45px ml-50px -mt-50px mb-20px b-rd-1">
                  标准范围：
                  <p ml-5px>&lt;=2.2m</p>
                </div> -->
              </n-gi>
              <n-gi>
                <n-form-item label="最后一排课桌前沿到黑板距离"> {{ formValue.lastDeskDistance }} m </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card :bordered="false" size="small" title="课桌面照度" class="-mt-3 -ml-2.5">
            <n-grid x-gap="10" :cols="4">
              <n-gi>
                <n-form-item label="课桌面照度"
                  >{{ formValue.desklxOne }} LX {{ formValue.deskLxTwo }} LX {{ formValue.deskLxThree }} LX
                  {{ formValue.deskLxFour }} LX
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="课桌面平均照度"> {{ formValue.deskAvgLx }} LX </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="课桌面最小照度"> {{ formValue.deskLxMin }} LX </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="课桌面照度均匀度"> {{ formValue.deskLxUnif }} LX </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
        </n-card>
        <n-card
          title="黑板情况"
          class="bolder-card shadow-sm mb-md"
          header-style="border-bottom: 1px solid #eee;margin-bottom: 26px;font-size: 18px;height: 52px"
        >
          <n-card :bordered="false" size="small" title="黑板尺寸" class="-mt-md -ml-2.5">
            <n-grid x-gap="10" :cols="4">
              <n-gi>
                <n-form-item label="黑板编号"> {{ formValue.blackboardSerialNumber }} </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板宽"> {{ formValue.blackboardWidth }} m </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板高">{{ formValue.blackboardLength }} m </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="悬挂高度"> {{ formValue.blackboardRideHeight }} m </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="电子屏幕">
                  <n-space vertical>
                    <n-text> 类型：{{ formValue.screenType }} </n-text>
                    <n-text> 尺寸：{{ formValue.screenSize }} cm </n-text>
                    <n-text> 高亮：{{ formValue.screenHighlight }} cd/㎡ </n-text>
                    <n-text> 分辨率：{{ formValue.screenPx }} px </n-text>
                  </n-space>
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card :bordered="false" size="small" title="黑板反射比" class="-mt-md -ml-2.5">
            <n-grid x-gap="10" :cols="4">
              <n-gi>
                <n-form-item label="黑板入射照度"> {{ formValue.blackboardIncomingLx }} LX </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板反射照度"> {{ formValue.blackboardReflectLx }} LX </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板反射比"> {{ formValue.blackboardReflect }} </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板平均反射比"> {{ formValue.blackboardReflect }}</n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card :bordered="false" size="small" title="黑板面照度" class="-mt-md -ml-2.5">
            <n-grid x-gap="10" :cols="4">
              <n-gi>
                <n-form-item label="黑板面照度"
                  >{{ formValue.blackboardLxOne }} LX {{ formValue.blackboardLxTwo }} LX
                  {{ formValue.blackboardLxThree }} LX {{ formValue.blackboardLxFour }} LX
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板面平均照度"> {{ formValue.blackboardAvgLx }} LX </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板面最小照度"> {{ formValue.blackboardLxMin }} LX </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板面均匀度"> {{ formValue.blackboardUnif }} LX </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
        </n-card>
        <n-card
          title="教室采光情况"
          class="bolder-card shadow-sm mb-md"
          header-style="border-bottom: 1px solid #eee;margin-bottom: 26px;font-size: 18px;height: 52px"
        >
          <n-grid x-gap="10" :cols="4">
            <n-gi>
              <n-form-item label="室内照度"> {{ formValue.indoorLx }} LX </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="室外照度"> {{ formValue.outdoorLx }} LX </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="采光系数"> {{ formValue.daylightFactor }}</n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="窗面积"> {{ formValue.windowArea }} ㎡ </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="地面积">{{ formValue.landArea }} ㎡ </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="窗地面积比"> {{ formValue.windowLandRate }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="后墙入射照度"> {{ formValue.backwallIncomingLx }} LX </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="后墙反射照度">{{ formValue.backwallReflectLx }} LX </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="后墙反射比"> {{ formValue.backwallReflectRate }} </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
      </n-form>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, provide } from 'vue';
import { useRoute } from 'vue-router';
import { getDetail } from '@/api/information/classroom.js';

const { query } = useRoute();
provide('query', query);
const formValue = reactive({});
const loading = ref(false);

onBeforeMount(async () => {
  loading.value = true;
  const data = await getDetail({ id: query.id, orgProperty: query.orgProperty });
  if (data && data?.name) {
    for (let key in data) {
      data[key] = data[key] ?? '/';
    }
    Object.assign(formValue, data);
  }

  loading.value = false;
});
defineOptions({ name: 'classroomDetail' });

// onBeforeMount(async () => {
//   if (query.id) {
//     const { id, orgProperty } = query;
//     const params = { id, orgProperty };
//     loading.value = true;
//     try {
//       const data = await getDetail(params);
//       data && Object.assign(formValue, data, { switch: !!data.isDataMasking });
//     } catch (error) {
//     } finally {
//       loading.value = false;
//     }
//   }
// });

// function getDetail() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve({});
//     }, 1000);
//   });
// }
</script>

<style scoped lang="less">
:deep(.n-card-header__main) {
  font-weight: 700 !important;
}
</style>
