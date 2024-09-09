import { importExcelData as importBuild, exportExcelError as exportBuildError } from '@/api/information/building';
import { importExcelData as importClass, exportExcelError as exportClassError } from '@/api/information/class';
import { importExcelData as importClassRoom, exportExcelError as exportCRError } from '@/api/information/classroom';
import { importExcelData as importFloor, exportExcelError as exportFloorError } from '@/api/information/floor';

export const importData = {
  build: {
    typeName: '教学楼',
    modalTitle: '导入教学楼信息',
    tempUrl: './files/导入教学楼信息.xlsx',
    importApi: importBuild,
    exportErrorApi: exportBuildError
  },
  class: {
    typeName: '班级',
    modalTitle: '导入班级信息',
    tempUrl: './files/导入班级信息.xlsx',
    importApi: importClass,
    exportErrorApi: exportClassError
  },
  classroom: {
    typeName: '教室',
    modalTitle: '导入教室信息',
    tempUrl: './files/导入教室信息.xlsx',
    importApi: importClassRoom,
    exportErrorApi: exportCRError
  },
  floor: {
    typeName: '楼层',
    modalTitle: '导入楼层信息',
    tempUrl: './files/导入楼层信息.xlsx',
    importApi: importFloor,
    exportErrorApi: exportFloorError
  }
};
