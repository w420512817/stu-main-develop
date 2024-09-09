import {
  importExcelUserData as importAccount,
  exportExcelUserData as exportAccountError
} from '@/api/systemManage/account';

export const importData = {
  account: {
    typeName: '账号',
    modalTitle: '导入账号信息',
    tempUrl: './files/导入账号信息.xlsx',
    importApi: importAccount,
    exportErrorApi: exportAccountError
  }
};
