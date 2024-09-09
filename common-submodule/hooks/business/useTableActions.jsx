import { NDropdown, NDivider } from 'naive-ui';
import { iconifyRender } from '@common/utils/common/icon';
import { ClearButton } from '@common/components/naive-ui';
import { isFunction, isArray } from '@common/utils/common/is';

export default function useTableActios(clickFn, actions = []) {
  if (!clickFn || !isFunction(clickFn)) {
    throw new Error('useTableActios() 的第一个参数必须是有个回调函数！');
  }

  if (!actions || !isArray(actions)) {
    throw new Error('useTableActios() 的第二个参数必须是一个包含按钮信息的数组！');
  }

  const showBtns = actions.filter(btn => {
    if (Reflect.has(btn, 'show')) {
      return btn.show;
    }
    return true;
  });
  const hasActions = showBtns.length >= 1;

  const renderBtn = ({ act, text = true, label, type = 'primary', disabled = false, icon, size = 'small' }) => (
    <ClearButton
      size={size}
      disabled={disabled}
      text={text}
      type={type}
      icon={icon}
      label={label || text}
      onClick={$event => clickFn(act, $event)}
    />
  );

  const renderDivider = () => <NDivider vertical />;

  const renderBtns = () => {
    return showBtns.map((btn, index) => {
      return (
        <>
          {renderBtn({ ...btn })}
          {index !== showBtns.length - 1 ? renderDivider() : null}
        </>
      );
    });
  };

  const renderSelect = () => {
    const selectOpts = showBtns.slice(1).map(({ label, disabled = false, act, icon }) => {
      return {
        label,
        disabled,
        key: act,
        icon: icon && iconifyRender(icon)
      };
    });

    return (
      <NDropdown options={selectOpts} onSelect={key => clickFn(key)}>
        <ClearButton text type="primary" icon-placement="right" label="更多" icon="carbon:chevron-down" />
      </NDropdown>
    );
  };

  /**
   * 动态获取操作按钮
   * @param hiddenInSelect 是否用下拉菜单展示多余按钮 默认true 当操作按钮 >= 3 个时生效
   */
  function renderActions(hiddenInSelect = true) {
    if (!hasActions) return null;
    if (!hiddenInSelect || showBtns.length <= 2) {
      return (
        <div flex-y-center flex-nowrap>
          {renderBtns()}
        </div>
      );
    }

    if (showBtns.length >= 3) {
      return (
        <div flex-y-center flex-nowrap>
          {renderBtn({ ...showBtns[0] })}
          {renderDivider()}
          {renderSelect()}
        </div>
      );
    }
  }

  return {
    hasActions,
    renderActions
  };
}
