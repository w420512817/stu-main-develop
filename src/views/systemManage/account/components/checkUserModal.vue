<template>
  <basic-modal
    class="w-450px"
    :mask-closable="false"
    cancel-text="换个账号"
    ok-text="继续新增"
    @register="register"
    @ok="handleOk"
    @cancel="handleCancel"
    @after-leave="restForm"
  >
    <div class="text-[#262626] fw-bold text-4 text-center mb-27px">
      识别到以下账号，可使用原信息及密码快速新增账号：
    </div>
    <div class="flex justify-center text-[#262626]">
      <div flex-col>
        <div flex mb-20px>
          <span w-80px text-right>姓名：</span>
          <span>{{ state.name }}</span>
        </div>

        <div flex mb-20px>
          <span w-80px text-right>手机号：</span>
          <span>{{ state.phone }}</span>
        </div>

        <div flex mb-20px>
          <span w-80px text-right>身份证：</span>
          <span>{{ state.idCard }}</span>
        </div>

        <div flex>
          <span w-80px text-right>用户名：</span>
          <span>{{ state.account }}</span>
        </div>

        <n-form v-if="filedName == 'account'" ref="formRef" :model="formData" :rules="rules">
          <div flex items-center>
            <n-button type="primary" ghost>校验信息</n-button>
            <n-form-item label="" path="phone" flex-1>
              <n-input v-model:value="formData.phone" placeholder="请输入完整手机号" />
            </n-form-item>
          </div>
        </n-form>
      </div>
    </div>
  </basic-modal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { REGEXP_PHONE } from '@common/utils/form/regxp';
import { checkUserInfo, getUserInfo } from '@/api/systemManage/account';

const emits = defineEmits(['onOk', 'onCancel', 'register']);

const formRef = ref(null);
const state = reactive({});
const formData = reactive({});
const filedName = ref('');

const rules = {
  phone: [
    { required: true, message: '请验证完整手机号码' },
    { pattern: REGEXP_PHONE, message: '手机号码格式错误', trigger: 'blur' }
  ]
};

const [register, { closeModal, setProps, changeLoading }] = useModalInner();

function checkUser(searchKey, key) {
  filedName.value = key;
  checkUserInfo({ searchKey }).then(res => {
    if (res) {
      if (key == 'phone') {
        formData.phone = searchKey;
      }
      Object.assign(state, res);
      setProps({ visible: true });
    }
  });
}

function handleCancel() {
  emits('onCancel', filedName.value);
}

function restForm() {
  formData.phone = null;
}

async function handleOk() {
  if (filedName.value == 'account') await formRef.value.validate();

  try {
    changeLoading(true);
    const info = await getUserInfo({
      phone: formData.phone,
      checkId: state.checkId
    });

    info && emits('onOk', info);
    closeModal();
  } finally {
    changeLoading(false);
  }
}

defineExpose({
  checkUser
});
</script>
