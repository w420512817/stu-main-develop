import { useDialog } from 'naive-ui';
import { isFunction } from '@common/utils/common/is';

/** 提示框 */
export function usePreDialog() {
  const dialog = useDialog();

  const dialogOptions = {
    type: 'warning',
    title: '提示',
    content: '确定执行此操作吗？',
    positiveText: '确定',
    negativeText: '取消'
  };

  function createDialog(opts = {}) {
    const options = Object.assign({}, dialogOptions, opts);
    return dialog.create(options);
  }

  function dialogWarning(content = '确定执行此操作吗？', onOk, onCancel) {
    const d = createDialog({
      content: content,
      onPositiveClick: () => {
        d.loading = true;
        if (isFunction(onOk)) {
          return onOk()?.catch(_ => {
            d.loading = false;
          });
        }
      },
      onNegativeClick: onCancel
    });
    return d;
  }

  function dialogSuccess(content = '', onOk, onCancel) {
    return createDialog({
      type: 'success',
      title: '成功',
      content: content,
      negativeText: undefined,
      onPositiveClick: onOk,
      onNegativeClick: onCancel
    });
  }

  function dialogInfo(content = '', onOk, onCancel) {
    const d = createDialog({
      type: 'info',
      content: content,
      onPositiveClick: () => {
        d.loading = true;
        if (isFunction(onOk)) {
          return onOk()?.catch(_ => {
            d.loading = false;
          });
        }
      },
      onNegativeClick: onCancel
    });
    return d;
  }

  function dialogError(content = '', onOk, onCancel) {
    const d = createDialog({
      type: 'error',
      content: content,
      onPositiveClick: () => {
        d.loading = true;
        if (isFunction(onOk)) {
          return onOk()?.catch(_ => {
            d.loading = false;
          });
        }
      },
      onNegativeClick: onCancel
    });
    return d;
  }

  return {
    dialog: opts => createDialog(opts),
    dialogWarning,
    dialogSuccess,
    dialogInfo,
    dialogError
  };
}
