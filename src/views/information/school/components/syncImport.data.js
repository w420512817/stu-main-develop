import {
  importExcelSchoolData as importSchool,
  exportExcelSchoolData as exportSchoolError
} from '@/api/information/school';

export const importData = {
  school: {
    typeName: '学校',
    modalTitle: '导入学校信息',
    tempUrl: './files/导入学校信息.xlsx',
    importApi: importSchool,
    exportErrorApi: exportSchoolError
  }
};
