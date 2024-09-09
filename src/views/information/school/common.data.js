import { ref } from 'vue';
import { REGEXP_CREDIT_CODE } from '@common/utils/form/regxp';
import { verifyCreditCode, checkOrgNameExist } from '@/api/institution2';

// 表单校验
const regb = { required: true, trigger: ['blur'] };
const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['change', 'blur'] };
export const formRef = ref(null);
export const createRules = formValue => ({
  name: {
    required: true,
    trigger: ['blur'],
    validator: function (_, value) {
      if (!value) return new Error('请输入机构名称');
      if (value.trim()?.length > 100) return new Error('请输入100个以内字符');
      const { copyname } = formValue;
      if (value == copyname) return true;
      return new Promise((resolve, reject) => {
        checkOrgNameExist({ name: value }).then(data => {
          if (data) {
            reject(new Error('机构名已经存在'));
          } else {
            resolve(true);
          }
        });
      });
    }
  },
  socialCreditCode: {
    required: true,
    trigger: 'blur',
    validator: function (_, value) {
      if (!value) return new Error('请输入统一社会信用代码');
      if (!REGEXP_CREDIT_CODE.test(value)) return new Error('请输入正确的社会信用代码格式');
      const { socialCreditCodeInit } = formValue;
      if (value == socialCreditCodeInit) return true;
      return new Promise((resolve, reject) => {
        verifyCreditCode({ creditCode: value }).then(data => {
          if (data) {
            reject(new Error('该统一社会信用代码已存在'));
          } else {
            resolve(true);
          }
        });
      });
    }
  },
  regionId: { ...rbc, message: '请选择所属地区' },
  address: { ...rbi, message: '请输入100个以内字符' },
  lnglat: {
    required: true,
    message: '请选择机构坐标',
    trigger: 'blur',
    key: 'lnglat'
  },
  roleId: { ...rbc, message: '请选择机构权限组', pattern: /[0-9]/ },
  accountNumber: { ...rbc, message: '请选择账号数量', pattern: /[0-9]/ },
  dateRange: {
    ...rbc,
    validator: function (_, value) {
      if (!value?.length) return new Error('请选择机构有效期');
      return true;
    }
  },
  dataMaskingType: {
    ...regb,
    validator: function (_, value) {
      const { isDataMasking } = formValue;
      if (isDataMasking && !value?.length) {
        return new Error('点击设置，选择脱敏字段');
      }
      return true;
    }
  }
});

export const schoolAttrOptions = [
  { label: '独立学校', value: 1 },
  { label: '附属校区', value: 2 },
  { label: '集团学校', value: 3 }
];
export const schoolTypeOptions = [
  { label: '常规', value: 10 },
  { label: '武校', value: 15 },
  { label: '体校', value: 20 },
  { label: '艺校', value: 25 },
  { label: '特殊学校', value: 30 },
  { label: '职高', value: 35 }
];
export const schoolLevelOptions = [
  { label: '常规', value: 10 },
  { label: '市示范', value: 15 },
  { label: '市一级', value: 16 },
  { label: '市二级', value: 17 },
  { label: '省一级', value: 20 },
  { label: '省二级', value: 25 },
  { label: '省三级', value: 30 },
  { label: '省示范', value: 35 },
  { label: '国家级', value: 40 }
];
export const schoolLearnPeriod = [
  // { label: '无', value: 0 },
  { label: '幼儿园', value: 1 },
  { label: '小学', value: 2 },
  { label: '初中', value: 3 },
  { label: '普高', value: 4 },
  { label: '职高', value: 5 },
  { label: '大专', value: 6 },
  { label: '本科', value: 7 }
];
export const schoolStausOptions = [
  { label: '运营中', value: 0 },
  { label: '已停用', value: 1 }
];
export const areaNumOptions = [
  { label: '好片', value: 1 },
  { label: '中片', value: 2 },
  { label: '差片', value: 3 }
];
export const accountNumberOptions = [
  { label: 10, value: 10 },
  { label: 20, value: 20 },
  { label: 30, value: 30 },
  { label: 40, value: 40 },
  { label: 50, value: 50 },
  { label: 100, value: 100 }
];
export const monitotNumOptions = [
  { label: '城区', value: '1' },
  { label: '乡镇', value: '2' }
];
export const officeCategoryOptions = [
  { label: '公办', value: 1 },
  { label: '民办', value: 0 }
];
export const UrbanRuralAttributeOptions = [
  { label: '城市', value: 0 },
  { label: '乡镇', value: 1 }
];
export const hosptialAttrOptions = [
  { label: '独立医院', value: 4 },
  { label: '集团医院', value: 5 }
];
export const hosptialTypesOptions = [
  { label: '专科医院', value: 10 },
  { label: '综合医院', value: 15 }
];
export const hosptialOwnerOptions = [
  { label: '公立医院', value: 10 },
  { label: '民营医院', value: 15 }
];
export const hosptialLevelOptions = [
  { label: '一级甲等', value: 16 },
  { label: '一级乙等', value: 17 },
  { label: '一级丙等', value: 18 },
  { label: '二级甲等', value: 26 },
  { label: '二级乙等', value: 27 },
  { label: '二级丙等', value: 28 },
  { label: '三级特等', value: 35 },
  { label: '三级甲等', value: 36 },
  { label: '三级乙等', value: 37 },
  { label: '三级丙等', value: 38 },
  { label: '一级专科', value: 6 },
  { label: '二级专科', value: 7 },
  { label: '三级专科', value: 8 }
];
export const hosptialStausOptions = [
  // { label: '正常', value: 0 },
  // { label: '已停用', value: 1 }
  { label: '运营中', value: 0 },
  { label: '已停用', value: 1 }
];
export const societyAttrOptions = [
  { label: '独立社会机构', value: 6 },
  { label: '集团社会机构', value: 7 }
];
export const societyStatucOptions = [
  // { label: '正常', value: 0 },
  // { label: '停用', value: 1 }
  { label: '运营中', value: 0 },
  { label: '已停用', value: 1 }
];
export const governmentAttrOptions = [
  { label: '教育局', value: 1 },
  { label: '卫建委', value: 2 },
  { label: '市监局', value: 3 }
];
export const governmentStatucOptions = [
  // { label: '正常', value: 0 },
  // { label: '已停用', value: 1 }
  { label: '运营中', value: 0 },
  { label: '已停用', value: 1 }
];
