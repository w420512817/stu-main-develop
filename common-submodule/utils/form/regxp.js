/** 手机号码正则 */
export const REGEXP_PHONE =
  /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/;

/** 固定电话 */
export const REGEXP_TEL = /([0-9]{3,4}-)?[0-9]{7,8}/;

/** 邮箱正则 */
export const REGEXP_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/** 密码正则(密码为8-20位数字/字母的组合) */
export const REGEXP_PWD = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;

/** 验证码正则(6位数字) */
export const REGEXP_CODE = /^\d{6}$/;

/** 图片验证码正则(4位数字) */
export const REGEXP_IMG_CODE = /^\d{4}$/;

/** 用户名(6-30字符的英文和数字输入，必须包含英文字母) */
export const REGEXP_ACCOUNT = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{6,30}$/;

/** 统一社会信用代码 */
export const REGEXP_CREDIT_CODE = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/;
