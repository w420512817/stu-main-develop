import { toRaw } from 'vue';
import { AC_DELETE } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';

const { hasPermission } = usePermission();

export const createColumns = handleTableClick => {
  const pers = {
    delete: hasPermission(9392)
  };
  return [
    { title: '设备类型', key: 'equipmentType', align: 'center', minWidth: 100 },
    { title: '设备厂商', key: 'equipmentVendor', align: 'center', minWidth: 100 },
    { title: '设备型号', key: 'equipmentModel', align: 'center', minWidth: 100 },
    { title: '序列号', key: 'serialNumber', align: 'center', minWidth: 100 },
    { title: '支持筛查功能', key: 'screenCategory', align: 'center', minWidth: 150 },
    { title: '设备连接方式', key: 'connectWay', align: 'center', minWidth: 130 },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [{ label: '删除', show: pers.delete, disabled: false, act: AC_DELETE }]
        );
        return renderActions();
      }
    }
  ];
};

const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['blur', 'change'] };
export const rules = {
  equipmentModelId: { ...rbi, message: '请选择设备型号' },
  equipmentTypeId: { ...rbc, message: '请选择设备类型' },
  equipmentVendorId: { ...rbc, message: '请选择设备厂商' },
  serialNumber: { ...rbc, message: '请输入序列号' }
};
