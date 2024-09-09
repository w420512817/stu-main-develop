import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
// 地区只显示到 市级
export const getArea = computed(() => {
  const { areaTree } = storeToRefs(userStore);
  const mapTree = item => {
    const haveChid = Array.isArray(item.children) && item.children.length > 0;
    return {
      ...item,
      children: haveChid && item.level < 2 ? item.children.map(d => mapTree(d)) : null
    };
  };
  return areaTree.value?.map(d => mapTree(d)) ?? [];
});
// 将年级 班级 学段 转换格式
export const transferCollapseData = arr => {
  const mapClass = (item, schoolTypes, gradeId) => {
    return {
      key: item.classId,
      label: item.className,
      depth: 3,
      schoolTypes,
      gradeId,
      classId: item.classId,
      children: null,
      disabled: false
    };
  };
  const mapGrade = (item, schoolTypes) => {
    const haveClass = Array.isArray(item.classList) && item.classList.length > 0;
    return {
      key: item.gradeId,
      // label: item.gradeName,
      label: `${item.gradeName}(${item.studyYear}级)`,
      depth: 2,
      schoolTypes,
      classId: null,
      gradeId: item.gradeId,
      disabled: true,
      children: haveClass ? item.classList.map(subitem => mapClass(subitem, schoolTypes, item.gradeId)) : null
    };
  };
  return arr.map(d => {
    const key = d.schoolTypesId;
    const label = d.schoolTypes;
    let children = null;

    if (d.gradeTree) {
      children = d.gradeTree.map(m => mapGrade(m, key));
    }
    return {
      key,
      label,
      children,
      depth: 1,
      schoolTypes: key,
      classId: null,
      gradeId: null,
      disabled: true
    };
  });
};
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
export const hosptialTypesOptions = [
  { label: '专科医院', value: 10 },
  { label: '综合医院', value: 15 }
];
export const hosptialAttrOptions = [
  { label: '独立医院', value: 4 },
  { label: '集团医院', value: 5 }
];

export const societyAttrOptions = [
  { label: '独立社会机构', value: 6 },
  { label: '集团社会机构', value: 7 }
];

export const teacherPositionOptions = [
  { label: '院长', value: 1 },
  { label: '年级主任', value: 2 },
  { label: '班主任', value: 3 },
  { label: '任课老师', value: 4 }
];
export const idCardTypeOptions = [
  { label: '居民身份证', value: 1 },
  { label: '无', value: 0 }
  // { label: '香港特区护照', value: 6 },
  // { label: '澳门特区护照', value: 7 },
  // { label: '台湾居民来往大陆通行证', value: 8 },
  // { label: '境外永久居住证', value: 9 }
];
export const sexOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 2 }
];
export const belongAreaTypeOptions = [
  { label: '内地(有身份证)', value: 0, stuValue: 8 },
  { label: '内地(无身份证)', value: 1, stuValue: 9 },
  { label: '非内地', value: 2, stuValue: 10 }
];
export const belongAreaOptions = [
  { label: '内地', value: 1 },
  { label: '非内地', value: 2 }
];
export const schoolRollOptions = [
  { label: '本校', value: 1 },
  { label: '外校', value: 2 }
];
export const studyStatusOptions = [
  { label: '在读', value: 1 },
  { label: '转学', value: 2 },
  { label: '退学', value: 3 },
  { label: '休学', value: 4 }
];

export const screeningStatusOptions = [
  { label: '已筛查', value: 1 },
  { label: '未筛查', value: 2 },
  { label: '筛查中', value: 3 }
];
export const approvalStatusOptions = [
  { label: '已通过', value: 1 },
  { label: '审核中', value: 2 },
  { label: '已驳回', value: 3 }
];

export const transferReasonOptions = [
  { label: '转学', value: 1 },
  { label: '毕业', value: 2 },
  { label: '离校', value: 3 },
  { label: '出国', value: 4 },
  { label: '休学', value: 5 },
  { label: '升学', value: 6 },
  { label: '其他', value: 7 }
];

export const nationOptions = [
  { value: 1, label: '汉族' },
  { value: 2, label: '蒙古族' },
  { value: 3, label: '回族' },
  { value: 4, label: '藏族' },
  { value: 5, label: '维吾尔族' },
  { value: 6, label: '苗族' },
  { value: 7, label: '彝族' },
  { value: 8, label: '壮族' },
  { value: 9, label: '布依族' },
  { value: 10, label: '朝鲜族' },
  { value: 11, label: '满族' },
  { value: 12, label: '侗族' },
  { value: 13, label: '瑶族' },
  { value: 14, label: '白族' },
  { value: 15, label: '土家族' },
  { value: 16, label: '哈尼族' },
  { value: 17, label: '哈萨克族' },
  { value: 18, label: '傣族' },
  { value: 19, label: '黎族' },
  { value: 20, label: '傈僳族' },
  { value: 21, label: '佤族' },
  { value: 22, label: '畲族' },
  { value: 23, label: '高山族' },
  { value: 24, label: '拉祜族' },
  { value: 25, label: '水族' },
  { value: 26, label: '东乡族' },
  { value: 27, label: '纳西族' },
  { value: 28, label: '景颇族' },
  { value: 29, label: '柯尔克孜族' },
  { value: 30, label: '土族' },
  { value: 31, label: '达翰尔族' },
  { value: 32, label: '么佬族' },
  { value: 33, label: '羌族' },
  { value: 34, label: '布朗族' },
  { value: 35, label: '撒拉族' },
  { value: 36, label: '毛南族' },
  { value: 37, label: '仡佬族' },
  { value: 38, label: '锡伯族' },
  { value: 39, label: '阿昌族' },
  { value: 40, label: '普米族' },
  { value: 41, label: '塔吉克族' },
  { value: 42, label: '怒族' },
  { value: 43, label: '乌孜别克族' },
  { value: 44, label: '俄罗斯族' },
  { value: 45, label: '鄂温克族' },
  { value: 46, label: '德昂族' },
  { value: 47, label: '保安族' },
  { value: 48, label: '裕固族' },
  { value: 49, label: '京族' },
  { value: 50, label: '塔塔尔族' },
  { value: 51, label: '独龙族' },
  { value: 52, label: '鄂伦春族' },
  { value: 53, label: '赫哲族' },
  { value: 54, label: '门巴族' },
  { value: 55, label: '珞巴族' },
  { value: 56, label: '基诺族' }
];
