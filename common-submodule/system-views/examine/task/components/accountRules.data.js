import { REGEXP_PWD, REGEXP_ACCOUNT, REGEXP_PHONE } from '@common/utils/form/regxp';
import { getConfirmPwdRule } from '@common/utils/form/rule';
import { CheckExist } from '@common/api/examine/task';

const rbi = { required: true, trigger: ['blur', 'input'] };

export const rules = ({ password }) => ({
  // orgId: { ...rbi, message: '请选择机构' },
  realName: { ...rbi, message: '请输入姓名' },
  account: [
    { ...rbi, pattern: REGEXP_ACCOUNT, message: '6-30字符的英文和数字输入，必须包含英文字母' },
    {
      trigger: 'blur',
      async validator(_r, account) {
        if (!account || !REGEXP_ACCOUNT.test(account)) return;
        return CheckExistFunc({ account });
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
      return CheckExistFunc({ phone });
    }
  },
  idCard: [
    { ...rbi, message: '请输入身份证号' },
    {
      trigger: 'blur',
      async validator(_r, idCard) {
        if (!idCard) return;
        return CheckExistFunc({ idCard });
      }
    }
  ],
  password: {
    ...rbi,
    pattern: REGEXP_PWD,
    message: '支持8-20字符，且必须包含字母和数字'
  },
  confirmPassword: getConfirmPwdRule(password)
});

async function CheckExistFunc(data) {
  data.isBizPlatform = true;
  const { success, message } = await CheckExist(data);
  if (success) return Promise.resolve(true);
  else return Promise.reject(new Error(message));
}

export function password() {
  function RandomNumBoth(Min, Max) {
    let Range = Max - Min;
    let Rand = Math.random();
    let num = Min + Math.round(Rand * Range); // 四舍五入
    return num;
  }
  const pos = RandomNumBoth(8, 20);
  let password = '';
  while (!password) {
    let pas = '';
    for (let i = 0; i < pos; i++) {
      // 随机字符串 ASCLL码0-9 A-Z a-z
      switch (RandomNumBoth(1, 3)) {
        case 1:
          {
            let number = RandomNumBoth(48, 57);
            pas += String.fromCharCode(number);
          }
          break;
        case 2:
          {
            let cap = RandomNumBoth(65, 90);
            pas += String.fromCharCode(cap);
          }
          break;
        case 3:
          {
            let lower = RandomNumBoth(97, 122);
            pas += String.fromCharCode(lower);
          }
          break;
      }
    }
    // 判断符合规则
    if (REGEXP_PWD.test(pas)) {
      password = pas;
    }
  }

  return password;
}
