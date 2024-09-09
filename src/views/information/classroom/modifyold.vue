<template>
  <div class="text-primary text-8">
    <n-spin :show="loading">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        :show-require-mark="false"
      >
        <n-card
          :title="formValue.id ? '基本情况' : '新建教室'"
          class="bolder-card shadow-sm mb-md"
          header-style="border-bottom: 1px solid #eee;margin-bottom: 26px;font-size: 18px;height: 52px"
        >
          <n-grid x-gap="10" :cols="3" class="-ml-25">
            <n-gi>
              <n-form-item
                label="所属教学楼："
                path="buildingId"
                :show-require-mark="true"
                require-mark-placement="left"
              >
                <drop-select
                  v-model:value="formValue.buildingId"
                  :list-api="buildingDropSelectBox"
                  :params="{ schoolId: formValue.schoolId }"
                  keyword="name"
                  label-field="name"
                  value-field="id"
                  filterable
                  clearable
                  placeholder="请选择所属教学楼"
                  @update:value="updateBuild"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="所属楼层：" path="floorId" :show-require-mark="true" require-mark-placement="left">
                <drop-select
                  ref="floorRef"
                  v-model:value="formValue.floorId"
                  :list-api="formValue.id ? FloorDropSelectBox : selectBoxByBuildId"
                  :params="{ schoolId: formValue.schoolId, buildingId: formValue.buildingId }"
                  keyword="name"
                  label-field="name"
                  value-field="id"
                  filterable
                  clearable
                  placeholder="请选择楼层"
                  @update:value="updateFloor"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="教室名称：" path="name" :show-require-mark="true" require-mark-placement="left">
                <n-input v-model:value="formValue.name" placeholder="请输入教室信息" maxlength="20" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item
                label="教室编号："
                path="serialNumber"
                :show-require-mark="true"
                require-mark-placement="left"
              >
                <n-input v-model:value="formValue.serialNumber" placeholder="请输入教室编号" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="教室长度：" path="length">
                <n-input v-model:value="formValue.length" placeholder="请输入教室长度">
                  <template #suffix> m</template>
                </n-input>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="教室宽度：" path="width">
                <n-input v-model:value="formValue.width" placeholder="请输入教室宽度">
                  <template #suffix> m</template>
                </n-input>
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
        <n-card
          title="课桌椅情况"
          class="bolder-card shadow-sm mb-md"
          header-style="border-bottom: 1px solid #eee;margin-bottom: 26px;font-size: 18px;height: 52px"
        >
          <n-card :bordered="false" size="small" title="课桌椅布置" class="-ml-md">
            <n-grid x-gap="10" :cols="2" class="-ml-md">
              <n-gi mr-100px>
                <n-form-item label="第一排课桌前沿到黑板距离：" path="frontDeskDistance">
                  <n-input v-model:value="formValue.frontDeskDistance" placeholder="请输入距离">
                    <template #suffix> m</template>
                  </n-input>
                </n-form-item>
              </n-gi>
              <n-gi ml-25>
                <n-form-item label="最后一排课桌前沿到黑板距离：" path="lastDeskDistance">
                  <n-input v-model:value="formValue.lastDeskDistance" placeholder="请输入距离">
                    <template #suffix> m</template>
                  </n-input>
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card :bordered="false" size="small" title="课桌面照度" class="-ml-md">
            <n-grid x-gap="10" cols="5">
              <n-form-item-gi label="课桌面照度：" path="desklxOne" class="-ml-110px w-420px">
                <n-input v-model:value="formValue.desklxOne" placeholder="请输入位置1课桌面照度">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item-gi>
              <n-form-item-gi path="deskLxTwo" ml-17 w-210px>
                <n-input v-model:value="formValue.deskLxTwo" placeholder="请输入位置2课桌面照度">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item-gi>
              <n-form-item-gi path="deskLxThree" ml-10 w-210px>
                <n-input v-model:value="formValue.deskLxThree" placeholder="请输入位置3课桌面照度">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item-gi>
              <n-form-item-gi path="deskLxFour" ml-2 w-210px>
                <n-input v-model:value="formValue.deskLxFour" placeholder="请输入位置4课桌面照度">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item-gi>
            </n-grid>
            <n-grid x-gap="10" :cols="3" class="-ml-20">
              <n-gi>
                <n-form-item label="课桌面最小照度：" path="deskLxMin">
                  <n-input v-model:value="formValue.deskLxMin" placeholder="请输入课桌面最小照度">
                    <template #suffix> LX </template>
                  </n-input>
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
        </n-card>
        <n-card
          title="黑板情况"
          class="bolder-card shadow-sm mb-md"
          header-style="border-bottom: 1px solid #eee;margin-bottom: 26px;font-size: 18px;height: 52px"
        >
          <n-card :bordered="false" size="small" title="黑板尺寸" class="-ml-md">
            <n-grid x-gap="10" :cols="3" class="-ml-124px">
              <n-gi>
                <n-form-item label="黑板编号：" path="blackboardSerialNumber">
                  <n-input v-model:value="formValue.blackboardSerialNumber" placeholder="请输入黑板编号" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板长度：" path="blackboardLength">
                  <n-input v-model:value="formValue.blackboardLength" placeholder="请输入黑板长度">
                    <template #suffix>m</template>
                  </n-input>
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板宽度：" path="blackboardWidth">
                  <n-input v-model:value="formValue.blackboardWidth" placeholder="请输入黑板宽度">
                    <template #suffix> m </template>
                  </n-input>
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="悬挂高度：" path="blackboardRideHeight">
                  <n-input v-model:value="formValue.blackboardRideHeight" placeholder="请输入悬挂高度">
                    <template #suffix> m </template>
                  </n-input>
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="电子屏幕类型：">
                  <n-select
                    v-model:value="formValue.screenType"
                    :options="[
                      { label: 'LED显示屏', value: 'LED显示屏' },
                      { label: '液晶显示屏', value: '液晶显示屏' }
                    ]"
                    placeholder="请选择电子屏幕类型"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="电子屏幕尺寸：" path="screenSize">
                  <n-input v-model:value="formValue.screenSize" placeholder="请输入尺寸" />
                </n-form-item>
              </n-gi>
              <n-gi ml-30px>
                <n-form-item label="电子屏幕高亮：" path="screenHighlight">
                  <n-input v-model:value="formValue.screenHighlight" placeholder="请输入电子屏幕高亮度">
                    <template #suffix> cd/㎡ </template>
                  </n-input>
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="电子屏幕分辨率：" path="screenPx">
                  <n-input v-model:value="formValue.screenPx" placeholder="请输入电子屏幕分辨率">
                    <template #suffix> px </template>
                  </n-input>
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card :bordered="false" size="small" title="黑板反射比" class="-ml-md">
            <n-grid x-gap="10" :cols="3" class="-ml-94px">
              <n-gi>
                <n-form-item label="黑板入射照度：" path="blackboardIncomingLx">
                  <n-input v-model:value="formValue.blackboardIncomingLx" placeholder="请输入黑板入射照度">
                    <template #suffix> LX </template>
                  </n-input>
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板反射照度：" path="blackboardReflectLx">
                  <n-input v-model:value="formValue.blackboardReflectLx" placeholder="请输入黑板反射照度">
                    <template #suffix> LX </template>
                  </n-input>
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card :bordered="false" size="small" title="黑板面照度" class="-ml-md">
            <n-grid x-gap="10" cols="5">
              <n-form-item-gi label="黑板面照度：" path="blackboardLxOne" class="-ml-110px w-420px">
                <n-input v-model:value="formValue.blackboardLxOne" placeholder="黑板面照度1">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item-gi>
              <n-form-item-gi path="blackboardLxTwo" ml-17 w-210px>
                <n-input v-model:value="formValue.blackboardLxTwo" placeholder="黑板面照度2">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item-gi>
              <n-form-item-gi path="blackboardLxThree" ml-10 w-210px>
                <n-input v-model:value="formValue.blackboardLxThree" placeholder="黑板面照度3">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item-gi>
              <n-form-item-gi path="blackboardLxFour" ml-2 w-210px>
                <n-input v-model:value="formValue.blackboardLxFour" placeholder="黑板面照度4">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item-gi>
            </n-grid>
            <n-grid x-gap="10" :cols="3" class="-ml-82px">
              <n-gi>
                <n-form-item label="黑板面最小照度：" path="blackboardLxMin">
                  <n-input v-model:value="formValue.blackboardLxMin" placeholder="请输入黑板面最小照度">
                    <template #suffix> LX </template>
                  </n-input>
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="黑板面均匀度：" path="blackboardUnif">
                  <n-input v-model:value="formValue.blackboardUnif" placeholder="请输入黑板面均匀度">
                    <template #suffix> LX </template>
                  </n-input>
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
        </n-card>
        <n-card
          title="教室采光情况"
          class="bolder-card shadow-sm mb-md"
          header-style="border-bottom: 1px solid #eee;margin-bottom: 26px;font-size: 18px;height: 52px"
        >
          <n-grid x-gap="10" :cols="3" class="-ml-116px">
            <n-gi>
              <n-form-item label="室内照度：" path="indoorLx">
                <n-input v-model:value="formValue.indoorLx" placeholder="请输入室内照度">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="室外照度：" path="outdoorLx">
                <n-input v-model:value="formValue.outdoorLx" placeholder="请输入室外照度">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="采光系数：" path="daylightFactor">
                <n-input v-model:value="formValue.daylightFactor" placeholder="请输入采光系数" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="窗面积：" path="windowArea">
                <n-input v-model:value="formValue.windowArea" placeholder="请输入窗面积">
                  <template #suffix> ㎡ </template>
                </n-input>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="地面积：" path="landArea">
                <n-input v-model:value="formValue.landArea" placeholder="请输入地面积">
                  <template #suffix> ㎡ </template>
                </n-input>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="后墙入射照度：" path="backwallIncomingLx">
                <n-input v-model:value="formValue.backwallIncomingLx" placeholder="请输入后墙入射照度">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item>
            </n-gi>
            <n-gi ml-28px>
              <n-form-item label="后墙反射照度：" path="backwallReflectLx">
                <n-input v-model:value="formValue.backwallReflectLx" placeholder="请输入后墙反射照度">
                  <template #suffix> LX </template>
                </n-input>
              </n-form-item>
            </n-gi>
          </n-grid>
          <n-card class="text-center mb-50px mt-10">
            <n-button type="primary" :disabled="loading" class="ml-70% rd-1" @click="submit">保存</n-button>
            <n-button ghost ml-lg @click="go('/information/classroom')">返回</n-button>
          </n-card>
        </n-card>
      </n-form>
    </n-spin>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, provide, unref, nextTick } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useRoute } from 'vue-router';
import { useGo } from '@common/hooks/usePage';
import { useTabs } from '@common/hooks/useTabs';
import { rules } from './classroom.data';
import { buildingDropSelectBox, FloorDropSelectBox, selectBoxByBuildId } from '@/api/information';
import { getClassroomDetail, editClassroom, addClassroom, selectBox } from '@/api/information/classroom';

const { go } = useGo();
const { query } = useRoute();
const { closeCurrent, setTitle } = useTabs();
provide('query', query);

const originData = {
  buildingId: null,
  floorId: null,
  id: null,
  name: null,
  serialNumber: null
};
const formValue = reactive(cloneDeep(originData));
const loading = ref(false);
const formRef = ref();
const floorRef = ref();

const updateBuild = async () => {
  await nextTick();
  formValue.floorId = null;
  formValue.name = null;
  const { getSelectData: getSelectDataFloor } = unref(floorRef);

  // 更新下拉列表
  getSelectDataFloor();
};

const updateFloor = async (val, option) => {
  await nextTick();
  formValue.name = null;
  // formValue.floorId = null;
  getClassroom(option.id);
};

const getClassroom = async id => {
  // 获取 教室名称
  const data = await selectBox({ id });
  formValue.floorId = id;
  formValue.classroomName = data;
};

/**
 * 校验
 */
function validateItems() {
  return new Promise(resolve => {
    formRef.value.validate(errors => {
      if (!errors) {
        resolve(true);
      } else {
        // window.$message.error('教室编号为6位数的阿拉伯数字');
        throw new Error('表单验证错误');
      }
    });
  });
}
/**
 * 提交
 */
function submit() {
  validateItems().then(res => {
    if (res) {
      onModify();
    }
  });
}
const onModify = async () => {
  try {
    const api = formValue.id ? editClassroom : addClassroom;
    await api({ ...formValue });
    go({ path: '/information/classroom' });
    closeCurrent();
  } finally {
    console.log('finally');
  }
};

onBeforeMount(async () => {
  if (query.id) {
    setTitle('编辑教室');
    const { classroom, classMonitor } = await getClassroomDetail({ id: query.id });
    classroom && Object.assign(formValue, classroom);
    classMonitor && Object.assign(formValue, classMonitor);
    await nextTick();
    if (classroom.floorId) {
      const { getSelectData: getSelectDataFloor } = unref(floorRef);
      getSelectDataFloor();
      getClassroom(classroom.floorId);
    }
  }
});

defineOptions({
  name: 'ClassroomModify'
});
</script>

<style scoped lang="less">
:deep(.n-card-header__main) {
  font-weight: 700 !important;
}
:deep(.n-input__suffix) {
  width: 38px;
  margin-right: -12px;
  border: 1px solid #000;
  z-index: 20;
}
</style>
