import { ref } from 'vue';
import { REGEXP_PWD, REGEXP_ACCOUNT, REGEXP_PHONE } from '@common/utils/form/regxp';
// import { isIdcardRule } from '@common/utils/form/rule';

export const formRef = ref(null);
const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['blur', 'change'] };
import { CheckExist } from '@/api/systemManage/account';

async function CheckExistFunc(data) {
  data.isBizPlatform = true;
  const { success, message } = await CheckExist(data);
  if (success) return Promise.resolve(true);
  else return Promise.reject(new Error(message));
}

export const addAccountRules = form => ({
  orgId: { ...rbi, message: '请选择机构' },
  realName: { ...rbc, message: '请输入姓名' },
  account: [
    { ...rbi, pattern: REGEXP_ACCOUNT, message: '6-30字符的英文和数字输入，必须包含英文字母' },
    {
      trigger: 'blur',
      async validator(_r, account) {
        if (!account || !REGEXP_ACCOUNT.test(account)) return;
        return CheckExistFunc({ account, id: form?.id });
      }
    }
  ],
  phone: {
    trigger: ['blur', 'input'],
    required: true,
    async validator(_r, phone) {
      if (!phone) {
        throw Error('请输入手机号');
      }
      if (!REGEXP_PHONE.test(phone)) {
        throw Error('请输入正确的手机号');
      }
      return CheckExistFunc({ phone, id: form?.id });
    }
  },
  idCard: [
    { ...rbi, message: '请输入身份证号' },
    {
      trigger: 'blur',
      async validator(_r, idCard) {
        if (!idCard) return;
        return CheckExistFunc({ idCard, id: form?.id });
      }
    }
  ],
  regionId: { ...rbc, message: '请选择' },
  roleId: {
    ...rbc,
    message: '请选择角色'
  },
  permissonList: {
    ...rbc,
    message: '请选择数据权限',
    type: 'array'
  },
  password: { ...rbc, pattern: REGEXP_PWD, message: '支持8-20字符，且必须包含字母和数字' },
  confirmPassword: {
    ...rbi,
    validator: (rule, value) => {
      if (!value) return new Error('请输入确认密码');
      const { password } = form;
      if (password != value) return new Error('两次输入密码不一致');
      return true;
    }
  }
});
