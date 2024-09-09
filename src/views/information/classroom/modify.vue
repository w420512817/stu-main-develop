<template>
  <div class="text-primary text-8 pt-12px">
    <q-card title="基本情况">
      <q-form ref="formRef1" v-model:formValue="formValue" :config="config" :rules="rules" @change="handleChange" />
    </q-card>
    <q-card title="课桌椅情况" :bordered="false">
      <q-card inner title="课桌椅布置" size="small" :bordered="false" class="-ml-md">
        <q-form ref="formRef2" v-model:formValue="formValue" :config="config2" :rules="rules" inline />
      </q-card>
      <q-card inner title="课桌面照度" size="small" :bordered="false" class="-ml-md">
        <q-form ref="formRef3" v-model:formValue="formValue" :config="config3" :rules="rules" inline />
      </q-card>
    </q-card>
    <q-card title="黑板情况">
      <q-card inner title="黑板尺寸" size="small" :bordered="false" class="-ml-md">
        <q-form ref="formRef4" v-model:formValue="formValue" :config="config4" :rules="rules" inline />
      </q-card>
      <q-card inner title="黑板反射比：" size="small" :bordered="false" class="-ml-md">
        <q-form ref="formRef5" v-model:formValue="formValue" :config="config5" :rules="rules" inline />
      </q-card>
      <q-card inner title="黑板面照度：" size="small" :bordered="false" class="-ml-md">
        <q-form ref="formRef6" v-model:formValue="formValue" :config="config6" :rules="rules" inline />
      </q-card>
    </q-card>

    <q-card title="教室采光情况">
      <q-form ref="formRef7" v-model:formValue="formValue" :config="config7" :rules="rules" inline />
    </q-card>
    <q-footer :loading="loading" back-path="/information/classroom" @save="handleSubmit" />
  </div>
</template>

<script setup>
import { ref, reactive, unref, onMounted } from 'vue';
import QForm from '@common/qd-components/QForm/index.vue';
import QCard from '@common/qd-components/QCard/index.vue';
import QFooter from '@common/qd-components/QFooter/index.vue';
import { buildingDropSelectBox, FloorDropSelectBox, selectBoxByBuildId } from '@/api/information';
import { getClassroomDetail, editClassroom, addClassroom } from '@/api/information/classroom';
import { useRoute } from 'vue-router';
import { useGo } from '@common/hooks/usePage';
import useApi from '@common/hooks/business/useApi';
import useLoading from '@common/hooks/useLoading';
import { useTabs } from '@common/hooks/useTabs';
import { validateRef } from '@common/utils/form/validate';
import { rules } from './classroom.data';

const { fetch: getDetail } = useApi(getClassroomDetail);
const { query } = useRoute();
const { closeCurrent, setTitle } = useTabs();
const { go } = useGo();
const { loading, startLoading, endLoading } = useLoading();

const floorRef = ref();

const formRef1 = ref(null);
const formRef2 = ref(null);
const formRef3 = ref(null);
const formRef4 = ref(null);
const formRef5 = ref(null);
const formRef6 = ref(null);
const formRef7 = ref(null);

let formValue = reactive({});

const config = {
  layout: {
    gap: 90,
    cols: 3
  },
  columns: [
    {
      type: 'dropSelect',
      item: {
        label: '所属教学楼:',
        path: 'buildingId'
      },
      element: {
        'label-field': 'name',
        'value-field': 'id',
        placeholder: '请选择所属教学楼',
        'list-api': buildingDropSelectBox
      }
    },
    {
      type: 'dropSelect',
      item: {
        label: '所属楼层:',
        path: 'floorId',
        'label-field': 'name',
        'value-field': 'id'
      },
      element: {
        placeholder: '请选择楼层',
        'label-field': 'name',
        'value-field': 'id',
        'list-api': formValue.id ? FloorDropSelectBox : selectBoxByBuildId,
        params: { schoolId: formValue.schoolId, buildingId: formValue.buildingId },
        ref: floorRef
      }
    },

    {
      type: 'input',
      item: {
        label: '教室名称:',
        path: 'name'
      },
      element: {
        placeholder: '请输入教室名称',
        maxlength: 20
      }
    },
    {
      type: 'input',
      item: {
        label: '教室编号:',
        path: 'serialNumber'
      },
      element: {
        placeholder: '请输入教室编号'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '教室长度:',
        path: 'length'
      },
      element: {
        placeholder: '请输入教室长度',
        suffix: 'm'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '教室宽度:',
        path: 'width'
      },
      element: {
        placeholder: '请输入教室宽度',
        suffix: 'm'
      }
    }
  ]
};

const config2 = {
  layout: {
    gap: 90,
    cols: 2
  },
  columns: [
    {
      type: 'inputNumber',
      item: {
        label: '第一排课桌前沿到黑板距离：',
        path: 'frontDeskDistance'
      },
      element: {
        placeholder: '请输入距离',
        suffix: 'm'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '最后一排课桌前沿到黑板距离：',
        path: 'lastDeskDistance'
      },
      element: {
        placeholder: '请输入距离',
        suffix: 'm'
      }
    }
  ]
};

const config3 = {
  layout: {
    gap: 10
    // cols: 24
  },
  columns: [
    {
      type: 'inputNumber',
      item: {
        label: '课桌面照度：',
        path: 'desklxOne',
        span: 7
      },
      element: {
        placeholder: '请输入位置1课桌面照度',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        path: 'deskLxTwo',
        span: 4
      },
      element: {
        placeholder: '请输入位置2课桌面照度',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        path: 'deskLxThree',
        span: 4
      },
      element: {
        placeholder: '请输入位置3课桌面照度',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        path: 'deskLxFour',
        span: 4
      },
      element: {
        placeholder: '请输入位置4课桌面照度',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '课桌面最小照度：',
        path: 'deskLxMin',
        span: 7
      },
      element: {
        placeholder: '请输入课桌面最小照度',
        suffix: 'LX'
      }
    }
  ]
};

const config4 = {
  layout: {
    gap: 90,
    cols: 3
  },
  columns: [
    {
      type: 'inputNumber',
      item: {
        label: '黑板编号：',
        path: 'blackboardSerialNumber'
      },
      element: {
        placeholder: '请输入黑板编号'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '黑板长度：',
        path: 'blackboardLength'
      },
      element: {
        placeholder: '请输入黑板长度',
        suffix: 'm'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '黑板宽度：',
        path: 'blackboardWidth'
      },
      element: {
        placeholder: '请输入黑板宽度',
        suffix: 'm'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '悬挂高度：',
        path: 'blackboardRideHeight'
      },
      element: {
        placeholder: '请输入悬挂高度',
        suffix: 'm'
      }
    },
    {
      type: 'select',
      item: {
        label: '电子屏幕类型：',
        path: 'screenType'
      },
      element: {
        placeholder: '请输入电子屏幕类型',
        options: [
          { label: 'LED显示屏', value: 'LED显示屏' },
          { label: '液晶显示屏', value: '液晶显示屏' }
        ]
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '电子屏幕尺寸：',
        path: 'screenSize'
      },
      element: {
        placeholder: '请输入电子屏幕尺寸',
        suffix: 'm'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '电子屏幕高亮：',
        path: 'screenHighlight'
      },
      element: {
        placeholder: '请输入电子屏幕高亮',
        suffix: 'cd/㎡'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '电子屏幕分辨率：',
        path: 'screenPx'
      },
      element: {
        placeholder: '请输入电子屏幕分辨率',
        suffix: 'px'
      }
    }
  ]
};

const config5 = {
  layout: {
    gap: 90,
    cols: 3
  },
  columns: [
    {
      type: 'inputNumber',
      item: {
        label: '黑板入射照度：',
        path: 'blackboardIncomingLx'
      },
      element: {
        placeholder: '请输入黑板入射照度',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '黑板反射照度：',
        path: 'blackboardReflectLx'
      },
      element: {
        placeholder: '请输入黑板反射照度',
        suffix: 'LX'
      }
    }
  ]
};

const config6 = {
  layout: {
    gap: 10
  },
  columns: [
    {
      type: 'inputNumber',
      item: {
        label: '黑板面照度：',
        path: 'blackboardLxOne',
        span: 7
      },
      element: {
        placeholder: '黑板面照度1',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '',
        path: 'blackboardLxTwo',
        span: 4
      },
      element: {
        placeholder: '黑板面照度2',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '',
        path: 'blackboardLxThree',
        span: 4
      },
      element: {
        placeholder: '黑板面照度3',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '',
        path: 'blackboardLxFour',
        span: 4
      },
      element: {
        placeholder: '黑板面照度4',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '黑板面最小照度：',
        path: 'blackboardLxMin',
        span: 7
      },
      element: {
        placeholder: '请输入黑板面最小照度',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '黑板面均匀度：',
        path: 'blackboardUnif',
        span: 7
      },
      element: {
        placeholder: '请输入黑板面均匀度',
        suffix: 'LX'
      }
    }
  ]
};

const config7 = {
  layout: {
    gap: 20,
    cols: 4
  },
  columns: [
    {
      type: 'inputNumber',
      item: {
        label: '室内照度：',
        path: 'indoorLx'
      },
      element: {
        placeholder: '请输入室内照度',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '室外照度：',
        path: 'outdoorLx'
      },
      element: {
        placeholder: '请输入室外照度',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '采光系数：',
        path: 'daylightFactor'
      },
      element: {
        placeholder: '请输入采光系数',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '窗面积：',
        path: 'windowArea'
      },
      element: {
        placeholder: '请输入窗面积',
        suffix: '㎡'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '地面积：',
        path: 'landArea'
      },
      element: {
        placeholder: '请输入地面积',
        suffix: '㎡'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '后墙入射照度：',
        path: 'backwallIncomingLx'
      },
      element: {
        placeholder: '请输入后墙入射照度',
        suffix: 'LX'
      }
    },
    {
      type: 'inputNumber',
      item: {
        label: '后墙反射照度：',
        path: 'backwallReflectLx'
      },
      element: {
        placeholder: '请输入后墙反射照度',
        suffix: 'LX'
      }
    }
  ]
};

const handleChange = (path, value) => {
  if (path === 'buildingId') {
    unref(floorRef)?.getSelectData({ schoolId: value.schoolId, buildingId: value.buildingId });
    formValue.floorId = null;
  }
};

const handleSubmit = async () => {
  const errors = await validateRef(formRef1, formRef2, formRef3, formRef4, formRef5, formRef6, formRef7);
  if (!errors) {
    await handleModify();
    endLoading();
  } else {
    console.log(errors);
    window.$message.error('验证失败');
  }
};

const handleModify = async () => {
  try {
    startLoading();
    const api = formValue.id ? editClassroom : addClassroom;
    await api({ ...formValue });
    endLoading();
    closeCurrent();
    go({ path: '/information/classroom' });
  } finally {
    endLoading();
  }
};

const handleGetFormData = async () => {
  if (query.id) {
    const { classroom, classMonitor } = await getDetail({ id: query.id });
    classroom && Object.assign(formValue, classroom);
    classMonitor && Object.assign(formValue, classMonitor);
    if (classroom.floorId) {
      const { getSelectData: getSelectDataFloor } = unref(floorRef);
      getSelectDataFloor({ schoolId: formValue.schoolId, buildingId: formValue.buildingId });
    }
  }
};

const handleSetTitle = () => {
  query.id && setTitle('编辑教室');
};

handleSetTitle();

onMounted(() => {
  handleGetFormData();
});

defineOptions({
  name: 'ClassroomModify'
});
</script>

<style lang="less" scoped></style>
