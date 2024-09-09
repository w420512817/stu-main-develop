<template>
  <!-- 
    1: 支持多个form绑定
    2: 可以命中数据做自定义布局
    3: 输入框类型 input select 
   -->
  <div>
    {{ JSON.stringify(formValue, null, 2) }}
    <q-card title="基本情况">
      <q-form
        ref="formRef1"
        v-model:formValue="formValue"
        :config="config"
        :rules="rules"
        inline
        @change="handleChange"
      >
        <!-- <template #header>
          <h1>滕王阁序</h1>
        </template> -->
        <!-- <div #custom name="floor"></div> -->

        <template #mycustom>
          <div>这是个自定义插槽</div>
        </template>
        <!-- <div #custom name="name"></div> -->
        <!-- 默认插槽 -->
        <n-form-item :span="12" label="Input" path="inputValue">
          <n-input v-model:value="formValue.outvalue" placeholder="Input" />
        </n-form-item>
      </q-form>
    </q-card>
    <!-- 
    <q-card title="课桌椅情况">
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
    </q-card> -->

    <n-button type="primary" @click="handleSubmit(formValue)">提交</n-button>
  </div>
</template>

<script setup>
import QForm from '@common/qd-components/QForm/index.vue';
import QCard from '@common/qd-components/QCard/index.vue';
import { buildingDropSelectBox, FloorDropSelectBox, selectBoxByBuildId } from '@/api/information';
import { rules } from './classroom.data';

import { ref, reactive, unref, getCurrentInstance, watch, computed } from 'vue';
const floorRef = ref();

const formRef1 = ref(null);
const formRef2 = ref(null);
// const formRef3 = ref(null);

const instance = getCurrentInstance();

console.log(instance, 'instance');

let formValue = reactive({
  user: {
    name: '11'
  },
  floorId: '1092640802873088',

  buildingId: '1092640691437312',
  serialNumber: '101010',
  outvalue: '222',
  formValue: '11',
  length: '22'
  // birth: ''
});

const myOptions = [
  { label: '鲁班大师', value: 'luban' },
  { label: '安琪拉', value: 'anqila' },
  { label: '凯', value: 'kai' }
];

const autoCompleteOptions = computed(() => {
  return ['@gmail.com', '@163.com', '@qq.com'].map(suffix => {
    const prefix = formValue?.autoCompleteValue?.split('@')[0];
    return {
      label: prefix + suffix,
      value: prefix + suffix
    };
  });
});

const cascaderOptions = [
  {
    label: 'groode',
    value: 'groode',
    children: [
      {
        label: 'veli good',
        value: 'veli good'
      }
    ]
  }
];

// const generalOptions = ['groode', 'veli good', 'emazing', 'lidiculous'].map(v => ({
//   label: v,
//   value: v
// }));
const treeSelectOptions = [
  {
    label: 'Rubber Soul',
    key: 'Rubber Soul',
    children: [
      {
        label: 'Drive My Car',
        key: 'Drive My Car'
      },
      {
        label: 'Michelle',
        key: 'Michelle'
      }
    ]
  }
];

let config = computed(() => {
  return {
    layout: {
      gap: 10,
      cols: 3
    },
    columns: [
      {
        type: 'custom',
        key: 'col',
        slot: 'mycustom',
        item: {
          span: 3
        }
      },
      {
        type: 'select',
        item: {
          label: '动态select',
          path: 'select'
        },
        element: {
          placeholder: '请选择所属教学楼',
          options: [
            { label: 'LED显示屏', value: '1' },
            { label: '液晶显示屏', value: '2' }
          ]
        }
      },

      {
        type: 'dropSelect',
        hidden: formValue.select == 1,
        item: {
          label: `所属教学楼:`,
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
          label: 'textarea:',
          path: 'user.name2'
        },
        element: {
          placeholder: '请输入教室名称',
          maxlength: 20,
          type: 'textarea',
          autosize: {
            minRows: 3,
            maxRows: 5
          }
        }
      },
      {
        type: 'switch',
        item: {
          label: 'switch:',
          path: 'myswitch'
        },
        element: {}
      },
      {
        type: 'checkBoxGroup',
        item: {
          label: 'checkbox-group:',
          path: 'myCheckBoxGroup'
        },
        element: {
          options: myOptions
        }
      },
      {
        type: 'radioGroup',
        item: {
          label: 'radio-group:',
          path: 'myRadioGroup'
        },
        element: {
          options: myOptions
        }
      },
      {
        type: 'inputNumber',
        item: {
          label: 'inputNumber:',
          path: 'myInputNumber'
        },
        element: {
          placeholder: '只能输入number'
        }
      },
      {
        type: 'dataPicker',
        item: {
          label: '出生日期1',
          path: 'birth'
        },
        element: {
          placeholder: '请选择出生日期',
          type: 'datetime'
        }
      },
      {
        type: 'slider',
        item: {
          label: 'mySlider',
          path: 'slider'
        },
        element: {
          placeholder: '请选择slider',
          step: 5
        }
      },
      {
        type: 'transfer',
        item: {
          label: 'myTransfer',
          path: 'transfer'
        },
        element: {
          placeholder: '请选择transfer',
          options: myOptions
        }
      },
      {
        type: 'autoComplete',
        item: {
          label: 'myAutoComplete',
          path: 'autoCompleteValue'
        },
        element: {
          placeholder: '请选择autoComplete',
          options: autoCompleteOptions
        }
      },
      {
        type: 'treeSelect',
        item: {
          label: 'myTreeSelect',
          path: 'QTreeSelect'
        },
        element: {
          placeholder: '请选择autoComplete',
          options: treeSelectOptions
        }
      },
      {
        type: 'cascader',
        item: {
          label: 'myCascader',
          path: 'cascader'
        },
        element: {
          placeholder: '请选择cascader',
          options: cascaderOptions
        }
      },
      {
        type: 'timePicker',
        item: {
          label: 'myTimePicker',
          path: 'timePicker'
        },
        element: {
          placeholder: '请选择cascader'
        }
      },
      {
        type: 'colorPicker',
        item: {
          label: 'myColorPicker',
          path: 'colorPicker'
        },
        element: {
          placeholder: '请选择colorPicker'
        }
      },
      {
        type: 'input',
        item: {
          label: '教室名称:',
          path: 'user.name'
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
        type: 'input',
        item: {
          label: '教室长度：:',
          path: 'formValue'
        },
        element: {
          placeholder: '请输入教室长度',
          suffix: 'm'
        }
      },
      {
        type: 'input',
        item: {
          label: '教室宽度:',
          path: 'length'
        },
        element: {
          placeholder: '请输入教室宽度',
          suffix: 'm'
        }
      }
    ]
  };
});
// 更新config
// const updateConfig = (config, key, obj) => {
//   config.value.columns.forEach(item => {
//     if (item.item.path === key) {
//       Object.assign(item, obj);
//     }
//   });
//   console.log(config, 'shitshit');
// };

const handleChange = (path, value) => {
  console.log(path, value, 'pathvalue');
  console.log(config.value.columns, 'config');

  // updateConfig(config, 'buildingId', {
  //   hidden: formValue.select == 1
  // });

  // config.value.columns.map(item => {
  //   if (item.item.path === 'buildingId') {
  //     item.hidden = formValue.select == 1;
  //   }
  // });

  // const columns = ref({
  //   type: 'dropSelect',
  //   hidden: formValue.select == 1,
  //   item: {
  //     label: `所属教学楼:${formValue.select}`,
  //     path: 'buildingId'
  //   },
  //   element: {
  //     'label-field': 'name',
  //     'value-field': 'id',
  //     placeholder: '请选择所属教学楼',
  //     'list-api': buildingDropSelectBox
  //   }
  // });

  // config.value.columns = [...config.value.columns, columns.value];
  console.log(config.value, 'config.valueconfig.valueconfig.value');
  // formRef1.value.forceUpdate();
  console.log(config, 'confignew');
};
// config = {
//   layout: {
//     gap: 10,
//     cols: 3
//   },
//   columns: [
//     {
//       type: 'custom',
//       key: 'col',
//       slot: 'mycustom',
//       item: {
//         span: 3
//       }
//     },
//     {
//       type: 'dropSelect',

//       item: {
//         label: '所属教学楼:',
//         path: 'buildingId',
//         span: 3,

//         'show-require-mark': true
//       },
//       element: {
//         'label-field': 'name',
//         'value-field': 'id',
//         placeholder: '请选择所属教学楼',
//         'list-api': buildingDropSelectBox
//       }
//     },
//     {
//       type: 'dropSelect',
//       item: {
//         label: '所属楼层:',
//         path: 'floorId',
//         'label-field': 'name',
//         'value-field': 'id',
//         'show-require-mark': true
//       },
//       element: {
//         placeholder: '请选择楼层',
//         'label-field': 'name',
//         'value-field': 'id',
//         'list-api': formValue.id ? FloorDropSelectBox : selectBoxByBuildId,
//         // params: { schoolId: formValue.schoolId, buildingId: formValue.buildingId },
//         ref: floorRef
//       }
//     },

//     {
//       type: 'input',
//       item: {
//         label: '教室名称:',
//         path: 'name'
//       },
//       element: {
//         placeholder: '请输入教室名称',
//         maxlength: 20
//       }
//     },
//     {
//       type: 'input',
//       item: {
//         label: '教室编号:',
//         path: 'serialNumber'
//       },
//       element: {
//         placeholder: '请输入教室编号'
//       }
//     },
//     {
//       type: 'input',
//       item: {
//         label: '教室长度：:',
//         path: 'formValue'
//       },
//       element: {
//         placeholder: '请输入教室长度',
//         suffix: 'm'
//       }
//     },
//     {
//       type: 'input',
//       item: {
//         label: '教室宽度:',
//         path: 'length'
//       },
//       element: {
//         placeholder: '请输入教室宽度',
//         suffix: 'm'
//       }
//     }
//   ]
// };

// const config2 = {
//   layout: {
//     gap: 10,
//     cols: 2
//   },
//   columns: [
//     {
//       type: 'input',
//       label: '第一排课桌前沿到黑板距离：',
//       path: 'frontDeskDistance',
//       placeholder: '请输入距离',
//       suffix: 'm'
//     },
//     {
//       type: 'input',
//       label: '最后一排课桌前沿到黑板距离：',
//       path: 'lastDeskDistance',
//       placeholder: '请输入距离',
//       suffix: 'm'
//     }
//   ]
// };

// const config3 = {
//   layout: {
//     gap: 10,
//     cols: 4
//   },
//   columns: [
//     {
//       type: 'input',
//       label: '课桌面照度：',
//       path: 'desklxOne',
//       placeholder: '请输入位置1课桌面照度',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '',
//       path: 'deskLxTwo',
//       placeholder: '请输入位置2课桌面照度',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '',
//       path: 'deskLxThree',
//       placeholder: '请输入位置3课桌面照度',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '',
//       path: 'deskLxFour',
//       placeholder: '请输入位置4课桌面照度',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '课桌面最小照度：',
//       path: 'deskLxMin',
//       placeholder: '请输入课桌面最小照度',
//       suffix: 'LX'
//     }
//   ]
// };

// const config4 = {
//   layout: {
//     gap: 10,
//     cols: 3
//   },
//   columns: [
//     {
//       type: 'input',
//       label: '黑板编号：',
//       path: 'blackboardSerialNumber',
//       placeholder: '请输入黑板编号'
//     },
//     {
//       type: 'input',
//       label: '黑板长度：',
//       path: 'blackboardLength',
//       placeholder: '请输入黑板长度',
//       suffix: 'm'
//     },
//     {
//       type: 'input',
//       label: '黑板宽度：',
//       path: 'blackboardWidth',
//       placeholder: '请输入黑板宽度',
//       suffix: 'm'
//     },
//     {
//       type: 'input',
//       label: '悬挂高度：',
//       path: 'blackboardRideHeight',
//       placeholder: '请输入悬挂高度',
//       suffix: 'm'
//     },
//     {
//       type: 'select',
//       label: '电子屏幕类型：',
//       path: 'screenType',
//       placeholder: '请输入电子屏幕类型',
//       options: [
//         { label: 'LED显示屏', value: 'LED显示屏' },
//         { label: '液晶显示屏', value: '液晶显示屏' }
//       ]
//     },
//     {
//       type: 'input',
//       label: '电子屏幕尺寸：',
//       path: 'screenSize',
//       placeholder: '请输入电子屏幕尺寸',
//       suffix: 'm'
//     },
//     {
//       type: 'input',
//       label: '电子屏幕高亮：',
//       path: 'screenSize',
//       placeholder: '请输入电子屏幕高亮',
//       suffix: 'cd/㎡'
//     },
//     {
//       type: 'input',
//       label: '电子屏幕分辨率：',
//       path: 'screenPx',
//       placeholder: '请输入电子屏幕分辨率',
//       suffix: 'px'
//     }
//   ]
// };

// const config5 = {
//   layout: {
//     gap: 10,
//     cols: 3
//   },
//   columns: [
//     {
//       type: 'input',
//       label: '黑板入射照度：',
//       path: 'blackboardIncomingLx',
//       placeholder: '请输入黑板入射照度',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '黑板反射照度：',
//       path: 'blackboardReflectLx',
//       placeholder: '请输入黑板反射照度',
//       suffix: 'LX'
//     }
//   ]
// };

// const config6 = {
//   layout: {
//     gap: 10,
//     cols: 4
//   },
//   columns: [
//     {
//       type: 'input',
//       label: '黑板面照度：',
//       path: 'blackboardLxOne',
//       placeholder: '黑板面照度1',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '',
//       path: 'blackboardLxTwo',
//       placeholder: '黑板面照度2',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '',
//       path: 'blackboardLxTwo',
//       placeholder: '黑板面照度3',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '',
//       path: 'blackboardLxTwo',
//       placeholder: '黑板面照度4',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '黑板面最小照度：',
//       path: 'blackboardLxMin',
//       placeholder: '请输入黑板面最小照度',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '黑板面均匀度：',
//       path: 'blackboardUnif',
//       placeholder: '请输入黑板面均匀度',
//       suffix: 'LX'
//     }
//   ]
// };

// const config7 = {
//   layout: {
//     gap: 10,
//     cols: 4
//   },
//   columns: [
//     {
//       type: 'input',
//       label: '室内照度：',
//       path: 'indoorLx',
//       placeholder: '请输入室内照度',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '室外照度：',
//       path: 'outdoorLx',
//       placeholder: '请输入室外照度',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '采光系数：',
//       path: 'daylightFactor',
//       placeholder: '请输入采光系数',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '窗面积：',
//       path: 'windowArea',
//       placeholder: '请输入窗面积',
//       suffix: '㎡'
//     },
//     {
//       type: 'input',
//       label: '地面积：',
//       path: 'landArea',
//       placeholder: '请输入地面积',
//       suffix: '㎡'
//     },
//     {
//       type: 'input',
//       label: '后墙入射照度：',
//       path: 'backwallIncomingLx',
//       placeholder: '请输入后墙入射照度',
//       suffix: 'LX'
//     },
//     {
//       type: 'input',
//       label: '后墙反射照度：',
//       path: 'backwallReflectLx',
//       placeholder: '请输入后墙反射照度',
//       suffix: 'LX'
//     }
//   ]
// };

const validateRef = async (...rest) => {
  console.log(rest, 'rest');

  const promiseList = rest.map(item => {
    const promise = new Promise(resolve => {
      item.value.validate(err => {
        resolve(err);
      });
    });
    return promise;
  });
  const data = await Promise.all(promiseList);
  console.log(data, 'data');
  const resData = data
    ?.filter(item => item)
    ?.reduce((pre, next) => {
      if (!next) return pre;
      return [...pre, ...next];
    }, []);
  return resData.length ? resData : null;
};

// const handleValue = e => {
//   console.log(e, 'e');
// };

const handleSubmit = async arg => {
  console.log(arg, 'arg');
  console.log('提交', formValue, 'formValue');
  // console.log(formRef);
  console.log(formValue, 'formValue外边的');
  console.log(formRef2.value, 'formRef');

  const errors = await validateRef(formRef1, formRef2);

  if (!errors) {
    window.$message.success('验证成功');
  } else {
    console.log(errors);
    window.$message.error('验证失败');
  }
};
// 监听某个字段变化来控制下面的变化

// watchEffect(() => {
//   console.log(formValue, 'floor');
//   console.log('最外边数据变化');
//   console.log(formValue.buildingId, 'formValue');
//   // const
//   console.log(unref(floorRef)?.getSelectData(), 'floorRef');
//   unref(floorRef)?.getSelectData({ schoolId: formValue.schoolId, buildingId: formValue.buildingId });

//   formValue.floorId = null;
//   console.log(formValue, 'formValue888');
//   // Reflect.deleteProperty(formValue, 'floorId')
//   console.log(config, 'config');

//   // getSelectDataFloor();
//   // console.log(instance, 'instance');
//   // instance.refs
// }, formValue.buildingId);

watch(formValue, () => {
  console.log('数据变化', formValue);
  // eslint-disable-next-line no-self-assign
  // config = config;
});

watch(
  () => formValue.buildingId,
  () => {
    console.log(formValue, 'floor');
    console.log('最外边数据变化');
    console.log(formValue.buildingId, 'formValue');
    // const
    console.log(unref(floorRef)?.getSelectData(), 'floorRef');
    // floorRef?.value?.getSelectData()
    // const { getSelectData: getSelectDataFloor } = floorRef?.value ?? {};
    // debugger;
    unref(floorRef)?.getSelectData({ schoolId: formValue.schoolId, buildingId: formValue.buildingId });

    formValue.floorId = null;
    console.log(formValue, 'formValue888');
    // Reflect.deleteProperty(formValue, 'floorId')
    console.log(config, 'config');

    // getSelectDataFloor();
    // console.log(instance, 'instance');
    // instance.refs
  }
  // { immediate: true }
);
</script>

<style lang="less" scoped>
// :deep(.n-form-item-blank) {
// }
</style>
