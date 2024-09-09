import { REGEXP_PHONE, REGEXP_EMAIL, REGEXP_PWD } from './regxp';

/** 表单规则 */
export const formRules = {
  account: [{ required: true, message: '请输入帐号' }],
  phone: [
    { required: true, message: '请输入手机号码' },
    { pattern: REGEXP_PHONE, message: '手机号码格式错误', trigger: ['blur', 'input'] }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { pattern: REGEXP_PWD, message: '密码应是包含8-20位数字和字母的组合', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码' }
    // { pattern: REGEXP_CODE, message: '验证码格式错误', trigger: 'blur' }
  ],
  email: [{ pattern: REGEXP_EMAIL, message: '邮箱格式错误', trigger: 'blur' }],

  // 身份证
  idcard: {
    required: true,
    validator: (rule, value) => {
      if (!value) {
        return Promise.reject('请输入身份证号');
      }
      if (!isIdcardRule(value)) {
        return Promise.reject('身份证号码格式有误');
      }
      return Promise.resolve();
    },
    trigger: 'blur'
  }
};

/** 获取确认密码的表单规则 */
export function getConfirmPwdRule(pwd) {
  const confirmPwdRule = [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value !== pwd.value) {
          return Promise.reject(rule.message);
        }
        return Promise.resolve();
      },
      message: '两次输入密码不一致',
      trigger: 'blur'
    }
  ];
  return confirmPwdRule;
}
/** 通过身份证号获取生日 */
export function getBirth(idCard) {
  let birthday = '';
  const card = idCard.replace(/(^\s*)|(\s*$)/g, '');
  if (card != null && card != '') {
    if (card.length == 15) {
      birthday = '19' + card.slice(6, 12);
    } else if (card.length == 18) {
      birthday = card.slice(6, 14);
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');
    // 通过正则表达式来指定输出格式为:1990-01-01
  }
  return birthday;
}

/** 通过身份证号获取性别 */
export function getSex(idCard) {
  let sex = 0;
  const card = idCard.replace(/(^\s*)|(\s*$)/g, '');
  if (parseInt(card.slice(-2, -1)) % 2 == 1) {
    sex = 1;
  } else {
    sex = 2;
  }
  return sex;
}
/** 获取图片验证码的表单规则 */
export function getImgCodeRule(imgCode) {
  const imgCodeRule = [
    { required: true, message: '请输入验证码' },
    {
      validator: (rule, value) => {
        if (value !== imgCode.value) {
          return Promise.reject(rule.message);
        }
        return Promise.resolve();
      },
      message: '验证码不正确',
      trigger: 'blur'
    }
  ];
  return imgCodeRule;
}

/** 身份证验证表单规则 **/
export function isIdcardRule(idCard) {
  if (!idCard) return false;
  const idCards = trim(idCard.replace(/ /g, ''));
  if (idCard.length === 15) {
    return isValidityBrithBy15IdCard(idCards);
  } else if (idCards.length === 18) {
    const idCardS = idCards.split(''); // 得到身份证数组
    if (isValidityBrithBy18IdCard(idCards) && isTrueValidateCodeBy18IdCard(idCardS)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }

  function isTrueValidateCodeBy18IdCard(aIdCard) {
    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    const ValideCode = ['1', '0', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    const AidCard = aIdCard;
    if (AidCard[17].toLowerCase() === 'x') {
      AidCard[17] = '10';
    }
    for (let i = 0; i < 17; i += 1) {
      sum += Wi[i] * AidCard[i];
    }
    const valCodePosition = sum % 11;
    if (AidCard[17] === ValideCode[valCodePosition]) {
      return true;
    } else {
      return false;
    }
  }

  function isValidityBrithBy18IdCard(idCard18) {
    const year = idCard18.substring(6, 10);
    const month = idCard18.substring(10, 12);
    const day = idCard18.substring(12, 14);
    const tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
    if (
      tempDate.getFullYear() !== parseFloat(year) ||
      tempDate.getMonth() !== parseFloat(month) - 1 ||
      tempDate.getDate() !== parseFloat(day)
    ) {
      return false;
    } else {
      return true;
    }
  }

  function isValidityBrithBy15IdCard(idCard15) {
    const year = idCard15.substring(6, 8);
    const month = idCard15.substring(8, 10);
    const day = idCard15.substring(10, 12);
    const tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
    if (
      tempDate.getYear() !== parseFloat(year) ||
      tempDate.getMonth() !== parseFloat(month) - 1 ||
      tempDate.getDate() !== parseFloat(day)
    ) {
      return false;
    } else {
      return true;
    }
  }

  function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }
}
